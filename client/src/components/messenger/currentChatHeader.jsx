import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import DeletePopup from "./deletePopup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from "../../context/AuthContext";
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const CurrentChatHeader = (props) => {
    const [user, setUser] = useState({})
    const [popupOpen, setPopupOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const isMenuOpen = Boolean(anchorEl);

    const { user: currentUser, dispatch } = useContext(AuthContext)

    console.log("@!:", props.currentChat)

    const handleDeleteAllMessages = () => {
        setPopupOpen(false)
        setAnchorEl(null)
        let convId;
        if (props.currentChat != null) convId = props.currentChat._id
        axios.delete(`${process.env.REACT_APP_API_SERVICE}/api/messages/all/${convId}`)
            .then((res) => {
                console.log("messages deleted")
                // const receiverId = currentChat.members.find((member) => member !== user._id)
                // socket.current?.emit("sendMessageDeleted", {
                //     senderId: user._id,
                //     receiverId: receiverId,
                //     messageId
                // })
                // getMessages()
                enqueueSnackbar("All Messages deleted", {
                    variant: "success",
                    anchorOrigin: {
                        horizontal: "left",
                        vertical: "bottom"
                    }
                })
                props.getConversation()
                props.setCurrentChat(null)

                props?.handleChat("recent")
            })
            .catch((error) => {
                console.log("error in message delete:", error)
            })
    }

    const fetchUser = (userId) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?userId=${userId}`)
            .then((res) => {
                // console.log("abba data:", res.data)
                setUser(res.data)
                props.setUser(res.data)
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    const handlePostMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handlePostMenuClose = () => {
        setAnchorEl(null);
    }

    const handleClickOpen = () => {
        setPopupOpen(true);
    };

    const handleMuteUnmuteNotifySound = (value) => {
        axios.put(`${process.env.REACT_APP_API_SERVICE}/api/users/${currentUser._id}`, { muteNotifySound: value, userId: currentUser._id })
            .then((res) => {
                console.log("mute success:", res.data)
                window.localStorage.setItem("user", JSON.stringify(res.data))
                dispatch({ type: "MUTE_UNMUTE_NOTIFY_SOUND", payload: value })
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    const renderPostMenu = (
        <Menu
            onClick={handlePostMenuClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            //   id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handlePostMenuClose}
        >
            {
                <>
                    {/* <MenuItem component={Link} to={`/post/${post._id}`}><VisibilityIcon sx={{ marginRight: "0.5rem" }} /> View post</MenuItem> */}
                    {/* <MenuItem component={Link} onClick={() => handleCopyPost(post._id)}><LinkIcon sx={{ marginRight: "0.5rem" }} /> Copy link to post</MenuItem> */}
                    {/* <MenuItem component={Link} onClick={() => handleUnfollow(post.userId)}><DoDisturbOnIcon sx={{ marginRight: "0.5rem" }} /> Unfollow {user.username}</MenuItem> */}
                    <MenuItem component={Link} to={`/profile/${user.username}`}><VisibilityIcon sx={{ marginRight: "0.5rem" }} /> View profile</MenuItem>

                    <MenuItem onClick={() => handleMuteUnmuteNotifySound(!currentUser?.muteNotifySound)}>
                        {currentUser?.muteNotifySound == true ? <VolumeMuteIcon sx={{ marginRight: "0.5rem" }} /> : <VolumeOffIcon sx={{ marginRight: "0.5rem" }} />}
                        {currentUser?.muteNotifySound == true ? "Unmute" : "Mute"} sound
                    </MenuItem>

                    <MenuItem component={Link} onClick={handleClickOpen}><DeleteIcon sx={{ marginRight: "0.5rem" }} /> Delete all Messages</MenuItem>
                </>
            }
        </Menu>
    );

    useEffect(() => {
        if (props.friendId != null) fetchUser(props.friendId)
    }, [props.friendId])

    return (
        <>
            <div className="current-chat-info-header">
                {/* {console.log("abba abda:", user)} */}
                <div className="left">
                    {
                        window.innerWidth < 800 && (
                            <IconButton onClick={() => props?.handleChat("recent")} sx={{marginRight: "0.5rem"}}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        )
                    }
                    <Link component={Link} to={`/profile/${user.username}`}>
                        <img
                            src={(user.profilePicture == '') ? dummyImage : PF + user.profilePicture} alt={user.username}
                        />
                    </Link>
                    <Link component={Link} to={`/profile/${user.username}`}><span>{user.username}</span></Link>
                    <p>{props.typing ? 'is typing...' : ''}</p>
                </div>
                <div className="right">
                    <IconButton onClick={handlePostMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
                {renderPostMenu}
            </div>
            <DeletePopup
                popupOpen={popupOpen}
                setPopupOpen={setPopupOpen}
                setAnchorEl={setAnchorEl}
                handleDeleteAllMessages={handleDeleteAllMessages}
            />
        </>

    )
}

export default CurrentChatHeader