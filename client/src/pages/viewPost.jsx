import { Button, Divider, Grid, IconButton, Menu, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRef } from "react";
import moment from "moment";

import LinkIcon from '@mui/icons-material/Link';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

const ViewPost = (props) => {
    // const { post } = props
    const params = useParams()
    const history = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const [post, setPost] = useState({})
    const [like, setLike] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [postEditValue, setPostEditValue] = useState("")
    const [postEdit, setPostEdit] = useState(false)
    const [user, setUser] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl);

    const postDescRef = useRef()

    const { user: currentUser, dispatch } = useContext(AuthContext)

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleLike = () => {
        if (!isLiked) {
            setLike(like + 1)
            setIsLiked(true)
            likePost()
        } else {
            setLike(like - 1)
            setIsLiked(false)
            likePost()
        }
    }

    const likePost = () => {
        console.log("handleLikePost cliked")
        const model = { userId: user._id }
        axios.put(`${process.env.REACT_APP_API_SERVICE}/api/posts/${post._id}/like`, model)
            .then((res) => {
                console.log("liked sucess:", res.data)
            })
            .catch((error) => {
                console.log("something went wrong:", error)
            })
    }

    const fetchUser = (userId) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/users?userId=${userId}`)
            .then((data) => {
                setUser(data.data)
            })
            .catch((error) => {
                console.log("error:", error)
            })
    }

    const handleShareOptions = (postId) => {
        // e.preventDefault()
        console.log("handleShareOptions cliked")
        if (navigator.share) {
            navigator.share({
                title: "Social Buddy",
                url: `${process.env.REACT_APP_CLIENT_SERVICE}/post/${postId}`
            })
                .then((res) => {
                    console.log("Shared successfully")
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const handlePostMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handlePostMenuClose = () => {
        setAnchorEl(null);
    }

    const handleEditPost = (desc) => {
        // e.preventDefault()
        setPostEdit(true)
        setAnchorEl(null)
        setPostEditValue(desc)
    }

    const handleDeletePost = (postId) => {
        let model = {
            userId: currentUser._id,
        }
        console.log("model:", model)
        axios.delete(`${process.env.REACT_APP_API_SERVICE}/api/posts/${postId}/${currentUser._id}`)
            .then((res) => {
                console.log("res:", res.data)
                setAnchorEl(null)
                window.location.reload()
            })
            .catch((error) => {
                console.log("error")
            })
    }

    const handleCopyPost = (postId) => {
        let url = `${process.env.REACT_APP_CLIENT_SERVICE}/post/${postId}`
        navigator.clipboard.writeText(url);
        setAnchorEl(null)
        enqueueSnackbar("Link copied to clipboard !", {
            variant: "success",
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
            }
        })
    }

    const handleOnChangeDesc = (e) => {
        e.preventDefault();
        setPostEditValue(e.target.value)
    }

    const handleUpdatePost = (postId) => {
        // e.preventDefault()
        let model = {
            userId: currentUser._id,
            desc: postEditValue
        }
        console.log("model:", model)
        axios.put(`${process.env.REACT_APP_API_SERVICE}/api/posts/${postId}`, model)
            .then((res) => {
                console.log("res:", res.data)
                window.location.reload()
            })
            .catch((error) => {
                console.log("error")
            })
    }

    const handleUnfollow = (userId) => {
        // e.preventDefault()
        const url = `${process.env.REACT_APP_API_SERVICE}/api/users/${userId}/unfollow`

        dispatch({ type: "UNFOLLOW", payload: userId })

        const model = { userId: currentUser._id }

        axios.put(url, model)
            .then((res) => {
                console.log(`user unfollowed`)
                enqueueSnackbar("User unfollowed", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    }
                })
                setTimeout(()=>{
                    history(-1)
                }, 1000)
            })
            .catch((error) => {
                console.log("errr", error)
            })
    }

    const renderPostMenu = (
        <Menu
            //   onClick={handleMenuClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            //   id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handlePostMenuClose}
        >
            {
                post.userId === currentUser._id ? (
                    <>
                        <MenuItem component={Link} onClick={() => handleCopyPost(post._id)}><LinkIcon sx={{ marginRight: "0.5rem" }} /> Copy link to post</MenuItem>
                        <MenuItem component={Link} onClick={() => handleEditPost(post.desc)}><ModeEditIcon sx={{ marginRight: "0.5rem" }} /> Edit Post</MenuItem>
                        <MenuItem component={Link} onClick={() => handleDeletePost(post._id)}><DeleteIcon sx={{ marginRight: "0.5rem" }} /> Delete Post</MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem component={Link} onClick={() => handleCopyPost(post._id)}><LinkIcon sx={{ marginRight: "0.5rem" }} /> Copy link to post</MenuItem>
                        <MenuItem component={Link} onClick={() => handleUnfollow(post.userId)}><DoDisturbOnIcon sx={{ marginRight: "0.5rem" }} /> Unfollow {user.username}</MenuItem>
                    </>
                )
            }
        </Menu>
    );

    const fetchPost = (postId) => {
        axios.get(`${process.env.REACT_APP_API_SERVICE}/api/posts/${postId}`)
            .then((res) => {
                console.log("fetchpost:", res.data)
                fetchUser(res.data.userId)
                setPost(res.data)
            })
            .catch((error) => {
                console.log("fetchpost error:", error)
            })
    }

    // useEffect(() => {
    //     fetchUser()
    // }, [post.userId])


    // useEffect(() => {
    //     setIsLiked(post.likes.includes(currentUser.userId))
    // }, [currentUser._id, post.likes])

    useEffect(() => {
        if (params.postId != null) fetchPost(params.postId)
    }, [params.postId])

    return (
        <>
            <Grid container className="view-post-container">
                <Grid item xs={12} sm={12} md={12} p={1}>
                    <Paper elevation={4} sx={{ borderRadius: "8px", padding: "0.5rem 0.5rem 0 0.5rem", margin: "0rem 0 0.8rem 0" }}>
                        <div className="post-author-info">
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                                <div className="author">
                                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                        <Link to={`/profile/${user.username}`}>
                                            <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                                        </Link>
                                        <Typography className="author-name" variant="h4" sx={{ display: "inline" }}>{user.username}</Typography>
                                        <Typography className="post-time" variant="h6" sx={{ display: "inline" }}>{moment(post.createdAt).fromNow()}</Typography>
                                    </Stack>
                                </div>
                                <IconButton aria-label="menu" color="success" onClick={handlePostMenu}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Stack>
                        </div>
                        <div className="post-text">
                            {
                                postEdit ? (
                                    <div className="edit-post-box">
                                        <div className="editpost-text">
                                            <TextField
                                                ref={postDescRef}
                                                id="standard-multiline-flexible"
                                                fullWidth={true}
                                                placeholder="type here and post what's in your mind.."
                                                multiline
                                                maxRows={4}
                                                value={postEditValue}
                                                onChange={handleOnChangeDesc}
                                                variant="standard"
                                            />
                                        </div>
                                        <Button variant="contained" color="warning" onClick={(e) => setPostEdit(false)}>Cancel</Button>
                                        <Button variant="contained" color="success" onClick={(e) => handleUpdatePost(post._id)}>Update</Button>
                                    </div>
                                ) : (
                                    <Typography variant="h4">{post.desc}</Typography>
                                )
                            }
                        </div>
                        <div className="post-image">
                            <img
                                src={PF + post.img}
                                alt="post image" />
                        </div>
                        <div className="like-comment-info">
                            <Stack justifyContent="space-between" direction="row">
                                <div className="like-section">
                                    <FavoriteIcon sx={{ color: "#f11010", marginRight: "0.5rem" }} /> {like}
                                </div>
                                <div className="comment-section">
                                    {2} comments
                                </div>
                            </Stack>
                        </div>
                        <Divider />
                        <div className="like-comment-buttons">
                            <Stack direction="row" justifyContent="space-around" sx={{ padding: "0.2rem 0" }}>
                                <Button
                                    startIcon={
                                        isLiked ? (<FavoriteIcon sx={{ color: "#f11010" }} />)
                                            : (<FavoriteBorderIcon sx={{ color: "black" }} />)
                                    }
                                    onClick={handleLike}
                                >
                                    Like
                                </Button>
                                <Button startIcon={<InsertCommentIcon sx={{ color: "black" }} />}>
                                    Comment
                                </Button>
                                <Button startIcon={<ShareIcon sx={{ color: "black" }} />} onClick={() => handleShareOptions(post._id)} >
                                    Share
                                </Button>
                            </Stack>
                        </div>
                        {renderPostMenu}
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default ViewPost