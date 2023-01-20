import { Box, Divider } from "@mui/material"
import SidebarFriendList from "./sidebarFriendList"
import SidebarMenu from "./sidebarMenu"

const Sidebar = () => {

    return (
        <Box className="sidebar-container">
            <SidebarMenu />
            <Divider />
            <SidebarFriendList />
        </Box>
    )
}

export default Sidebar