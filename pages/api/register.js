import bcrypt from 'bcrypt'
import connectDB from "../../libs/utils/connectDB";
import Users from '../../libs/models/Users'

export default connectDB(async function register(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { name, email, password } = req.body || {}
    if (!name || !email || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Name, email and a password of at least 6 characters are required' })
    }

    const user = await Users.findOne({ email })
    if (user) {
        return res.status(200).json({ message: 'already registered' })
    }

    const hashPass = await bcrypt.hash(password, 10)
    const newUser = new Users({ email, password: hashPass, name })
    await newUser.save()
    return res.status(200).json({ message: 'success' })
})
