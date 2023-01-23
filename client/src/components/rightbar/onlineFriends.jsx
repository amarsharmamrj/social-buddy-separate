import { Box } from "@mui/material"
import OnlineList from "./onlineList"

const OnlineFriends = (props) => {
    return (
        <Box className="online-friends-section">
                <OnlineList onlineUsers={props.onlineUsers} />
        </Box>
    )
}

export default OnlineFriends