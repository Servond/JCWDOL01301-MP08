import nodemailer from "nodemailer";
import { NODEMAILER_EMAIL,NODEMAILER_PASS } from "@/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: String(NODEMAILER_EMAIL),
    pass: String(NODEMAILER_PASS),
  },
});
