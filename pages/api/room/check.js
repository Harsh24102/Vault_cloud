import { unstable_getServerSession } from "next-auth/next"
import connectDB from "../../../libs/utils/connectDB";
import Rooms from '../../../libs/models/Room';
import Users from "../../../libs/models/Users";
import { authOptions } from "../auth/[...nextauth]"

export default connectDB(async function check(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(200).json({ message: 'fail' })
    }

    const user = await Users.findOne({ email: session.user.email })
    const room = await Rooms.findOne({ shortId: req.query.roomFriendlyId })
    if (!user || !room) {
        return res.status(200).json({ message: 'fail' })
    }

    const userId = String(user._id)
    const isOwner = room.createdBy.some((id) => String(id) === userId)
    const isMember = room.members.some((id) => String(id) === userId)

    if (isOwner || isMember) {
        return res.status(200).json({
            message: 'success',
            roomName: room.name,
            roomId: room._id,
            userName: user.name,
            userId: user._id,
            userEmail: user.email,
        })
    }
    return res.status(200).json({ message: 'fail' })
})
