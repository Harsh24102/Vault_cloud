import connectDB from "../../../libs/utils/connectDB";
import Users from "../../../libs/models/Users";
import bcrypt from 'bcrypt'

export default connectDB(async function reset(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { token, password } = req.body || {}
    // Without this check, a missing token became {token: undefined}, which
    // MongoDB ignores, so the query matched the first user in the database.
    if (typeof token !== 'string' || !token) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const user = await Users.findOne({ token })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.token = undefined // token is single-use
    await user.save()

    // Do not send the user document back: it contains the password hash.
    return res.status(200).json({ message: 'success' })
})
