import { Grid } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { redirect } from 'react-router-dom';
import Feed from '../components/feed/feed';
import ProfileHomeFollowers from '../components/profile-home/profile-home-followers';
import ProfileHome from '../components/profile-home/profileHome';
import Followers from '../components/profile/followers';
import OnlineFriends from '../components/rightbar/onlineFriends';
import Sidebar from '../components/sidebar/sidebar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const { user, dispatch, socket } = useContext(AuthContext)
    // console.log("@ onlineUsers:", onlineUsers)
    if (user == null) {
        redirect("/register")
    }

    // socket?.on("getUsers", (users) => {
    //     if(users != null) setOnlineUsers(users)
    //     dispatch({ type: "ADD_ONLINE_USERS", payload: users })
    // })

    return (
        <Grid container>
            <Grid item sm={3} md={3} sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block" } }}>
                <div className='home-profile-left'>
                <ProfileHome />
                <ProfileHomeFollowers user={user} />
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Feed full={false} />
            </Grid>
            <Grid item sm={3} md={3} sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block" } }}>
                <OnlineFriends onlineUsers={onlineUsers} />
            </Grid>
        </Grid>
    )
}

export default Home;