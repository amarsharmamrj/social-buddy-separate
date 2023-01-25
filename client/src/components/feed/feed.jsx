import { Box, TableSortLabel } from "@mui/material"
import Post from "./post"
import SharePost from "./sharePost"
import axios from 'axios'
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import PostSkeleton from "./postSkeleton"

const Feed = (props) => {
    const [posts, setPosts] = useState([])
    const { user: currentUser } = useContext(AuthContext)

    const fetchPosts = () => {
        console.log("** props.username:", props.username)
        console.log("** user.username:", currentUser)
        let url = props.username ? `${process.env.REACT_APP_API_SERVICE}/api/posts/profile/${props.username}`
            : `${process.env.REACT_APP_API_SERVICE}/api/posts/timeline/${currentUser._id}`
        axios.get(url)
            .then((res) => {
                console.log("res:", res)
                setPosts(res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt)
                }))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchPosts()
    }, [props.username])

    return (
        <Box>
            <div className={props.full ? "feed-wrapper-full-height" : "feed-wrapper"}>
                {console.log("posts:", posts)}
                { (props.username ? (props.username === currentUser.username && <SharePost />) : (<SharePost />)) }
                {
                    posts.length > 0 ? (
                        posts.map((post, i) => {
                            return <Post key={i} post={post} />
                        })
                    ) : (
                        [1,2].map((i) => {
                            return <PostSkeleton key={i} />
                        })
                    )
                }
            </div>
        </Box>
    )
}

export default Feed