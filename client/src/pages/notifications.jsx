import { List, Skeleton } from "@mui/material";
import { useContext, useEffect } from "react";
import Notification from "../components/notification/notification";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { useState } from "react";

const Notifications = () => {
    const { user } = useContext(AuthContext)
    const [noti, setNoti] = useState([])

    const getNotifications = (receiver) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/notifications/all/${receiver}`)
            .then((res) => {
                console.log("user notifications res:", res.data)
                setNoti(res.data)
            })
            .catch((error) => {
                console.log("user notifications error:", error)
            })
    }


    useEffect(() => {
        if (user != null) getNotifications(user._id)
    }, [user])

    return (
        <div className="all-noti">
            {
                noti?.length ? (
                    noti.map((item) => {
                        return (
                            <Notification noti={item} allNoti={noti} setNoti={setNoti} />
                        )
                    })
                ) : (
                    [1, 2, 3, 4, 5].map((i) => {
                        return (
                            <div style={{ padding: "0.5rem", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                <Skeleton variant="circular" width={60} height={60} />
                                <Skeleton variant="rectangular" sx={{ height: "25px", width: "90%", margin: "0 0.5rem"}} />
                                <Skeleton variant="rectangular" sx={{ height: "25px", width: "8px"}} />
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default Notifications;