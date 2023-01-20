import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Box, Chip, Paper } from '@mui/material';
import { Profiler } from 'react';
import Feed from '../components/feed/feed';
import Freinds from '../components/profile/friends';
import ProfileInfo from '../components/profile/profileInfo';
import ProfileTop from '../components/profile/profileTop';
import OnlineFriends from '../components/rightbar/onlineFriends';
import Sidebar from '../components/sidebar/sidebar';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSnackbar } from "notistack"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import Follow from '../components/profile/follow';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Stack } from '@mui/system';


const UpdateProfile = () => {
    const [user, setUser] = useState({})
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [coverPhoto, setCoverPhoto] = useState(null)
    const { user: currentUser, dispatch } = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate()
    const params = useParams()

    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const dummyCoverImage = "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [formData, setFormData] = useState({
        errors: {},
        profilePicture: "",
        coverPicture: "",
        desc: "",
        city: "",
        from: "",
        relationship: 0
    })

    const handleProfilePhoto = (e) => {
        e.preventDefault()
        console.log("handleProfilePhoto:", e.target.files[0])
        setProfilePhoto(e.target.files[0])
    }

    const handleCoverPhoto = (e) => {
        e.preventDefault()
        console.log("handleCoverPhoto:", e.target.files[0])
        setCoverPhoto(e.target.files[0])
    }

    const handleDeleteCoverPhoto = (e) => {
        e.preventDefault();
        setCoverPhoto(null)
    }

    const handleDeleteProfilePhoto = (e) => {
        e.preventDefault();
        setProfilePhoto(null)
    }

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

    const fetchUpdatedUser = (userId) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?userId=${userId}`)
            .then((res) => {
                // console.log("abba data:", res.data)
                window.localStorage.setItem("user", JSON.stringify(res.data))
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        let model = {
            userId: currentUser._id,
            profilePicture: formData.profilePhoto,
            coverPicture: formData.coverPhoto,
            desc: formData.desc,
            from: formData.from,
            city: formData.city,
            relationship: formData.relationship
        }

        if (profilePhoto) {
            const data = new FormData();
            const fileName = Date.now() + profilePhoto.name;
            data.append("name", fileName);
            data.append("file", profilePhoto);
            model.profilePicture = fileName;
            console.log("data", data);

            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/upload/`, data)
                .then((res) => {
                    console.log("res:", res.data)
                    // enqueueSnackbar("Profile Image uploaded succesfully !", { variant: "success" })
                })
                .catch((error) => {
                    console.log("error:", error)
                    enqueueSnackbar("Profile Image upload failed, try again!", { variant: "error" })
                })
        }

        if (coverPhoto) {
            const data = new FormData();
            const fileName = Date.now() + coverPhoto.name;
            data.append("name", fileName);
            data.append("file", coverPhoto);
            model.coverPicture = fileName;
            console.log("data", data);

            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/upload/`, data)
                .then((res) => {
                    console.log("res:", res.data)
                    // enqueueSnackbar("Cover Image uploaded succesfully !", { variant: "success" })
                })
                .catch((error) => {
                    console.log("error:", error)
                    enqueueSnackbar("Cover Image upload failed, try again!", { variant: "error" })
                })
        }

        console.log("model:", model)
        let flag = true;
        // let err = validate(model)
        // for (let item in err) {
        //     if (err[item] != '') flag = false
        // }
        if (flag) {
            axios.put(`${process.env.REACT_APP_API_SERVICE}/api/users/${params.id}`, model)
                .then((res) => {
                    console.log("success:", res.data)
                    enqueueSnackbar("Profile Updated !", { variant: "success" })
                    fetchUpdatedUser(res.data._id)
                    setTimeout(() => {
                        history(-1)
                    }, 1500)
                })
                .catch((error) => {
                    console.log("error:", error)
                })
        } else {
            console.log("error occured")
            enqueueSnackbar("Kindly fill all fields !", { variant: "error" })
        }
    }

    const fetchUser = () => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?userId=${params.id}`)
            .then((res) => {
                console.log("res profile:", res)
                setFormData((prev) => {
                    return {
                        ...prev,
                        profilePicture: res.data.profilePicture,
                        coverPicture: res.data.coverPicture,
                        desc: res.data.desc,
                        city: res.data.city,
                        from: res.data.from,
                        relationship: res.data.relationship,
                        username: res.data.username,
                        email: res.data.email,
                    }
                })
                // setUser(data.data)
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    useEffect(() => {
        if (params.id) fetchUser()
        // window.scrollTo(0, 0)
    }, [params.id])

    return (
        <Grid container className="profile-update">
            <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{ marginBottom: { md: "8rem" } }}>
                        <div className="cover-image-wrapper">
                            {/* <img src="https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" /> */}
                            {
                                coverPhoto != null ? (
                                    <img src={URL.createObjectURL(coverPhoto)} alt="profile image" />
                                ) : (
                                    <img
                                        // style={profileStyle} 
                                        src={(formData.coverPicture == '') ? dummyCoverImage : PF + formData.coverPicture} alt={formData.username}
                                    />
                                )
                            }
                            <div className="profile-image-container">
                                {/* <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="profile" /> */}

                                {
                                    profilePhoto != null ? (
                                        <img src={URL.createObjectURL(profilePhoto)} alt="profile image" />
                                    ) : (
                                        <img
                                            // style={profileStyle} 
                                            src={(formData.profilePicture == '') ? dummyImage : PF + formData.profilePicture} alt={formData.username}
                                        />
                                    )
                                }
                                <h2>{formData.username}</h2>
                                <h4>{formData.desc}</h4>
                            </div>
                        </div>
                    </Box>
                </Grid>
                <Paper elevation={4} className="profile-update-paper">
                    <Stack direction="row" justifyContent="flex-end" className="padding-for-textfields">
                        <Button variant="contained" color="success" onClick={handleOnSubmit} sx={{ margin: "0 1rem 0.5rem 0" }}>Update Profile</Button>
                        <Button variant="contained" color="error" sx={{ margin: "0 1rem 0.5rem 0" }} onClick={() => history(-1)}>Cancel</Button>
                    </Stack>
                    <Grid item container xs={12} sm={12} md={12}>
                        <Grid item sm={6} md={6} className="padding-for-textfields">
                            <Button variant="contained" component="label">
                                <AddPhotoAlternateIcon />
                                Change Cover Photo
                                <input hidden accept="image/*" type="file" onChange={handleCoverPhoto} />
                            </Button>
                            {coverPhoto && (<Chip color="primary" sx={{ marginLeft: "0.5rem" }} label={coverPhoto.name} variant="outlined" onDelete={handleDeleteCoverPhoto} />)}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="padding-for-textfields">
                            <Button variant="contained" component="label">
                                <AddPhotoAlternateIcon />
                                Change Profile Photo
                                <input hidden accept="image/*" type="file" onChange={handleProfilePhoto} />
                            </Button>
                            {profilePhoto && (<Chip color="primary" sx={{ marginLeft: "0.5rem" }} label={profilePhoto.name} variant="outlined" onDelete={handleDeleteProfilePhoto} />)}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="padding-for-textfields">
                            <TextField
                                id="outlined-basic"
                                name="desc"
                                label="Description"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.desc}
                                error={formData.errors.desc != null ? (formData.errors.desc == '' ? false : true) : false}
                                helperText={formData.errors.desc ?? formData.errors.desc}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="padding-for-textfields">
                            <TextField
                                id="outlined-basic"
                                name="city"
                                label="City"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.city}
                                error={formData.errors.city != null ? (formData.errors.city == '' ? false : true) : false}
                                helperText={formData.errors.city ?? formData.errors.city}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="padding-for-textfields">
                            <TextField
                                id="outlined-basic"
                                name="from"
                                label="From"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleOnChange}
                                value={formData.from}
                                error={formData.errors.from != null ? (formData.errors.from == '' ? false : true) : false}
                                helperText={formData.errors.from ?? formData.errors.from}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} className="padding-for-textfields">
                            <FormControl fullWidth={true}>
                                <InputLabel id="demo-simple-select-disabled-label">Relationship</InputLabel>
                                <Select
                                    // id="demo-simple-select-disabled"
                                    name="relationship"
                                    value={formData.relationship}
                                    label="Relationship"
                                    onChange={handleOnChange}
                                >
                                    <MenuItem value={0} disabled>Select Relationship</MenuItem>
                                    <MenuItem value={1}>Single</MenuItem>
                                    <MenuItem value={2}>Married</MenuItem>
                                    <MenuItem value={3}>Don't disclose</MenuItem>
                                </Select>
                                {/* <FormHelperText>Disabled</FormHelperText> */}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid >
    )
}

export default UpdateProfile;