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
    console.log("#### props.user", props.user)
    console.log("#### currentuser", currentUser)
    console.log("#### boolean:", currentUser.followings.includes(props.user?._id))

    const handleFollowUnfollow = (e) => {
        e.preventDefault()
        const url = followed ?
            `${process.env.REACT_APP_API_SERVICE}/api/users/${props.user._id}/unfollow`
            : `${process.env.REACT_APP_API_SERVICE}/api/users/${props.user._id}/follow`
        
            if(followed){
                dispatch({type: "UNFOLLOW", payload: props.user._id})
            } else {
                dispatch({type: "FOLLOW", payload: props.user._id})
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