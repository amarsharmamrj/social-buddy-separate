import { containerClasses } from "@mui/material"

export const LoginStart = (userCredentials) => {
    return {
        type: "LOGIN_START"
    }
}

export const LoginSuccess = (user) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: user
    }
}

export const LoginFailure = (error) => {
    return {
        type: "LOGIN_FAILURE",
        payload: error
    }
}

export const MuteUnmuteNotifySound = (data) => {
    return {
        type: "MUTE_UNMUTE_NOTIFY_SOUND",
        payload: data
    
    }
}

export const Follow = (userId) => {
    return {
        type: "FOLLOW",
        payload: userId
    
    }
}

export const UnFollow = (userId) => {
    return {
        type: "UNFOLLOW",
        payload: userId
    
    }
}

export const AllNoti = (item) => {
    return {
        type: "ALL_NOTI",
        payload: item
    }
}

export const AddNoti = (item) => {
    return {
        type: "ADD_NOTI",
        payload: item
    }
}


export const RemoveNoti = (item) => {
    return {
        type: "REMOVE_NOTI",
        payload: item
    }
}

export const AddSocket = (item) => {
    return {
        type: "ADD_SOCKET",
        payload: item
    }
}

export const AddOnlineUsers = (data) => {
    return {
        type: "ADD_ONLINE_USERS",
        payload: data
    }
}
