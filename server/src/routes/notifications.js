import express from 'express'
import Message from '../models/message.js'
import Conversation from '../models/conversation.js'
import Notification from '../models/notification.js'
const router = express.Router()

// create notification
router.post("/", async (req, res) => {
    const newNotification = new Notification(req.body)
    try {
        const notification = await newNotification.save();
        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json(error)
    }
})


// get notifications for a receiver
router.get("/:receiverId", async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.params.receiverId,
            seen: false
        })

        // const notifications = await Notification.find({
        //     receiver: req.params.receiverId,
        //     seen: false
        // }).populate({path: "sender", select: ["username", "profilePicture"]})

        // const notifications = await Notification.aggregate([
        //     {$lookup: {
        //         from: "users",
        //         localField: "sender",
        //         foreignField: "_id",
        //         as: "profile"
        //     }}
        // ])

        res.status(200).json(notifications)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// get all message notifications for a receiver and sender
router.get("/:receiverId/:senderId/:type", async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.params.receiverId,
            sender: req.params.senderId,
            type: req.params.type
        })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json(error)
    }
})

// update user
router.put("/:id", async (req, res) => {
    try {
        const user = await Notification.findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        res.status(200).send("notficaion updated")
    } catch (error) {
        console.log("error occured", error)
        return res.status(500).send(error)
    }
})

// delete message
// router.delete("/:id", async (req, res) => {
//     try {
//         let message = await Message.findByIdAndUpdate(req.params.id, {
//             deleted: true
//         })
//         res.status(200).send(message)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

// delete all message
// router.delete("/all/:convId", async (req, res) => {
//     try {
//         let message = await Message.deleteMany({conversationId: req.params.convId}) 
//         let conv = await Conversation.findOneAndDelete({_id: req.params.convId})
//         res.status(200).send("All messages deleted successfully")
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

export default router