import { Button, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect } from "react";
import axios from 'axios'
import { useState } from "react";
import { Link } from "react-router-dom";

const Followers = (props) => {
    const [freindsList, setFriendsList] = useState([])
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const profileStyle = {
        height: "50px",
        width: "50px",
        borderRadius: "0.5rem 0.5rem 0 0.5rem"
    }

    const fetchFreinds = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users/friends/followers/${props.user._id}`)
            .then((res) => {
                console.log("res:", res.data)
                setFriendsList(res.data)

            })
            .catch((err) => {
                console.log("err:", err)
            })
    }

    useEffect(() => {
        fetchFreinds()
    }, [props.user._id])


    return (
        <Box className="paddingOneRem">
            <Paper elevation={4} sx={{ borderRadius: "10px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "700", color: "grey", margin: "0", padding: "10px 0 0 15px" }}>All Followers ({freindsList.length})</h1>
                <List>
                    {
                        freindsList.length > 0 ? (
                            freindsList.map((friend, i) => {
                                return (
                                    <Box key={`friend${i}`} className="cardStyleFriendsList">
                                        <Link to={`/profile/${friend.username}`} style={{ textDecoration: "none" }}>
                                            <ListItem sx={{ padding: "0" }}>
                                                <ListItemIcon>
                                                    {/* <img 
                                                        style={profileStyle}
                                                        src={(friend.profilePicture == '') ?  dummyImage : PF + friend.prifilePicture} alt={friend.username}
                                /> */}
                                                        <img
                                                    style={profileStyle}
                                                    src={(friend.profilePicture == '') ? dummyImage : PF + friend.profilePicture} alt={friend.username}
                                            />
                                                </ListItemIcon>
                                                <ListItemText>{friend.username}</ListItemText>
                                            </ListItem>
                                        </Link>
                                    </Box>
                                )
                            })
                        ) : (<div style={{ padding: "1rem" }}>No Followers</div>)
                    }
                </List>
                <Box sx={{ textAlign: "center" }}>
                    {
                        freindsList.length > 0 && (
                            <Button variant="contained" color="success" sx={{ width: "90%", margin: "0 auto 20px auto" }}>
                                Show more
                            </Button>
                        )
                    }

                </Box>
            </Paper>
        </Box>
    )
}

export default Followers