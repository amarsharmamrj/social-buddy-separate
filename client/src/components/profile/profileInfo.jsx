import { Button, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material"
import { Box } from "@mui/system"
import HomeIcon from '@mui/icons-material/Home';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfileInfo = (props) => {
    const params = useParams();
    const {user: currentUser} = useContext(AuthContext)
    return (
        <Box className="paddingOneRem">
            <Paper elevation={4} sx={{borderRadius: "10px"}}>
                <h1 style={{fontSize: "20px", fontWeight: "700", color: "grey", margin: "0", padding: "10px 0 0 15px"}}>User Information</h1>
                <List>
                    <ListItem sx={{padding: "5px 15px"}}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText>Lives in <b>{props.user.city}</b></ListItemText>
                    </ListItem>
                    <ListItem sx={{padding: "5px 15px"}}>
                        <ListItemIcon><PersonPinCircleIcon /></ListItemIcon>
                        <ListItemText>From <b>{props.user.from}</b></ListItemText>
                    </ListItem>
                    <ListItem sx={{padding: "5px 15px"}}>
                        <ListItemIcon><FavoriteIcon /></ListItemIcon>
                        <ListItemText><b>{props.user.relationship == 1 ? "Single" : (props.user.relationship == 2 ?  "Married": "Unknown")}</b></ListItemText>
                    </ListItem>
                    <ListItem sx={{padding: "5px 15px"}}>
                        <ListItemIcon><ConnectWithoutContactIcon /></ListItemIcon>
                        <ListItemText>Followers <b>{props.user.followers?.length}</b></ListItemText>
                    </ListItem>
                    <ListItem sx={{padding: "5px 15px"}}>
                        <ListItemIcon><ConnectWithoutContactIcon /></ListItemIcon>
                        <ListItemText>Followings <b>{props.user.followings?.length}</b></ListItemText>
                    </ListItem>
                </List>
                <Box sx={{textAlign: "center"}}>
                    {
                        props.user._id == currentUser._id && (
                            <Button component={Link} to={`/profile/update/${props.user._id}`} variant="contained" color="primary" sx={{width: "90%", margin: "0 auto 20px auto"}}>
                                <EditIcon sx={{marginRight: "1rem"}} /> Edit Details
                            </Button>
                        )
                    }
                </Box>
            </Paper>
        </Box>
    )
}

export default ProfileInfo