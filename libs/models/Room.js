import mongoose from "mongoose";
// import { randomName } from "random-name-generator";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { nanoid } from 'nanoid'


var Schema = mongoose.Schema;

var room = new Schema({
    name:{
        type: String,
        // A function, so every room gets its own name (a plain value was
        // generated once at startup and shared by every room).
        default: () => uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
    },
    members:[{

        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    shortId: {
        type: String,
        // Same fix: rooms are looked up by shortId, so a shared default
        // made every room after the first one unreachable.
        default: () => nanoid(6),
        unique: true
        },
    createdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},
    {
        timestamps: {
            createdAt: 'CreatedAt'
        }
    }

)

mongoose.models = {};

var Rooms = mongoose.model('Room', room);

export default Rooms;