import { useContext } from "react";
import Notification from "../components/notification/notification";
import {AuthContext} from "../context/AuthContext"

const Notifications = () => {
    const {noti} = useContext(AuthContext)
    return (
        <div className="all-friends">
            <div style={{padding: "0.5rem"}}>
                {console.log("all noti:", noti)}
                {
                    noti?.length ? (
                        noti.map((item) => <Notification noti={item} />)
                    ) : ("")
                }
            </div>
        </div>
    )
}

export default Notifications;