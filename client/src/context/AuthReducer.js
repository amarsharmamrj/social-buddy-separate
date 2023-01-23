const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            }
        case "MUTE_UNMUTE_NOTIFY_SOUND":
            return {
                ...state,
                user: {
                    ...state.user,
                    muteNotifySound: action.payload
                }
            }
        case "FOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload]
                }
            }
        case "UNFOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(
                        following => following !== action.payload
                    )
                }
            }
        case "ALL_NOTI":
            return {
                ...state,
                noti: action.payload
            }
        case "ADD_NOTI":
            return {
                ...state,
                noti: [...state.noti, action.payload]
            }
        case "REMOVE_NOTI":
            let items = state.noti.filter((notiItem) => notiItem.sender != action.payload)
            return {
                ...state,
                noti: items
            }
        case "ADD_SOCKET":
            return {
                ...state,
                socket: action.payload
            }
        case "ADD_ONLINE_USERS":
            return {
                ...state,
                onlineUsers: action.payload
            }
        default:
            return state
    }
}

export default AuthReducer