import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { Link } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
const SidebarMenu = () => {

    const list = [
        {
            title: "Feed",
            link: "/feed",
            icon: <RssFeedIcon />
        },
        {
            title: "Chats",
            link: "/chats",
            icon: <ChatIcon />
        },
        {
            title: "Videos",
            link: "/videos",
            icon: <PlayCircleIcon />
        },
        {
            title: "Groups",
            link: "/groups",
            icon: <GroupsIcon />
        },
        {
            title: "Bookmarks",
            link: "/bookmarks",
            icon: <BookmarksIcon />
        },
        {
            title: "Events",
            link: "/events",
            icon: <CalendarMonthIcon />
        },
        {
            title: "Courses",
            link: "/courses",
            icon: <SchoolIcon />
        }
    ]

    return (
        <Box>
            <List>
                {
                    list.length > 0 ? (
                        list.map((item, i) => {
                            return (
                                <ListItem key={`menu${i}`} component={Link} to={item.link} button>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.title}</ListItemText>
                                </ListItem>
                            )
                        })
                    ) : ("")
                }
            </List>
        </Box>
    )
}

export default SidebarMenu