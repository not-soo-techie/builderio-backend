import { projects } from "../projects/projects.js";
import { sendProjectEmail } from "../services/mail.service.js";
import User from "../models/User.js";

export const assignTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { selectedPool } = req.body;

  if (!selectedPool || selectedPool < 1 || selectedPool > 10) {
    return res.status(400).json({ message: "Invalid project pool" });
  }

  try {
    // Prevent reassignment
    if (req.user.hasAssignedProject) {
      return res.status(400).json({ message: "Task already assigned" });
    }

    const eligibleProjects = projects.slice(0, selectedPool);
    const randomIndex = Math.floor(Math.random() * eligibleProjects.length);
    const selectedProject = eligibleProjects[randomIndex];

    // Save assignment
    await User.findByIdAndUpdate(req.user._id, {
      hasAssignedProject: true,
      assignedProjectId: selectedProject.id,
      assignedAt: new Date(),
    });

    // Send email
    await sendProjectEmail(req.user.email, req.user.name, selectedProject);

    return res.json({
      success: true,
      assignedTaskId: selectedProject.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assignment failed" });
  }
};

export const submitProject = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { githubRepoUrl } = req.body;

  if (!githubRepoUrl) {
    return res.status(400).json({ message: "GitHub repo URL is required" });
  }

  if (!githubRepoUrl.startsWith("https://github.com/")) {
    return res.status(400).json({ message: "Invalid GitHub repository URL" });
  }

  if (req.user.hasSubmittedProject) {
    return res.status(400).json({ message: "Project already submitted" });
  }

  try {
    await User.findByIdAndUpdate(req.user._id, {
      githubRepoUrl,
      hasSubmittedProject: true,
      submittedAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed" });
  }
};

