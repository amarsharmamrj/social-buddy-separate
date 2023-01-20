import {Grid} from '@mui/material';
import { useEffect } from 'react';
import { useContext } from 'react';
import { redirect } from 'react-router-dom';
import Feed from '../components/feed/feed';
import ProfileHome from '../components/profile-home/profileHome';
import OnlineFriends from '../components/rightbar/onlineFriends';
import Sidebar from '../components/sidebar/sidebar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const {user} = useContext(AuthContext)
    console.log("#user:", user)
    if(user == null){
        console.log("true")
        redirect("/register") 
    }
    // useEffect(() => {
    //     console.log("#user:", user)
    //    if(user == null) redirect("/login") 
    // }, [])
    return (
        <Grid container>
            <Grid item sm={3} md={3} sx={{display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block"}}}>
                <ProfileHome />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Feed full={false} />
            </Grid>
            <Grid item sm={3} md={3} sx={{display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block"}}}>
                <OnlineFriends />
            </Grid>
        </Grid>
    )
}

export default Home;