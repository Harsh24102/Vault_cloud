import nodemailer from 'nodemailer'

// Mail settings come from environment variables (see .env.example).
// Never put a real email password in the source code.
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export const appUrl = () => (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')

// Escape user-supplied text before putting it into an HTML email.
export const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export const sendMail = ({ to, subject, html }) =>
    transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html })
