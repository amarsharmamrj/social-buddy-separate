import { Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect } from "react"
import axios from 'axios'
import { useState } from "react"
import { Link } from "react-router-dom"

const OnlineList = () => {
    const [friends, setFriends] = useState([])

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
                setFriends(res.data)
            })
            .catch((err) => {
                console.log(err)
        })
    }

    useEffect(()=> {
        getAllUsers()
    }, [])
    
    return (
        <>
        <p style={{padding: "0.7rem 0 0 0rem", margin: "0"}}>All Users</p>
        <List sx={{padding: "0.4"}}>
            {
                friends.length > 0 ? (
                    friends.map((item, i) => {
                        return (
                            <Link to={`/profile/${item.username}`} className="all-friends-list-item">
                                <ListItem key={`online${i}`}>
                                    <ListItemIcon style={{position: "relative"}}>
                                        <img style={profileStyle} src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                                        {/* <span style={onlineDotStyle}></span> */}
                                    </ListItemIcon>
                                    <ListItemText>{item.username}</ListItemText>
                                </ListItem>
                                {/* <Divider sx={{width: "95%", marginLeft: "auto"}} /> */}
                            </Link>
                        )
                    })
                ) : ("No Friends yet, add friends")
            }
        </List>
        </>
    )   
}

export default OnlineList