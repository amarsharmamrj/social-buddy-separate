import { List } from "@mui/material";
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
                    ) : ("No Notifications")
                }
        </div>
    )
}

export default Notifications;