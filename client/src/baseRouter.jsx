import Router from "./router"
import { BrowserRouter, Routes, Route, Redirect, Navigate } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import Login from "./pages/login"
import Register from "./pages/register"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home";

const BaseRouter = () => {
    const {user} = useContext(AuthContext)
    console.log("**AuthContext:", user)
    return (
        <SnackbarProvider anchorOrigin={{vertical: "top", horizontal: "center"}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<Router />} />
                </Routes>
            </BrowserRouter>
        </SnackbarProvider>
    )
}

export default BaseRouter