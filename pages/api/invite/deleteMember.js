import connectDB from "../../../libs/utils/connectDB";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import Users from "../../../libs/models/Users";
import Rooms from "../../../libs/models/Room";

export default connectDB(async function deleteMember(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ message: 'Not signed in' })
    }

    const user = await Users.findOne({ email: session.user.email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    // Only the room owner can remove members (any signed-in user could before).
    const result = await Rooms.updateOne(
        { _id: req.query.roomId, createdBy: user._id },
        { $pull: { members: req.query.memberId } }
    ).catch(() => null)

    if (result && result.matchedCount > 0) {
        return res.status(200).json({ message: 'success', data: result })
    }
    return res.status(200).json({ message: 'Invalid Room Id' })
})
