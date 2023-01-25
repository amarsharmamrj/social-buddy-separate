import { IconButton, Skeleton, TextField, ThemeProvider, Tooltip } from "@mui/material"
import { Box, Stack } from "@mui/system"
import Message from "./message"
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import GifIcon from '@mui/icons-material/Gif';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ImageIcon from '@mui/icons-material/Image';
import SelectedImage from "./selectedImage";
import { useContext, useEffect, useRef } from "react";
import CurrentChatHeader from "./currentChatHeader";
import { useState } from "react";
import CameraDialog from "./cameraDialog";
import { useSnackbar } from "notistack";


import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const actions = [
    { icon: <ImageIcon />, name: 'Upload Photo' },
    { icon: <AddLocationAltIcon />, name: 'Share Location' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
];

const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
const PF = process.env.REACT_APP_PUBLIC_FOLDER;


const Conversation = (props) => {
    const scrollTypingRef = useRef()
    const { enqueueSnackbar } = useSnackbar()
    const { dispatch, noti: notifications } = useContext(AuthContext)
    const [cameraDialogOpen, setCameraDialogOpen] = useState(false)
    const [user, setUser] = useState(false)
    const [actionOpen, setActionOpen] = useState(false)

    const handleCameraDiloag = () => {
        console.log("handleCameraDiloag")
        setCameraDialogOpen(!cameraDialogOpen)
    }

    const handleAttachMenu = () => {
        console.log("handleAttachMenu clicked")
        setActionOpen(!actionOpen)
    }

    const emojiSelected = (data) => {
        console.log("data:", data.emoji)
        props.messageRef.current.value = props.messageRef.current.value + data.emoji
    }

    const handleSelectGif = (data) => {
        props.setIsImageSelected(true)
        props.setImageSelected(data.url)
    }

    useEffect(() => {
        scrollTypingRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [props.freindIsTyping])

    return (
        <Box className="coversation-box">
            {
                !props.messagesLoading ? (
                    <CurrentChatHeader
                        friendId={props.messages.length > 0 ? props.currentChat.members.find((item) => item != props.currentUser._id) : null}
                        typing={props.freindIsTyping == true && props.freindIsTypingConvId == props.activeConv}
                        currentChat={props.currentChat}
                        getConversation={props.getConversation}
                        setCurrentChat={props.setCurrentChat}
                        handleChat={props.handleChat}
                        setUser={setUser}
                    />
                ) : (
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: "0.27rem" }}>
                        {
                            window.innerWidth < 800 && (
                                <IconButton onClick={() => props?.handleChat("recent")} sx={{ marginRight: "0.5rem" }}>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                            )
                        }
                        <Skeleton variant="circular" height={25} width={25} />
                        <Skeleton variant="rectangular" sx={{ height: "20px", width: "40%", margin: "0 0.5rem" }} />
                    </div>
                )
            }
            <div ref={props.emojiRef} className="emoji-container">
                <EmojiPicker
                    onEmojiClick={emojiSelected}
                />
            </div>
            <div ref={props.gifRef} className="gif-container">
                <GifPicker tenorApiKey={"AIzaSyBtXA3Ruk5V5SYBTXeGbF0b_GKe_PAQkb8"} onGifClick={handleSelectGif} />
            </div>
            {
                console.log("11 props.messages:", props.messages)
            }
            <Box id="chats-box" className="chats-box" style={{ backgroundImage: `url(${PF}chat-bg-1.webp)` }}>
                {
                    !props.messagesLoading ? (
                        props.messages.length > 0 ? (
                            props.messages.map((message, i) => {
                                return <>
                                    <Message
                                        key={message._id}
                                        message={message}
                                        own={props.currentUser._id === message.sender ? true : false}
                                        messages={props.messages}
                                        currentUser={props.currentUser}
                                        user={user}
                                        handleMessageDelete={props.handleMessageDelete}
                                    />
                                </>
                            })
                        ) : (
                            <div className="no-messages">
                                <p>Waiting for your message!</p>
                                <img src="https://media.tenor.com/-9RZRzkWhx4AAAAC/sigh-message.gif" alt="gif" />
                            </div>
                        )
                    ) : (
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                            return (
                                <div className={item == 2 || item == 4 || item == 7 || item == 10 ? "message-box own" : "message-box"}>
                                    <Skeleton variant="circular" height={28} width={28} sx={{ backgroundColor: "#4d4d50", margin: "0 0.4rem" }} />
                                    <Skeleton variant="rectangular" sx={{ height: "40px", width: "70%", backgroundColor: "#4d4d50", margin: "0 0.5rem" }} />
                                </div>
                            )
                        })
                    )
                }
                {
                    props.isImageSelected == true ? (<SelectedImage
                        imageSelected={props.imageSelected}
                        isImageSelected={props.isImageSelected}
                        setImageSelected={props.setImageSelected}
                        setIsImageSelected={props.setImageSelected}
                        handleCloseImagePreview={props.handleCloseImagePreview}
                    />
                    ) : ("")
                }
            </Box>
            <Box className="chat-tools-box">
                <div>
                    {/* <Tooltip title="add files">
                        <IconButton className="messenger-icon-buttons" onClick={handleCameraDiloag}>
                            <PhotoCameraIcon />
                        </IconButton>
                    </Tooltip> */}
                    {/* <Box sx={{ height: "2.5rem", width: "2.5rem !important", transform: 'translateZ(0px)', flexGrow: 1 }}>
                        <SpeedDial
                            sx={{width: "2.5rem"}}
                            className="speed-dial"
                            ariaLabel="SpeedDial openIcon example"
                            // onClick={handleAttachMenu}
                            icon={<AttachFileIcon />}
                            // open={false}
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    // open={actionOpen}
                                    sx={{width: "2.5rem"}}
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    tooltipPlacement="right"
                                />
                            ))}
                        </SpeedDial>
                    </Box> */}
                    <Tooltip title="add file">
                        {/* <IconButton ref={props.gifButtonRef} className="messenger-icon-buttons" onClick={props.handleGifButton}> */}
                        <IconButton ref={props.gifButtonRef} className="messenger-icon-buttons" onClick={() => props.widgetRef.current.open()}>
                            <AttachFileIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="add gif">
                        <IconButton ref={props.gifButtonRef} className="messenger-icon-buttons" onClick={props.handleGifButton}>
                            <GifIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="add emoji">
                        <IconButton ref={props.emojiButtonRef} className="messenger-icon-buttons" onClick={props.handleEmojiButton}>
                            <SentimentSatisfiedAltIcon />
                        </IconButton>
                    </Tooltip>
                    <input
                        type="text"
                        className="message-field"
                        style={{ width: "100%" }}
                        name="username"
                        autocomplete="off"
                        placeholder="type something.."
                        ref={props.messageRef}
                        onKeyUp={props.handleCheckEnterButton}
                        autoFocus
                    />
                    <Tooltip title="send message">
                        <IconButton className="messenger-icon-buttons" onClick={props.handleSendMessage} >
                            <SendIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>

            <CameraDialog
                cameraDialogOpen={cameraDialogOpen}
                setCameraDialogOpen={setCameraDialogOpen}
                handleCameraDiloag={handleCameraDiloag}
                setIsImageSelected={props.setIsImageSelected}
                setImageSelected={props.setImageSelected}
            />

        </Box>
    )
}

export default Conversation