import connectDB from "../../../libs/utils/connectDB";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import Requests from "../../../libs/models/Requests";
import Users from "../../../libs/models/Users";
import Rooms from "../../../libs/models/Room";
import { sendMail, appUrl, escapeHtml } from "../../../libs/utils/mailer";

export default connectDB(async function create(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ message: 'Not signed in' })
    }

    const user = await Users.findOne({ email: session.user.email })
    if (!user) {
        return res.status(403).json({ success: false, message: 'Invalid User' })
    }

    // Only the room's owner may invite people into it.
    const room = await Rooms.findOne({ _id: req.query.Id, createdBy: user._id }).catch(() => null)
    if (!room) {
        return res.status(403).json({ success: false, message: 'You can only invite people to your own rooms' })
    }

    const recepientUser = await Users.findOne({ email: req.query.email })
    if (!recepientUser) {
        return res.status(400).json({ success: false, message: 'Invalid Email' })
    }

    const inviteRequest = new Requests({
        recepientEmail: recepientUser.email,
        roomName: room.name,
        createdBy: user._id,
        recepientID: recepientUser._id,
        roomId: room._id,
    })
    await inviteRequest.save()

    try {
        await sendMail({
            to: recepientUser.email,
            subject: `${user.name} invited you!`,
            html: `<p>Hi,</p><p>${escapeHtml(user.name)} invited you to join the room <b>${escapeHtml(room.name)}</b>.</p>` +
                  `<p>Open ${appUrl()} to accept the invite.</p>`,
        })
        return res.status(200).json({ message: 'success', data: inviteRequest })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Invite saved, but the email could not be sent' })
    }
})
