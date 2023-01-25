import { Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect } from "react"
import axios from 'axios'
import { useState } from "react"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import OnlineListSkeleton from "./onlineListSkeleton"

const OnlineList = (props) => {
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([])
    const { user, socket, onlineUsers } = useContext(AuthContext)

    const profileStyle = {
        height: "32px",
        width: "32px",
        borderRadius: "100%"
    }

    const onlineDotStyle = {
        position: "absolute",
        top: "-2px",
        right: "20px",
        height: "8px",
        width: "8px",
        borderRadius: "100%",
        backgroundColor: "green",
        border: "2px solid white",
    }

    const getAllUsers = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users/all`)
            .then((res) => {
                console.log("aabb:", res.data)
                const freinds = res.data.filter((item) => item._id != user._id)
                setFriends(freinds)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <>
            <p style={{ padding: "0.7rem 0 0 0rem", margin: "0" }}>All Users</p>
            <List sx={{ padding: "0.4" }}>
                {console.log("## onlineUsers:", onlineUsers)}
                {
                    friends.length > 0 ? (
                        friends.map((item, i) => {
                            return (
                                <Link to={`/profile/${item.username}`} className="all-friends-list-item">
                                    <ListItem key={`online${i}`}>
                                        <ListItemIcon style={{ position: "relative" }}>
                                            <img
                                                style={profileStyle}
                                                src={(item.profilePicture == '') ? dummyImage : PF + item.profilePicture} alt={item.username}
                                            />
                                            {
                                                onlineUsers?.find((user) => user.userId == item._id) != null ? (
                                                    <span style={onlineDotStyle}></span>
                                                ) : ""
                                            }
                                        </ListItemIcon>
                                        <ListItemText>{item.username}</ListItemText>
                                    </ListItem>
                                </Link>
                            )
                        })
                    ) : (
                        <OnlineListSkeleton />
                    )
                }
            </List>
        </>
    )
}

export default OnlineList