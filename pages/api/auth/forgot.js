import crypto from 'crypto'
import connectDB from "../../../libs/utils/connectDB";
import Users from "../../../libs/models/Users";
import { sendMail, appUrl } from "../../../libs/utils/mailer";

export default connectDB(async function Forgot(req, res) {
    const email = String(req.query.email || '').trim()
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await Users.findOne({ email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    // Long random token that cannot be guessed (was a 5-character Math.random value).
    user.token = crypto.randomBytes(32).toString('hex')
    await user.save()

    try {
        await sendMail({
            to: user.email,
            subject: 'Password reset',
            html: `<p>Hi,</p><p>We received a password reset request.</p>` +
                  `<p>Click the link to reset your password: ${appUrl()}/fpass/${user.token}</p>`,
        })
        return res.status(200).json({ message: 'success', data: [] })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Could not send email' })
    }
})
