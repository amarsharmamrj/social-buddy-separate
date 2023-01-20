import { Button, Grid, List, TextField } from "@mui/material"
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

import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useSnackbar } from "notistack";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const MessengerOtherScreen = () => {
    const { user, dispatch, noti: notifications } = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar()
    const emojiRef = useRef();
    const emojiButtonRef = useRef();
    const gifRef = useRef();
    const gifButtonRef = useRef();
    const messageRef = useRef();
    const theme = useTheme();
    const [conversation, setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineFriendIds, setOnlineFriendIds] = useState(null)

    const [isImageSelected, setIsImageSelected] = useState(false)
    const [imageSelected, setImageSelected] = useState("")

    const [freindIsTyping, setFreindIsTyping] = useState(false)
    const [freindIsTypingConvId, setFreindIsTypingConvId] = useState(false)
    const [activeConv, setActiveConv] = useState("")

    const [messageFromUsers, setMessageFromUsers] = useState([])


    const [value, setValue] = useState(0);

    const socket = useRef(io("ws://localhost:7000"))
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
        // clear notification for selected chat
        let freindId = item.members.find((id) => id != user._id)
        let items = notifications.filter((notiItem) => notiItem.sender != freindId)
        // window.localStorage.setItem("notifications", JSON.stringify(items))
        // dispatch({ type: "REMOVE_NOTI", payload: freindId })

        let notiOfFriend = notifications.find((notiItem) => notiItem.sender == freindId)
        if (notiOfFriend != null) updateNotification(notiOfFriend._id)
        // clear notification for selected chat

        handleChat("current")

        console.log("az:", item)

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
        document.getElementById("audio").play()
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
                    setMessages([...messages, res.data])
                    setNewMessage('')
                    setIsImageSelected(false)
                    setImageSelected('')
                })
                .catch((err) => {
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
            console.log("audio")
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
    }, [arrivalMessage, currentChat])

    const getConversation = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/conversations/${user._id}`)
            .then((res) => {
                // console.log("conv res:", res.data)
                setConversation(res.data)
            })
            .catch((err) => {
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

    const handleChat = (value) => {

        var elems = document.querySelectorAll(".active-chat-tab");
        elems.forEach((item) => {
            item.classList.remove("active-chat-tab");
        });

        let recent = document.getElementById("recent")
        let recentButton = document.getElementById("recent-button")

        let current = document.getElementById("current")
        let currentButton = document.getElementById("current-button")

        let friends = document.getElementById("friends")
        let friendsButton = document.getElementById("friends-button")

        if (value === "recent") {
            recentButton.classList.add("active-chat-tab")
            recent.style.display = "block"
            current.style.display = "none"
            friends.style.display = "none"

        } else if (value === "current") {
            currentButton.classList.add("active-chat-tab")
            recent.style.display = "none"
            current.style.display = "block"
            friends.style.display = "none"
        } else {
            friendsButton.classList.add("active-chat-tab")
            recent.style.display = "none"
            current.style.display = "none"
            friends.style.display = "block"
        }
    }


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
        if(previousNotifications != null) duplicateFoud = previousNotifications.find((notiItem) => notiItem?.sender == sender && notiItem?.receiver == receiver && notiItem?.type == "message" && notiItem?.seen == false)
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
            document.getElementById("audioNotify").play()
        }
    }, [arrivalMessage])

    return (
        <Box className="messenger-container">
            <audio id="audio" src="/sent.mp3"></audio>
            <audio id="audioNotify" src="/notify.mp3"></audio>
            <Box sx={{ width: '100%' }}>
                <div className="chat-tabs">
                    <Button id="recent-button" variant="outlined" className="chat-tab-buttons active-chat-tab" onClick={(e) => handleChat("recent")}>Recent</Button>
                    <Button id="current-button" variant="outlined" className="current chat-tab-buttons" onClick={(e) => handleChat("current")}>Chat</Button>
                    <Button id="friends-button" variant="outlined" className="chat-tab-buttons" onClick={(e) => handleChat("friends")}>Friends</Button>
                </div>
                {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                            <Tab label="All Chats" {...a11yProps(0)} />
                            <Tab label="Current Chat" {...a11yProps(1)} />
                            <Tab label="All Friends" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    > */}
                {/* <TabPanel value={value} index={0} sx={{ padding: "0" }}> */}
                <Box id="recent" className="recent-chats-list-box">
                    {/* <TextField
                                id="outlined-basic"
                                className="search"
                                name="username"
                                placeholder="Search for friends.."
                                variant="outlined"
                                fullWidth={true}
                            /> */}
                    <List>
                        {
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
                                                noti={notifications}
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
                        }
                    </List>
                </Box>
                {/* </TabPanel>
                        <TabPanel value={value} index={1}> */}
                <Box id="current" sx={{ display: "none" }}>
                    {
                        currentChat ? (
                            <Conversation
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
                                handleChat={handleChat}
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
                </Box>
                {/* </TabPanel>
                        <TabPanel value={value} index={2}> */}
                <Box id="friends" sx={{ display: "none" }}>
                    <OnlineFreindsMessenger
                        currentUser={user}
                        conversation={conversation}
                        getConversation={getConversation}
                        handelSelectConversation={handelSelectConversation}
                        arrivalMessage={arrivalMessage}
                        handleChat={handleChat}
                        messageFromUsers={messageFromUsers}
                    />
                </Box>
                {/* </TabPanel>
                    // </SwipeableViews> */}
            </Box>

        </Box >
    )
}

export default MessengerOtherScreen