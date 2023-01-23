import { useContext, useState } from "react"
import OnlineList from "../components/rightbar/onlineList"
import { AuthContext } from "../context/AuthContext"

const AllFriends = () => {
    const [onlineUsers, setOnlineUsers] = useState([])
    // const{user, socket} = useContext(AuthContext)
    // socket?.on("getUsers", (users) => {
    //     console.log("@@user socket inner:", users)
    //     if(users != null) setOnlineUsers(users)
    // })
    return (
        <div className="all-friends">
            <div style={{padding: "0.5rem"}}>
                <OnlineList onlineUsers={onlineUsers} />
            </div>
        </div>
    )
}

export default AllFriends;