/** True when server-side contact email (Nodemailer) is configured. No secrets exposed. */
export function isContactSmtpEnabled(): boolean {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  return Boolean(host && user && pass)
}
