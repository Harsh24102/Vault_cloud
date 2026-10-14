import connectDB from "../../../libs/utils/connectDB";
import Rooms from '../../../libs/models/Room';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import Users from "../../../libs/models/Users";

export default connectDB(async function del(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(200).json({ message: 'failure' })
    }

    const user = await Users.findOne({ email: session.user.email })
    // Only delete the room if it belongs to the signed-in user
    // (before, any signed-in user could delete any room by id).
    const deleted = user
        ? await Rooms.findOneAndDelete({ _id: req.query.id, createdBy: user._id }).catch(() => null)
        : null

    return res.status(200).json({ message: deleted ? 'success' : 'failure' })
})
