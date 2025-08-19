// src/services/email.service.ts
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import path from "path";
import fs from "fs/promises";

interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(config: EmailServiceConfig, defaultFrom: string) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
    this.defaultFrom = defaultFrom;
  }

  async sendMail(options: MailOptions): Promise<void> {
    const mailOpts: SendMailOptions = {
      from: options.from ?? this.defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
    };

    await this.transporter.sendMail(mailOpts);
  }
}

const emailService = new EmailService(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_APP_PASSWORD as string,
    },
  },
  `"GitConnect" <${process.env.GMAIL_USER}>`
);

async function sendVerificationEmail(
  userEmail: string,
  verificationLink: string
) {
  const templatePath = path.resolve(
    process.cwd(),
    "src/templates/verificationEmail.html"
  );

  let htmlContent = await fs.readFile(templatePath, "utf-8");
  htmlContent = htmlContent.replace(/{{verificationLink}}/g, verificationLink);

  await emailService.sendMail({
    to: userEmail,
    subject: "Please verify your email address",
    html: htmlContent,
  });
}

async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
  const templatePath = path.resolve(
    process.cwd(),
    "src/templates/passwordResetEmail.html"
  );

  let htmlContent = await fs.readFile(templatePath, "utf-8");
  htmlContent = htmlContent.replace(/{{resetLink}}/g, resetLink);

  await emailService.sendMail({
    to: userEmail,
    subject: "Reset your password",
    html: htmlContent,
  });
}

export { emailService, sendVerificationEmail, sendPasswordResetEmail };
