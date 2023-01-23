import { Button, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material"
import { Box } from "@mui/system"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { useState } from "react";
import axios from 'axios'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

const Follow = (props) => {
    const { user: currentUser, dispatch } = useContext(AuthContext)
    const [followed, setFollowed] = useState(currentUser.followings.includes(props.user?._id))

    const saveNotification = (type, sender, receiver, desc) => {
        const model = {
            type: type,
            sender: sender,
            receiver: receiver,
            desc: desc,
        }
        console.log("notification model:", model)
        axios.post(`${process.env.REACT_APP_API_SERVICE}/api/notifications`, model)
            .then((res) => {
                console.log("save notification res:", res.data)
            })
            .catch((error) => {
                console.log("save notification error:", error)
            })
    }

    const handleFollowUnfollow = (e) => {
        e.preventDefault()
        const url = followed ?
            `${process.env.REACT_APP_API_SERVICE}/api/users/${props.user._id}/unfollow`
            : `${process.env.REACT_APP_API_SERVICE}/api/users/${props.user._id}/follow`

        if (followed) {
            dispatch({ type: "UNFOLLOW", payload: props.user._id })
            let newData = {
                ...currentUser,
                followings: currentUser.followings.filter(
                    following => following !== props.user._id
                )
            }
            window.localStorage.setItem("user", JSON.stringify(newData))
            saveNotification("unfollow", currentUser._id, props.user._id, "user has unfollowed you")
        } else {
            dispatch({ type: "FOLLOW", payload: props.user._id })
            let newData = {
                ...currentUser,
                followings: [...currentUser.followings, props.user._id]
            }
            window.localStorage.setItem("user", JSON.stringify(newData))
            saveNotification("follow", currentUser._id, props.user._id, "user has followed you")
        }

        const model = { userId: currentUser._id }

        axios.put(url, model)
            .then((res) => {
                console.log(`user ${followed ? "unfollowed" : "followed"}`)
            })
            .catch((error) => {
                console.log("errr", error)
            })
    }

    useEffect(() => {
        console.log("currentUser, props.user?._id:", currentUser, props.user?._id)
        setFollowed(currentUser.followings.includes(props.user?._id))
    }, [currentUser, props.user?._id])

    return (
        <Box>
            {
                !followed ? (
                    <Button variant="contained" color="primary" sx={{ margin: "0 0 0 1rem" }} onClick={handleFollowUnfollow}>
                        Follow <PersonAddIcon sx={{ marginLeft: "0.8rem" }} />
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" sx={{ margin: "0 0 0 1rem" }} onClick={handleFollowUnfollow}>
                        Un-Follow <PersonAddDisabledIcon sx={{ marginLeft: "0.8rem" }} />
                    </Button>
                )
            }
        </Box>
    )
}

export default Follow