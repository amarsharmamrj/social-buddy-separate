import { useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Template from './components/nav/template'
import { AuthContext } from './context/AuthContext'
import Home from "./pages/home"
import Register from "./pages/register"
import Profile from './pages/profile'
import Login from './pages/login'
import Messenger from './pages/messenger'
import UpdateProfile from './pages/updateProfile'
import ViewPost from './pages/viewPost'
import AllFriends from './pages/allFriends'
import axios from 'axios'
import Notifications from './pages/notifications'

const Router = () => {
    const { user, dispatch } = useContext(AuthContext)
    console.log("@user:", user)


    const getNotifications = (receiver) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/notifications/${receiver}`)
            .then((res) => {
                console.log("user notifications res:", res.data)
                dispatch({ type: "ALL_NOTI", payload: res.data })
            })
            .catch((error) => {
                console.log("user notifications error:", error)
            })
    }


    useEffect(() => {
        if (user != null) getNotifications(user._id)
    }, [user])

    return (
        <Template>
            <Routes>
                <Route path="/" element={user ? (<Home />) : (<Navigate to="/login" />)} />
                <Route path="/messenger" element={user ? (<Messenger />) : (<Navigate to="/login" />)} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/profile/update/:id" element={<UpdateProfile />} />
                <Route path="/post/:postId" element={<ViewPost />} />
                <Route path="/all-friends" element={<AllFriends />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </Template>
    )
}

export default Router