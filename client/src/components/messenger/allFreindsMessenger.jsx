import { Badge, Divider, List, ListItem, ListItemIcon, ListItemText, Skeleton } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect } from "react"
import axios from 'axios'
import { useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const AllFreindsMessenger = (props) => {
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const { noti } = useContext(AuthContext)

    const [freindsList, setFriendsList] = useState([])
    const [freindsListLoading, setFreindsListLoading] = useState(true)
    const [messageFromUsers, setMessageFromUsers] = useState([])

    const profileStyle = {
        height: "32px",
        width: "32px",
        borderRadius: "100%",
        marginRight: "0.5rem"
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

    const handleAddCoversation = (userId) => {
        // console.log("handleAddCoversation clicked")
        const currentUserId = props.currentUser._id
        const model = {
            senderId: currentUserId,
            recieverId: userId
        }
        let flag = false
        let alreadyConv = props.conversation.find((conv) => {
            return conv.members.includes(currentUserId) && conv.members.includes(userId)
        })
        if (alreadyConv != null) flag = true
        if (!flag) {
            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/conversations/`, model)
                .then((res) => {
                    // console.log("aa res", res.data)
                    props.getConversation()
                    props?.handleChat("recent")
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            props.handelSelectConversation(alreadyConv)
        }
    }

    const fetchFreinds = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users/friends/${props.currentUser._id}`)
            .then((res) => {
                // console.log("fetchFreinds:", res.data)
                // setFriendsList(res.data.sort((p1, p2) => {
                //     return new Date(p2.updatedAt) - new Date(p1.updatedAt)
                // }))
                setFreindsListLoading(false)
                setFriendsList(res.data)

            })
            .catch((err) => {
                setFreindsListLoading(false)
                console.log("err:", err)
            })
    }

    // fetchFreinds()

    useEffect(() => {
        // console.log("!@props.currentUser:", props.currentUser)
        if (props.currentUser._id != null) fetchFreinds()
    }, [props.currentUser])

    // useEffect(() => {
    //     console.log("arrival message:", props.arrivalMessage)
    //     if (props.arrivalMessage != null) {
    //         setMessageFromUsers((prev) => {
    //             return [
    //                 ...prev, props.arrivalMessage.sender
    //             ]
    //         })
    //     }
    // }, [props.arrivalMessage])

    return (
        <Box className="online-freinds-list-box">
            <p style={{ padding: "1rem 0 0 1rem", margin: "0" }}>My Friends</p>
            <List key="all-freinds-key">
                {
                    !freindsListLoading ? (
                        freindsList.length > 0 ? (
                            freindsList.map((item, i) => {
                                return (
                                    <>
                                        <ListItem key={`all-online${i}`} onClick={() => handleAddCoversation(item._id)} className="messenger-all-friends-list-item">
                                            <ListItemIcon key={`all-online-icon${i}`} style={{ position: "relative", minWidth: "auto" }}>
                                                <img
                                                    style={profileStyle}
                                                    src={(item.profilePicture == '') ? dummyImage : PF + item.profilePicture} alt={item.username}
                                                />
                                            </ListItemIcon>
                                            {console.log("messageFromUsers:", props.messageFromUsers)}
                                            {console.log("noti all:", noti)}
                                            {/* {noti.length > 0 && noti.some((notiItem) =>  notiItem.sender == item._id) ? (
                                            <Badge badgeContent="new" color="error">
                                                <ListItemText key={`all-online-text${i}`} className="messenger-freind-name">{item.username}</ListItemText>
                                            </Badge>
                                        ) : ( */}
                                            <ListItemText key={`all-online-text${i}`} className="messenger-freind-name">{item.username}</ListItemText>
                                            {/* )} */}
                                            {(noti.length > 0 && noti.some((notiItem) => notiItem.sender == item._id)) && <NotificationsActiveIcon sx={{ color: "#d32f2f" }} />}

                                        </ListItem>
                                        <Divider key={`all-online-divider${i}`} />
                                    </>
                                )
                            })
                        ) : (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="no-messages">
                                    <p style={{ color: "grey", fontSize: "1rem", fontWeight: "500", textAlign: "center" }}>No freinds yet! Add new freinds.</p>
                                    {/* <img src={`${PF}chat-bg-1.webp`} alt="gif" /> */}
                                    <img style={{ height: "8rem" }} src="https://media.tenor.com/Zh-rihpJKbEAAAAC/love-komik.gif" alt="gif" />
                                </div>
                            </div>
                        )
                    ) : (
                        [1, 2, 3, 4, 5].map((i) => {
                            return (
                                <div style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}>
                                    <Skeleton variant="circular" sx={{ height: "25px", width: "25px", padding: "0.5rem" }} />
                                    <Skeleton variant="rectangular" sx={{ height: "20px", width: "70%", margin: "0 0.5rem" }} />
                                </div>
                            )
                        })
                    )
                }
            </List>
        </Box>
    )
}

export default AllFreindsMessenger