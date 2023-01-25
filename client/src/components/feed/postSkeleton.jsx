import { Paper, Skeleton, Stack } from "@mui/material"
const PostSkeleton = () => {
    return (
        <>
            <Paper elevation={4} sx={{ borderRadius: "8px", padding: "0.5rem 0.5rem 0 0.5rem", margin: "0rem 0 0.8rem 0" }}>
                <div className="post-author-info">
                    <Stack direction="row" spacing={1} justifyContent="flex-start">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: "40%" }} />
                    </Stack>
                </div>
                <div className="post-text">
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: "70%" }} />
                </div>
                <div className="post-image">
                    <Skeleton variant="rectangular" height={200} sx={{ margin: "1rem 0" }} />
                </div>

                <div className="like-comment-buttons">
                    <Stack direction="row" justifyContent="space-around" sx={{ padding: "0.2rem 0" }}>
                        <Skeleton variant="rounded" width={100} height={40} />
                        <Skeleton variant="rounded" width={100} height={40} />
                        <Skeleton variant="rounded" width={100} height={40} />

                    </Stack>
                </div>
            </Paper>
        </>
    )
}

export default PostSkeleton