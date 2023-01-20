import { Button, Paper, Typography, Grid, TextField, Stack, InputAdornment, IconButton } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom'
import { Box } from "@mui/system"
import { useState } from "react"
import axios from 'axios'
import { useSnackbar } from 'notistack';

const Register = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const [togglePassword, setTogglePassword] = useState(false)
    const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        errors: {},
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleTogglePassword = () => {
        setTogglePassword(!togglePassword)
    }

    const handleToggleConfirmPassword = () => {
        setToggleConfirmPassword(!toggleConfirmPassword)
    }

    const handleOnChange = (e) => {
        e.preventDefault()
        let name = e.target.name
        let value = e.target.value
        let data = { [name]: value }
        validate(data)
        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    const validate = (data) => {
        let err = {}, username, email, password, confirmPassword;
        if (data.hasOwnProperty("username")) {
            let nameRegex = /^[a-zA-Z ]{2,40}$/;
            if (data.username === '') {
                username = 'Username is required'
            } else if (!nameRegex.test(data.name)) {
                username = "Kindly enter a valid username."
            } else if (data.username.length < 3) {
                username = 'Username should be more than 2 characters'
            } else if (data.username.length > 40) {
                username = 'Username should be less than 40 characters'
            } else {
                username = ''
            }
            err.username = username
        }
        if (data.hasOwnProperty("email")) {
            let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (data.email === '') {
                email = 'Email is required'
            } else if (!emailRegex.test(data.email)) {
                email = 'Kindly enter a valid email'
            } else if (data.email.length > 50) {
                email = 'Email should be less than 50 characters'
            } else {
                email = ''
            }
            err.email = email
        }
        if (data.hasOwnProperty("password")) {
            if (data.password === '') {
                password = 'Password is required'
            }
            else if (data.password.length < 6) {
                password = 'Password should be more than 5 characters'
            } else if (data.password.length > 40) {
                password = 'Password should be less than 40 characters'
            } else {
                password = ''
            }
            err.password = password
        }
        if (data.hasOwnProperty("confirmPassword")) {
            if (data.confirmPassword != formData.password) {
                confirmPassword = 'Confirm password does not match with the above password'
            } else {
                confirmPassword = ''
            }
            err.confirmPassword = confirmPassword
        }
        setFormData({
            ...formData,
            errors: { ...formData.errors, ...err }
        })
        return err
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let model = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        }

        let flag = true;
        let err = validate(model)
        for (let item in err) {
            if (err[item] != '') flag = false
        }

        if (flag) {
            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/auth/register`, model)
                .then((data) => {
                    console.log("data:", data)
                    enqueueSnackbar("Registration successfull!", { variant: 'success' })
                    setTimeout(()=> {
                        navigate("/login")
                    }, 1500)
                })
                .catch((err) => {
                    console.log("err:", err)
                    enqueueSnackbar("Something went wrong!", { variant: 'error' })
                })
        } else {
            enqueueSnackbar("Kindly validate all the fields!", { variant: 'error' })
        }
    }

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
                                name="username"
                                label="Username"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.username}
                                error={formData.errors.username == null ? false : (formData.errors.username === '' ? false : true)}
                                helperText={formData.errors.username ?? formData.errors.username}
                            />
                            <TextField
                                id="outlined-basic"
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.email}
                                error={formData.errors.email == null ? false : (formData.errors.email === '' ? false : true)}
                                helperText={formData.errors.email ?? formData.errors.email}
                            />
                            <TextField
                                id="outlined-basic"
                                name="password"
                                type={togglePassword ? 'string' : 'password'}
                                label="Password"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton type="button" onClick={handleTogglePassword}>{togglePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>
                                    </InputAdornment>,
                                }}
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.password}
                                error={formData.errors.password == null ? false : (formData.errors.password === '' ? false : true)}
                                helperText={formData.errors.password ?? formData.errors.password}
                            />
                            <TextField
                                id="outlined-basic"
                                name="confirmPassword"
                                type={toggleConfirmPassword ? 'string' : 'password'}
                                label="Confirm Password"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton type="button" onClick={handleToggleConfirmPassword}>{toggleConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>
                                    </InputAdornment>,
                                }}
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.confirmPassword}
                                error={formData.errors.confirmPassword == null ? false : (formData.errors.confirmPassword === '' ? false : true)}
                                helperText={formData.errors.confirmPassword ?? formData.errors.confirmPassword}
                            />
                            <Button variant="contained" color="primary" fullWidth={true} size="large" onClick={handleSubmit}>Sign Up</Button>
                            <Button variant="contained" component={Link} to="/login" color="success" size="large">Log Into Account</Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Register