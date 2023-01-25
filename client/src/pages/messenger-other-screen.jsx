import { Grid, List, Skeleton, TextField } from "@mui/material"
import { Box } from "@mui/system"
import Conversation from "../components/messenger/conversation"
import OnlineFreindsMessenger from "../components/messenger/allFreindsMessenger"
import RecentChats from "../components/messenger/recentChats"
import { useContext, useRef } from "react"
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { useTheme } from '@mui/material/styles';

import { useState, useEffect } from "react"
import { io } from 'socket.io-client'
import { useMemo } from "react"

// import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const image = "../assets/chat.webp"

const MessengerOtherScreen = () => {
    const { user, dispatch, noti: notifications, socket: currentSocket } = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar()
    const emojiRef = useRef();
    const emojiButtonRef = useRef();
    const gifRef = useRef();
    const gifButtonRef = useRef();
    const messageRef = useRef();
    const theme = useTheme();
    const [conversation, setConversation] = useState([])
    const [conversationLoading, setConversationLoading] = useState(true)
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [messagesLoading, setMessagesLoading] = useState(true)
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineFriendIds, setOnlineFriendIds] = useState(null)

    const [isImageSelected, setIsImageSelected] = useState(false)
    const [imageSelected, setImageSelected] = useState("")

    const [freindIsTyping, setFreindIsTyping] = useState(false)
    const [freindIsTypingConvId, setFreindIsTypingConvId] = useState(false)
    const [activeConv, setActiveConv] = useState("")

    const [muteNotiAudio, setMuteNotiAudio] = useState(false)

    const [value, setValue] = useState(0);

    const cloudinaryRef = useRef()
    const widgetRef = useRef()

    // const socket = useRef(io("ws://localhost:7000"))
    const socket = { current: currentSocket }
    // const socket = useRef(io("ws://localhost:7000"))
    // let count = 0
    // let socket = {current: null}

    // socket.current = useMemo(() => {
    //     socket = io("ws://localhost:7000")
    // }, [count])

    document.getElementById("chats-box")?.addEventListener("click", () => {
        handleCloseModel()
    })

    const handleMessageDelete = (e, messageId, deleted) => {
        e.preventDefault()
        e.stopPropagation()

        axios.delete(`${process.env.REACT_APP_API_SERVICE}/api/messages/${messageId}`)
            .then((res) => {
                console.log("message deleted")
                const receiverId = currentChat.members.find((member) => member !== user._id)
                socket.current?.emit("sendMessageDeleted", {
                    senderId: user._id,
                    receiverId: receiverId,
                    messageId
                })
                getMessages()
                enqueueSnackbar("Message deleted", {
                    variant: "success",
                    anchorOrigin: {
                        horizontal: "left",
                        vertical: "bottom"
                    }
                })
            })
            .catch((error) => {
                console.log("error in message delete:", error)
            })
    }


    const handleCloseModel = () => {
        emojiRef.current?.classList?.add("hidden")
        emojiRef.current?.classList?.remove("block")
        emojiButtonRef.current?.classList?.remove("active")

        gifRef.current?.classList?.add("hidden")
        gifRef.current?.classList?.remove("block")
        gifButtonRef.current?.classList?.remove("active")
    }

    const handelSelectConversation = (item) => {
        setMessagesLoading(true)
        // clear notification for selected chat
        let freindId = item.members.find((id) => id != user._id)
        let items = notifications.filter((notiItem) => notiItem.sender != freindId)
        // window.localStorage.setItem("notifications", JSON.stringify(items))
        // dispatch({ type: "REMOVE_NOTI", payload: freindId })

        let notiOfFriend = notifications.find((notiItem) => notiItem.sender == freindId)
        if (notiOfFriend != null) updateNotification(notiOfFriend._id)
        // clear notification for selected chat

        setCurrentChat(item)
        setIsImageSelected(false)

        setActiveConv(item._id)

        emojiRef.current?.classList?.add("hidden")
        emojiRef.current?.classList?.remove("block")
        emojiButtonRef.current?.classList?.remove("active")

        gifRef.current?.classList?.add("hidden")
        gifRef.current?.classList?.remove("block")
        gifButtonRef.current?.classList?.remove("active")
    }

    const handleCloseImagePreview = () => {
        setImageSelected("")
        setIsImageSelected(false)
    }

    var timeout;
    const handleCheckEnterButton = (e) => {
        const receiverId = currentChat.members.find((member) => member !== user._id)
        function typingEnd() {
            socket.current?.emit("typing", {
                receiverId: receiverId,
                typing: false,
                conversationId: activeConv
            })
        }
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage()
            clearTimeout(timeout)
            typingEnd()
        } else {
            socket.current?.emit("typing", {
                receiverId: receiverId,
                typing: true,
                conversationId: activeConv
            })
            clearTimeout(timeout)
            timeout = setTimeout(typingEnd, 4000)
        }
    }

    const handleSendMessage = () => {
        document.getElementById("audio")?.play()
        handleCloseModel()
        if (messageRef.current.value != "" || imageSelected != "") {
            const model = {
                conversationId: currentChat?._id,
                sender: user?._id,
                text: messageRef.current.value,
                image: isImageSelected ? imageSelected : ""
            }
            // console.log("@#@# model:", model)
            const receiverId = currentChat.members.find((member) => member !== user._id)
            socket.current?.emit("sendMessage", {
                senderId: user._id,
                receiverId: receiverId,
                text: messageRef.current.value,
                image: isImageSelected ? imageSelected : ""
            })

            getMessangeNotificationsForSenderAndReceiver("message", user._id, receiverId, messageRef.current.value)

            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/messages/`, model)
                .then((res) => {
                    setMessagesLoading(false)
                    setMessages([...messages, res.data])
                    setNewMessage('')
                    setIsImageSelected(false)
                    setImageSelected('')
                })
                .catch((err) => {
                    setMessagesLoading(false)
                    console.log(err)
                })
            messageRef.current.value = ""
        }
    }

    const handleEmojiButton = () => {
        if (emojiRef.current?.classList?.contains("block")) {
            emojiRef.current?.classList?.add("hidden")
            emojiRef.current?.classList?.remove("block")
        } else {
            emojiRef.current?.classList?.add("block")
            emojiRef.current?.classList?.remove("hidden")
        }

        if (emojiButtonRef.current?.classList?.contains("active")) {
            emojiButtonRef.current?.classList?.remove("active")
        } else {
            emojiButtonRef.current?.classList?.add("active")
        }
    }

    const handleGifButton = () => {
        if (gifRef.current?.classList?.contains("block")) {
            gifRef.current?.classList?.add("hidden")
            gifRef.current?.classList?.remove("block")
        } else {
            gifRef.current?.classList?.add("block")
            gifRef.current?.classList?.remove("hidden")
        }

        if (gifButtonRef.current?.classList?.contains("active")) {
            gifButtonRef.current?.classList?.remove("active")
        } else {
            gifButtonRef.current?.classList?.add("active")
        }
    }


    useEffect(() => {
        socket.current?.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                image: data.image,
                createdAt: Date.now()
            })
        })
        socket.current?.on("typing", (data) => {
            setFreindIsTyping(data.typing)
            setFreindIsTypingConvId(data.conversationId)
        })
    }, [])

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
            setMessagesLoading(false)
    }, [arrivalMessage, currentChat])

    const getConversation = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/conversations/${user._id}`)
            .then((res) => {
                console.log("conv res:", res.data)
                setConversationLoading(false)
                setConversation(
                    res.data.sort((p1, p2) => {
                        return new Date(p2.updatedAt) - new Date(p1.updatedAt)
                    })
                )
            })
            .catch((err) => {
                setConversationLoading(false)
                console.log("conv err:", err)
            })
    }
    useEffect(() => {
        getConversation()
    }, [user._id])

    const getMessages = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/messages/${currentChat?._id}`)
            .then((res) => {
                // console.log("#messages:", res.data)
                setMessages(res.data)
                setMessagesLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }


    // TABS
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleChangeIndex = (index) => {
        setValue(index);
    };

    // TABS


    useEffect(() => {
        if (currentChat) getMessages()
    }, [currentChat])

    useEffect(() => {
        socket.current?.emit("addUser", user._id)
        socket.current?.on("getUsers", (users) => {
            setOnlineFriendIds(users)
        })
    }, [user])

    const saveNotification = (type, sender, receiver, desc, previousNotifications) => {
        let duplicateFoud;
        if (previousNotifications != null) duplicateFoud = previousNotifications.find((notiItem) => notiItem?.sender == sender && notiItem?.receiver == receiver && notiItem?.type == "message" && notiItem?.seen == false)
        console.log("duplicateFoud:", duplicateFoud)

        if (duplicateFoud == null) {
            const model = {
                type: type,
                sender: sender,
                receiver: receiver,
                desc: desc,
            }
            console.log("notification model:", model)
            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/notifications`, model)
                .then((res) => {
                    console.log("notification res:", res.data)
                })
                .catch((error) => {
                    console.log("notification error:", error)
                })
        }
    }
    const updateNotification = (notiId) => {
        const model = {
            seen: true
        }
        console.log("notification model:", model)
        axios.put(`${process.env.REACT_APP_API_SERVICE}/api/notifications/${notiId}`, model)
            .then((res) => {
                console.log("notification res:", res.data)
                getNotifications(user._id)
            })
            .catch((error) => {
                console.log("notification error:", error)
            })
    }

    const getNotifications = (receiver) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/notifications/${receiver}`)
            .then((res) => {
                console.log("user notifications res:", res.data)
                dispatch({ type: "ALL_NOTI", payload: res.data })
            })
            .catch((error) => {
                console.log("user notifications error:", error)
            })
    }

    const getMessangeNotificationsForSenderAndReceiver = (type, sender, receiver, desc) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/notifications/${receiver}/${sender}/${type}`)
            .then((res) => {
                console.log("getMessangeNotificationsForSenderAndReceiver notifications res:", res.data)
                saveNotification("message", sender, receiver, desc, res?.data)
                // dispatch({ type: "ALL_NOTI", payload: res.data })
            })
            .catch((error) => {
                console.log("getMessangeNotificationsForSenderAndReceiver notifications error:", error)
            })
    }

    useEffect(() => {
        if (arrivalMessage != null) {
            let item = arrivalMessage
            getNotifications(user._id)
            console.log("abcd")
            document.getElementById("audioNotify")?.play()
        }
    }, [arrivalMessage])

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary
        console.log("upload cloudinaryRef.current:", cloudinaryRef.current)
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dvhb339oe",
            uploadPreset: "chtt7osr",
            sources: ["local", "camera"]
        }, (error, result) => {
            console.log("cloudinary result:", result)
            if (result.event === 'upload-added') {
                widgetRef.current.minimize()
            } else if (result.event === 'success') {
                if (result.info.audio == null) {
                    setIsImageSelected(true)
                    setImageSelected(result.info.secure_url)
                }
                widgetRef.current.close()
                console.log("upload success:", result)
            } else if (result.event === 'close') {
                console.log("upload closed:")
            }
        })
        console.log("upload widgetRef:", widgetRef)
        console.log("cloudinary:", cloudinaryRef)
    }, [])

    return (
        <Box className="messenger-container">
            {user.muteNotifySound == false ? (
                <>
                    <audio id="audio" src="/sent.mp3"></audio>
                    <audio id="audioNotify" src="/notify.mp3"></audio>
                </>
            ) : ""}
            <Grid container>
                <Grid item xs={12} sm={3} md={3}>
                    <Box className="recent-chats-list-box">
                        <TextField
                            id="outlined-basic"
                            className="search"
                            name="username"
                            placeholder="Search for friends.."
                            variant="outlined"
                            fullWidth={true}
                        />
                        <List>
                            {
                                !conversationLoading ? (
                                    conversation.length > 0 ? (
                                        conversation.map((item, i) => {
                                            return (
                                                <div key={`conv${i}`} onClick={() => handelSelectConversation(item)}>
                                                    <RecentChats
                                                        key={`recentchat${i}`}
                                                        conversation={item}
                                                        currentUser={user}
                                                        onlineFriendIds={onlineFriendIds}
                                                        activeConv={activeConv}
                                                    />
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="no-messages">
                                            <p style={{ color: "grey", fontSize: "1.5rem", textAlign: "center", fontWeight: "500" }}>No comnversation, Choose a freind to start.</p>
                                            <img src="https://media.tenor.com/8GjbkVyjbakAAAAC/minions-heart.gif" alt="gif" />
                                        </div>
                                    )
                                ) : (
                                    [1, 2, 3, 4, 5].map((i) => {
                                        return (
                                            <div style={{ display: "flex", alignItems: "center", padding: "0.5rem 0" }}>
                                                <Skeleton variant="circular" sx={{ height: "40px", width: "40px", padding: "0.5rem" }} />
                                                <Skeleton variant="rectangular" sx={{ height: "20px", width: "70%", margin: "0 0.5rem" }} />
                                            </div>
                                        )
                                    })
                                )
                            }
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={7} md={7}>
                    {
                        currentChat ? (
                            <Conversation
                                messagesLoading={messagesLoading}
                                messages={messages}
                                currentChat={currentChat}
                                setCurrentChat={setCurrentChat}
                                currentUser={user}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                handleSendMessage={handleSendMessage}
                                emojiRef={emojiRef}
                                emojiButtonRef={emojiButtonRef}
                                handleEmojiButton={handleEmojiButton}
                                gifRef={gifRef}
                                gifButtonRef={gifButtonRef}
                                handleGifButton={handleGifButton}
                                isImageSelected={isImageSelected}
                                setIsImageSelected={setIsImageSelected}
                                imageSelected={imageSelected}
                                setImageSelected={setImageSelected}
                                handleCloseImagePreview={handleCloseImagePreview}
                                handleCloseMode={handleCloseModel}
                                messageRef={messageRef}
                                onlineFriendIds={onlineFriendIds}
                                handleCheckEnterButton={handleCheckEnterButton}
                                freindIsTyping={freindIsTyping}
                                activeConv={activeConv}
                                freindIsTypingConvId={freindIsTypingConvId}
                                handleMessageDelete={handleMessageDelete}
                                getConversation={getConversation}
                                widgetRef={widgetRef}
                            />
                        ) : (
                            <div className="no-conversation-selected-box" style={{ backgroundImage: `url(${PF}chat-bg-1.webp)`, backgroundColor: "rgb(234 250 255)", backgroundBlendMode: "exclusion" }}>
                                <div className="no-messages">
                                    <p>Choose a chat to start conversation!</p>
                                    <img src="https://media.tenor.com/4hu2e18-aCwAAAAC/hello-die.gif" alt="gif" />
                                </div>
                            </div>
                        )
                    }
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                    <OnlineFreindsMessenger
                        currentUser={user}
                        conversation={conversation}
                        getConversation={getConversation}
                        handelSelectConversation={handelSelectConversation}
                        arrivalMessage={arrivalMessage}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default MessengerOtherScreen