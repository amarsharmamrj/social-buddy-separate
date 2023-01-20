import { Button, Paper, Typography, Grid, TextField, Stack, CircularProgress } from "@mui/material"
import { Link, redirect, useNavigate } from 'react-router-dom'
import { Box } from "@mui/system"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { loginCall } from "../apiCalls"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useEffect } from "react"
import axios from 'axios'

const Login = () => {
    const { user, isFetching, error, dispatch } = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        errors: {},
        email: "",
        password: ""
    })

    const handleOnChange = (e) => {
        e.preventDefault()
        let name = e.target.name;
        let value = e.target.value;
        let data = { [name]: value }
        validate(data)
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const validate = (data) => {
        let err = {}, email, password;
        if (data.hasOwnProperty("email")) {
            let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (data.email === '') {
                email = 'Email is required'
            } else {
                email = ''
            }
            err.email = email
        }
        if (data.hasOwnProperty("password")) {
            if (data.password === '') {
                password = 'Password is required'
            } else {
                password = ''
            }
            err.password = password
        }
        setFormData({
            ...formData,
            errors: { ...formData.errors, ...err }
        })
        return err
    }
    const loginCall = async (userCredentials, dispatch) => {
        dispatch({ type: "LOGIN_START" })
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_SERVICE}/api/auth/login`, userCredentials)
            console.log("####", res.data)
            const {email, password, ...otherData} = res.data
            window.localStorage.setItem("user", JSON.stringify(otherData))
            dispatch({ type: "LOGIN_SUCCESS", payload: otherData })
            enqueueSnackbar("Successfully logged in !", { variant: "success" })
            setTimeout(()=> {
                navigate("/")
            }, 1000)
        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE", payload: error })
        }
    }
    const handleOnSubmit = (e) => {
        e.preventDefault()
        let model = {
            email: formData.email,
            password: formData.password
        }
        let flag = true;
        let err = validate(model)
        for (let item in err) {
            if (err[item] != '') flag = false
        }
        if (flag) {
            loginCall(model, dispatch)
        } else {
            console.log("error occured")
            enqueueSnackbar("Kindly fill all fields !", { variant: "error" })
        }
    }
    useEffect(() => {
        console.log("@@user:", user)
        if(user) redirect("/")
    }, [user])
    return (
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, display: "flex", alignItems: "center", height: "100vh", background: "linear-gradient(to top, #39adeb6e, #f2fcfe)" }}>
            <Grid container sx={{ maxWidth: { xs: "100%", sm: "90%", md: "70%" }, margin: "0 auto", display: "flex", alignItems: "center" }}>
                <Grid item sm={6} md={6} sx={{ display: "flex", alignItems: "center", height: "100%", margin: "auto" }}>
                    <div>
                        <h1 style={{ margin: "0", color: "#1976d2" }}>Social Buddy</h1>
                        <h4 style={{ margin: "0" }}>Connect with friends and the world aound you on Social Buddy.</h4>
                    </div>
                </Grid>
                <Grid item sm={6} md={6} sx={{ margin: 'auto' }}>
                    <Paper elevation={4} sx={{ margin: "1rem", borderRadius: "15px", padding: "1.5rem" }}>
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <TextField
                                id="outlined-basic"
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.email}
                                error={formData.errors.email != null ? (formData.errors.email == '' ? false : true) : false}
                                helperText={formData.errors.email ?? formData.errors.email}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Password"
                                type="password"
                                name="password"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.password}
                                error={formData.errors.password != null ? (formData.errors.password == '' ? false : true) : false}
                                helperText={formData.errors.password ?? formData.errors.password}
                            />
                            <Button variant="contained" color="primary" fullWidth={true} size="large" onClick={handleOnSubmit} disabled={isFetching}>
                                {isFetching ? <CircularProgress size="25px" sx={{ color: "white" }} /> : "Log In"}
                            </Button>
                            <Typography component={Link} to="/forgot-password">Forgot Password?</Typography>
                            <Button variant="contained" component={Link} to="/register" color="success" size="large">Create a new account</Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login