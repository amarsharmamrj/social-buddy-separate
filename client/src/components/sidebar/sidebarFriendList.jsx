import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { Link } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SidebarFriendList = () => {

    const list = [
        {
            title: "John Doe",
            link: "/feed",
            icon: <AccountCircleIcon />
        },
        {
            title: "John Doe",
            link: "/chats",
            icon: <AccountCircleIcon />
        },
        {
            title: "John Doe",
            link: "/videos",
            icon: <AccountCircleIcon />
        },
        {
            title: "John Doe",
            link: "/groups",
            icon: <AccountCircleIcon />
        },
        {
            title: "John Doe",
            link: "/bookmarks",
            icon: <AccountCircleIcon />
        },
        {
            title: "John Doe",
            link: "/courses",
            icon: <AccountCircleIcon />
        }
    ]

    return (
        <Box>
            <List>
                {
                    list.length > 0 ? (
                        list.map((item, i) => {
                            return (
                                <ListItem key={`newItem${i}`} component={Link} to={item.link} button>
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

export default SidebarFriendList