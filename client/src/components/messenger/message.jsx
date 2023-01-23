import moment from 'moment'
import { useRef } from 'react'
import { useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

const Message = (props) => {
    const dummyImage = "https://gravatar.com/avatar/dd7eb5a6be08145cfd591ceae8f341ca?s=400&d=mp&r=x"
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const scrollRef = useRef()
    console.log("apple:", props.user)

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [props.messages])
    return (
        <div ref={scrollRef} className={props.own ? "message-box own" : "message-box"}>
            <div className="profile-image">
                {/* <img src={dummyImage} alt="profile" /> */}
                {
                    props.own ? (
                        <img
                            // style={profileStyle}
                            src={(props.currentUser.profilePicture == '') ? dummyImage : PF + props.currentUser.profilePicture} alt={props.currentUser.username}
                        />
                    ) : (
                        <img
                            // style={profileStyle}
                            src={(props.user.profilePicture == '') ? dummyImage : PF + props.user.profilePicture} alt={props.user.username}
                        />
                    )
                }
            </div>
            <div className={props.own ? "message own" : "message"}>
                {
                    props.message.deleted ? (
                        <p className="deleted">this message is deleted</p>
                    ) : (
                        props.message.image ? (props.message.image == "" ? (
                            <p>{props.message.text}</p>
                        ) : (
                            <div className="selected-image">
                                <img src={props.message.image} alt="" />
                            </div>
                        )) : (
                            <p>{props.message.text}</p>
                        )
                    )
                }
                <div className="time">
                    <span>{moment(props.message.createdAt).fromNow()}</span>
                    {/* <span>{format(props.message.createdAt)}</span> */}
                </div>
                {
                    !props.message.deleted && props.own ? (
                        <Tooltip title="Delete message">
                            <DeleteIcon className="message-delete"
                                onClick={(e) => props.handleMessageDelete(e, props.message._id, props.message.deleted)} />
                        </Tooltip>
                    ) : (
                        ""
                    )
                }
            </div>
        </div>
    )
}

export default Message;