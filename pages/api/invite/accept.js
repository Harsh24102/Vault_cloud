import connectDB from "../../../libs/utils/connectDB";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import Requests from "../../../libs/models/Requests";
import Users from "../../../libs/models/Users";
import Rooms from "../../../libs/models/Room";

export default connectDB(async function accept(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ message: 'Not signed in' })
    }

    const user = await Users.findOne({ email: session.user.email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    const request = await Requests.findOne({ _id: req.query.Id, recepientEmail: user.email })
        .populate("roomId")
        .catch(() => null)
    // Previously crashed with a 500 when the invite id was wrong or not addressed to this user.
    if (!request || !request.roomId || String(request.roomId._id) !== String(req.query.roomId)) {
        return res.status(200).json({ message: 'Invalid Room Id' })
    }

    // $addToSet adds the user once; the old $push of an array nested an array inside members.
    const room = await Rooms.findOneAndUpdate(
        { _id: request.roomId._id },
        { $addToSet: { members: user._id } },
        { new: true }
    )
    request.accepted = true
    await request.save()
    return res.status(200).json({ message: 'success', data: room })
})
