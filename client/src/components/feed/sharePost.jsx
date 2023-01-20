import { Button, Divider, IconButton, Paper, Stack, TextField, Tooltip } from "@mui/material"
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LabelIcon from '@mui/icons-material/Label';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext'
import { useState } from "react";
import { useSnackbar } from 'notistack'
import axios from 'axios'
import CancelIcon from '@mui/icons-material/Cancel';

const SharePost = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { user } = useContext(AuthContext)
    const [file, setFile] = useState(null)
    const [desc, setDesc] = useState("")

    const handleFile = (e) => {
        e.preventDefault()
        const fileData = e.target.files[0]
        console.log("file:", fileData)
        setFile(fileData)
    }
    const handleOnChangeDesc = (e) => {
        e.preventDefault()
        const desc = e.target.value
        setDesc(desc)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("user, file, desc:", user, file, desc)
        let model = {
            userId: user._id,
            desc: desc,
        }
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            model.img = fileName;
            console.log("data", data);

            axios.post(`${process.env.REACT_APP_API_SERVICE}/api/upload/`, data)
            .then((res) => {
                console.log("res:", res.data)
                // enqueueSnackbar("Image uploaded succesfully !", {variant: "success"})
            })
            .catch((error)=> {
                console.log("error:", error)
                enqueueSnackbar("Image upload failed, try again!", {variant: "error"})
            })
        }

        console.log("model:", model)
        axios.post(`${process.env.REACT_APP_API_SERVICE}/api/posts/`, model)
        .then((res) => {
            console.log("res:", res.data)
            enqueueSnackbar("Post successfull", {variant: "success"})
            window.location.reload()
        })
        .catch((error)=> {
            console.log("error:", error)
            enqueueSnackbar("Something went wrong, try again!", {variant: "error"})
        })
    }
    return (
        <Paper elevation={4} sx={{ borderRadius: "0.5rem", margin: "1rem 0" }}>
            <div className="sharepost-top">
                <div className="sharepost-profile-pic">
                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="profile" />
                </div>
                <div className="sharepost-text">
                    <TextField
                        id="standard-multiline-flexible"
                        fullWidth={true}
                        placeholder="type here and post what's in your mind.."
                        multiline
                        maxRows={4}
                        value={desc}
                        onChange={handleOnChangeDesc}
                        variant="standard"
                    />
                </div>
            </div>

            <Divider />

            {file &&
                <div className="preview-box">
                    <img className="preview-image" src={URL.createObjectURL(file)} alt="" />
                    <Tooltip title="Remove Image">
                        <IconButton className="preview-image-cancel" onClick={() => setFile(null)}>
                            <CancelIcon sx={{color: "white", height: "2rem", width: "2rem"}} />
                        </IconButton>
                    </Tooltip>
                </div>
            }

            <div className="sharepost-bottom">
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    spacing={2}
                >
                    <label htmlFor="file">
                        <Button component="div" startIcon={<PhotoLibraryIcon sx={{ color: "red", textTransform: "capitalize" }} />}>
                            Photos or Video
                            <input style={{ display: "none" }} type="file" id="file" accept=".png,.jpg,.jpeg" onChange={handleFile} />
                        </Button>
                    </label>
                    {/* <Button startIcon={<LabelIcon sx={{ color: "blue" }} />}>
                        Tag
                    </Button>
                    <Button startIcon={<LocationOnIcon sx={{ color: "green" }} />}>
                        Location
                    </Button>
                    <Button startIcon={<EmojiEmotionsIcon sx={{ color: "orange" }} />}>
                        Feelings
                    </Button> */}
                    <Button variant="contained" color="success" onClick={handleSubmit}>
                        Share Post
                    </Button>
                </Stack>
            </div>
        </Paper>
    )
}

export default SharePost