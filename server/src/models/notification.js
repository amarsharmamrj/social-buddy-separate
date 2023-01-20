import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    },
    desc: {
        type: String
    }, 
    seen: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification;