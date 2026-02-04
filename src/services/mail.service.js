import nodemailer from "nodemailer";

export const sendProjectEmail = async (email, name, project) => {
  const html = `
  <div style="font-family: Arial; max-width: 600px; margin: auto;">
    <h2>Hello ${name},</h2>

    <p><strong>Your assigned project is:</strong></p>

    <h3>${project.title}</h3>
    <p>${project.problem}</p>

    <h4>Expected Sections</h4>
    <ul>
      ${project.sections.map((s) => `<li>${s}</li>`).join("")}
    </ul>

    <h4>Creativity Focus</h4>
    <ul>
      ${project.creativity.map((c) => `<li>${c}</li>`).join("")}
    </ul>

    <p style="margin-top:20px;">
      <strong>Note:</strong> This project is assigned only once and cannot be changed.
    </p>

    <p>All the best! 🚀</p>
  </div>
  `;

  console.log("Email sent to", email);
  console.log("Sender:", process.env.MAIL_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your Workshop Project Assignment",
    // text: options.message,
    html: html,
  };

  await transporter.sendMail(mailOptions);

  //   await resend.emails.send({
  //     from: "Workshop Allocator <onboarding@resend.dev>",
  //     to: email,
  //     subject: "Your Workshop Project Assignment",
  //     html,
  //   });
};
