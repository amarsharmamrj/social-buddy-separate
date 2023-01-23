import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer"

const loginUser =  window.localStorage.getItem("user")
let parsedUser;
if(loginUser){
    parsedUser = JSON.parse(loginUser)
} 

// const notifications =  window.localStorage.getItem("notifications")
// let parsedNotifications;
// if(notifications){
//     parsedNotifications = JSON.parse(notifications)
// }else {
//     parsedNotifications = []
// }

const INITIAL_STATE = {
    user: parsedUser,
    isFetching: false,
    error: false,
    noti: [],
    socket: null,
    onlineUsers: []
    // noti: parsedNotifications
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                noti: state.noti,
                socket: state.socket,
                onlineUsers: state.onlineUsers,
                dispatch
            }}>
            {children}
        </AuthContext.Provider>
    )
}