/** @format */

import nodemailer from "nodemailer";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import path from "path";
import logger from "../config/logger";
const sparkPostTransport = require("nodemailer-sparkpost-transport");

const NAMESPACE = "Mail utility";

interface iMailProps {
  to: string | string[];
  subject: string;
  template: string;
  context?: object;
}

export const sendEmailFromTemplate = async (
  mailProps: iMailProps
): Promise<boolean> => {
  try {
    // const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: parseInt(process.env.SMTP_PORT as string),
    //     secure: false,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASSWORD,
    //     },
    // });
    const transporter = nodemailer.createTransport(
      sparkPostTransport({
        sparkPostApiKey: process.env.SPARKPOST_API_KEY,
      })
    );

    const handlebarsOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("server", "templates", "emails"),
        defaultLayout: false,
      },
      viewPath: path.resolve("server", "templates", "emails"),
    };
    transporter.use("compile", hbs(handlebarsOptions));

    const { to, subject, template, context } = mailProps;

    const message = {
      to,
      from: process.env.SMTP_FROM,
      subject,
      template,
      context,
    };

    const mailres = await transporter.sendMail(message);
    return true;
  } catch (err: any) {
    logger.error(NAMESPACE, "Error sending mail", err);
    return false;
  }
};
