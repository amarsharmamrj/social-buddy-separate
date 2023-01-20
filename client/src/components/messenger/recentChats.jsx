import { Badge, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material"
import { Box } from "@mui/system"
import { useState, useEffect } from "react"
import { useContext } from "react"
import { AuthContext } from '../../context/AuthContext'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from 'axios'

const RecentChats = (props) => {
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentLoginUser, noti } = useContext(AuthContext)
    const [user, setUser] = useState([])
    const [userOnline, setUserOnline] = useState(false)

    const getUser = (friendId) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?userId=${friendId}`)
            .then((res) => {
                console.log("friend res:", res.data)
                setUser(res.data)
                checkOnline(res.data._id)
            })
            .catch((err) => {
                console.log("conv err:", err)
            })
    }
    let friendId
    useEffect(() => {
        friendId = props.conversation.members.find((item) => item !== props.currentUser._id)
        // console.log("# friendId:", friendId)
        getUser(friendId)
    }, [props.conversation, props.currentUser])

    const checkOnline = (newUserId = user._id) => {
        if (props.onlineFriendIds != null && newUserId != null) {
            let online = props.onlineFriendIds.some((item) => item.userId == newUserId)
            setUserOnline(online)
        }
    }

    useEffect(() => {
        checkOnline()
    }, [props.onlineFriendIds])

    return (
        <>
        
                <ListItem className={`item ${props.activeConv == props.conversation._id ? "active-conv" : ''}`} >
                    <ListItemIcon>
                        <img
                            className={`image ${userOnline ? "user-online" : ""}`}
                            src={(user.profilePicture == '') ? dummyImage : PF + user.profilePicture} alt={user.username}
                        />
                    </ListItemIcon>
                    <ListItemText>{user.username}</ListItemText>
                    {(noti.length > 0 && noti.some((notiItem) => notiItem.sender == user._id)) && <NotificationsActiveIcon sx={{color: "#d32f2f"}} /> }
                </ListItem>
            
        </>
    )
}

export default RecentChats