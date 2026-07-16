import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "AI Platform <onboarding@resend.dev>";

export async function sendVerificationEmail(to: string, url: string) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Click the button below to verify your email address and activate your account.</p>
        <a href="${url}" style="display:inline-block; background:#16171B; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none; margin-top:12px;">
          Verify email
        </a>
        <p style="margin-top:16px; color:#666; font-size:13px;">
          Or copy this link: ${url}
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error (verification email):", error);
  }
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block; background:#16171B; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none; margin-top:12px;">
          Reset password
        </a>
        <p style="margin-top:16px; color:#666; font-size:13px;">
          Or copy this link: ${url}
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error (password reset email):", error);
  }
}