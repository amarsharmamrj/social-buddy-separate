import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import axios from 'axios'

export default function CameraDialog(props) {
    const [cameraLoaded, setCameraLoaded] = useState(false)

    const startCameraRef = useRef()
    const videoRef = useRef()
    // const clickPhotoRef = useRef()
    const canvasRef = useRef()
    const photoRef = useRef()
    const downloadRef = useRef()

    // let camera_button = document.querySelector("#start-camera");
    let video;
    // let click_button = document.querySelector("#click-photo");
    let canvas;

    const handleStopCamera = async () => {
            videoRef.current.srcObject.getVideoTracks()[0].stop();
            videoRef.current.src = '';
    }

    function clearphoto() {
        var context = canvasRef.current.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        var data = canvasRef.current.toDataURL('image/png');
        photoRef.current.setAttribute('src', data);
    }

    function takepicture() {
        var context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        var data = canvasRef.current.toDataURL('image/png');
        console.log("data:", data)
        photoRef.current.setAttribute('src', data);

        downloadRef.current.setAttribute("href", data)
        props.setIsImageSelected(true)
        props.setImageSelected(data)



        const upload = new FormData();
        // const fileName = Date.now() + file.name;
        const fileName = "capture1.png";
        upload.append("name", fileName);
        upload.append("file", data);
        // model.img = fileName;
        console.log("upload", upload);      
        axios.post(`${process.env.REACT_APP_API_SERVICE}/api/upload/`, upload)
        .then((res) => {
            console.log("res:", res.data)
            // enqueueSnackbar("Image uploaded succesfully !", {variant: "success"})
        })
        .catch((error)=> {
            console.log("error:", error)
            // enqueueSnackbar("Image upload failed, try again!", {variant: "error"})
        })
        
    }

    const handleClickPhoto = () => {
        takepicture();
    }
    
    const handleCameraClose = () => {
        props.handleCameraDiloag()
        handleStopCamera()
    }

    const handleNewPhoto = () => {
        clearphoto()
    }

    const handleSendPhoto = () => {
        clearphoto()
        // props.handleCameraDiloag()
    }

    useEffect(() => {
        if (props.cameraDialogOpen) {
            console.log("camera")
            // video = document.querySelector("#video");
            // canvas = document.querySelector("#video");
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
                .then(function (stream) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setCameraLoaded(true)
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });
        }
    }, [props.cameraDialogOpen])

    return (
        <React.Fragment>
            <Dialog
                // fullWidth={true}
                // maxWidth="md"
                open={props.cameraDialogOpen}
                onClose={handleCameraClose}
                // onClose={props.handleCameraDiloag}
            >
                <DialogContent className='camera-dialog-content'>
                    <p>{cameraLoaded ? "" : "Please wait.."}</p>
                    <div className="video-box">
                        <video ref={videoRef} id="video" width="320" height="240" autoplay></video>
                        {/* <button ref={clickPhotoRef} id="click-photo" onClick={handleClickPhoto}>Click Photo</button> */}
                        {
                            cameraLoaded ? (
                                <IconButton onClick={handleClickPhoto} className="click-photo">
                                    <PhotoCameraBackIcon />
                                </IconButton>
                            ) : ("")
                        }
                        <canvas ref={canvasRef} id="canvas" style={{ display: "none" }} width="320" height="240"></canvas>
                        <img ref={photoRef} src="" alt=""></img>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCameraClose}>Close</Button>
                    <Button onClick={handleNewPhoto}>New Photo</Button>
                    <Button><a ref={downloadRef} href="" download>Save</a></Button>
                    <Button onClick={handleSendPhoto}>Send Photo</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}