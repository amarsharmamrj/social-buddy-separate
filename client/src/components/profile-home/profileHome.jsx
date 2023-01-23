import { IconButton } from "@mui/material";
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';

const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
const dummyCoverImage = "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const ProfileHome = () => {
    const { user, socket } = useContext(AuthContext)
    return (
        <div className="profile-home">
            <div className="images-container">
                <img
                    src={(user.coverPicture == '') ? dummyCoverImage : PF + user.coverPicture}
                    alt={user.username}
                    className="cover-image"
                />
                <div className="profile-image-box">
                    <img
                        src={(user.profilePicture == '') ? dummyImage : PF + user.profilePicture}
                        alt={user.username}
                        className="profile-image"
                    />
                </div>
            </div>
            <div className="info">
                <h1>{user.username}</h1>
                <p>{user.desc}</p>
            </div>
            <div className="counting-box">
                    <div className="count">
                        <h1>{user.followers?.length}</h1>
                        <p>Followers</p>
                    </div>
                    <div className="edit">
                        <IconButton component={Link} to={`/profile/update/${user._id}`}>
                            <EditIcon />
                            <p>Edit Profile</p>
                        </IconButton>
                    </div>
                    <div className="count">
                        <h1>{user.followings?.length}</h1>
                        <p>Followings</p>
                    </div>
                </div>
        </div>
    )
}

export default ProfileHome