// import nodemailer from "nodemailer";
import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend('re_FAfMTvKL_CByJRCVSq2FgWs4QTRF2RAdh');


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// });

// export const sendTaskEmail = async (email, task) => {
//   await transporter.sendMail({
//     to: email,
//     subject: "Your Assigned Workshop Task",
//     html: `
//       <h2>${task.title}</h2>
//       <p>${task.description}</p>
//       <p><b>This task was assigned only once.</b></p>
//     `
//   });
// };


export const sendProjectEmail = async (email, name, project) => {
  const html = `
  <div style="font-family: Arial; max-width: 600px; margin: auto;">
    <h2>Hello ${name},</h2>

    <p><strong>Your assigned project is:</strong></p>

    <h3>${project.title}</h3>
    <p>${project.problem}</p>

    <h4>Expected Sections</h4>
    <ul>
      ${project.sections.map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h4>Creativity Focus</h4>
    <ul>
      ${project.creativity.map(c => `<li>${c}</li>`).join("")}
    </ul>

    <p style="margin-top:20px;">
      <strong>Note:</strong> This project is assigned only once and cannot be changed.
    </p>

    <p>All the best! 🚀</p>
  </div>
  `;

  console.log("Email sent to", email);
  console.log("Sender:", process.env.MAIL_USER);
//   await transporter.sendMail({
//     from: "Workshop Allocator <onboarding@resend.dev>",
//     to: email,
//     subject: "Your Workshop Project Assignment",
//     html,
//   });

  await resend.emails.send({
    from: "Workshop Allocator <onboarding@resend.dev>",
    to: email,
    subject: "Your Workshop Project Assignment",
    html,
  });
};
