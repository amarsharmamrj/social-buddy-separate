import { Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import moment from 'moment'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import { useState } from "react";
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';

const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Notification = ({ noti, setNoti }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl);

    const handlePostMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handlePostMenuClose = () => {
        setAnchorEl(null);
    }

    const markSeenNotification = (notiId) => {
        const model = {
            seen: true
        }
        axios.put(`${process.env.REACT_APP_API_SERVICE}/api/notifications/${notiId}`, model)
            .then((res) => {
                // console.log("notification res:", res.data)
            })
            .catch((error) => {
                console.log("notification error:", error)
            })
    }

    const handleDeleteNotification = (id) => {
        axios.delete(`${process.env.REACT_APP_API_SERVICE}/api/notifications//${id}`)
            .then((res) => {
                // console.log("notifications deleted:", res.data)
                setNoti((prev) => {
                    return prev.filter((item) => item._id != id)
                })
            })
            .catch((error) => {
                console.log("user notifications error:", error)
            })
    }


    const renderPostMenu = (
        <Menu
            //   onClick={handleMenuClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClick={handlePostMenuClose}
            onClose={handlePostMenuClose}
        >
            {
                <>
                    <MenuItem onClick={() => handleDeleteNotification(noti._id)}><DeleteIcon sx={{ marginRight: "0.5rem" }} /> Delete</MenuItem>
                    <MenuItem component={Link} to={`/profile/${noti.senderData.username}`}><VisibilityIcon sx={{ marginRight: "0.5rem" }} /> View Sender</MenuItem>
                </>
            }
        </Menu>
    );

    const notiTypeDesc = {
        message: "send you a message",
        follow: "has followed you",
        unfollow: "has unfollowed you"
    }

    const notiClickPath = {
        message: `/messenger`,
        follow: `/profile/${noti.senderData.username}`,
        unfollow: `/profile/${noti.senderData.username}`
    }

    return (
        <>
            <div key={`noti${noti._id}`} className={`noti ${noti.seen == false ? 'not-seen' : ''}`}>
                <div className="noti-sender-image">
                    <Link component={Link} to={`/profile/${noti.senderData.username}`}>
                        <img
                            src={(noti.senderData.profilePicture == '') ? dummyImage : PF + noti.senderData.profilePicture} alt={noti.senderData.username}
                        />
                    </Link>
                </div>
                <Link component={Link} to={notiClickPath[noti.type]} onClick={() => markSeenNotification(noti._id)}>
                    <div className="noti-other-info">
                        <p>{noti.senderData.username} <span>{notiTypeDesc[noti.type]}</span></p>
                        <h6>{moment(noti.createdAt).fromNow()}</h6>
                    </div>
                </Link>
                <div className="noti-menu">
                    <IconButton aria-label="menu" color="success" onClick={handlePostMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            {renderPostMenu}
            <Divider />
        </>
    )
}

export default Notification