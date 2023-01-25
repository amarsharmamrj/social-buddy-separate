import { ListItem, ListItemIcon, ListItemText, Skeleton } from "@mui/material"
const OnlineListSkeleton = (props) => {

    return (
        <>
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                    return (
                        <ListItem key={`online${i}`}>
                            <ListItemIcon style={{ position: "relative" }}>
                                <Skeleton variant="circular" width={40} height={40} />
                            </ListItemIcon>
                            <ListItemText> <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: "100%" }} /></ListItemText>
                        </ListItem>
                    )
                })
            }
        </>
    )
}

export default OnlineListSkeleton