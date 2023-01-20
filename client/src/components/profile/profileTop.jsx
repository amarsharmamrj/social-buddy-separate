import { Box, Typography } from "@mui/material"

const ProfileTop = (props) => {
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const dummyCoverImage = "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <Box sx={{ marginBottom: { md: "8rem" } }}>
            <div className="cover-image-wrapper">
                {/* <img src="https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" /> */}
                <img
                    // style={profileStyle} 
                    src={(props.user.coverPicture == '') ? dummyCoverImage : PF + props.user.coverPicture} alt={props.user.username}
                />
                <div className="profile-image-container">
                    {/* <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="profile" /> */}
                    <img
                        // style={profileStyle} 
                        src={(props.user.profilePicture == '') ? dummyImage : PF + props.user.profilePicture} alt={props.user.username}
                    />
                    <h2>{props.user.username}</h2>
                    <h4>{props.user.email}</h4>
                </div>
            </div>
        </Box>
    )
}

export default ProfileTop