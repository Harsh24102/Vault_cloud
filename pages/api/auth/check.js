import connectDB from "../../../libs/utils/connectDB";
import Users from "../../../libs/models/Users";

export default connectDB(async function Check(req, res) {
    const token = typeof req.query.token === 'string' ? req.query.token : ''
    // An empty token would match users whose token was cleared, so reject it.
    if (!token) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    const user = await Users.findOne({ token }, { password: 0, token: 0 })
    if (user) {
        return res.status(200).json({ message: 'success', data: user })
    }
    return res.status(403).json({ success: false, message: 'Invalid User' })
})
