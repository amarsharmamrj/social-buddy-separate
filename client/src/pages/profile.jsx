import { Box, Grid } from '@mui/material';
import { Profiler } from 'react';
import Feed from '../components/feed/feed';
import Freinds from '../components/profile/friends';
import ProfileInfo from '../components/profile/profileInfo';
import ProfileTop from '../components/profile/profileTop';
import OnlineFriends from '../components/rightbar/onlineFriends';
import Sidebar from '../components/sidebar/sidebar';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Follow from '../components/profile/follow';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Followers from '../components/profile/followers';
import Followings from '../components/profile/followings';


const Profile = () => {
    const [user, setUser] = useState({})
    const { user: currentUser } = useContext(AuthContext)
    const params = useParams()
    console.log("param:", params.username)
    const userId = '1'
    const fetchUser = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?username=${params.username}`)
            .then((data) => {
                console.log("data profile:", data)
                setUser(data.data)
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    useEffect(() => {
        fetchUser()
        window.scrollTo(0, 0)
    }, [params.username])
    return (
        <Grid container className="profile-container">
            <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={12} sm={12} md={12}>
                    <ProfileTop user={user} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} mt={10}>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none", xl: "none" } }}>
                        <ProfileInfo user={user} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none", xl: "none" } }}>
                        <Freinds user={user} />
                        <Followers user={user} />
                        <Followings user={user} />
                    </Box>
                </Grid>
                <Grid item container xs={12} sm={12} md={12}>
                    <Grid item xs={12} sm={12} md={8}>
                        <Feed full={true} username={params.username} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        {user._id !== currentUser._id && <Follow user={user} />}
                        <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block" } }}>
                            <ProfileInfo user={user} />
                            <Freinds user={user} />
                            <Followers user={user} />
                            <Followings user={user} />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Profile;