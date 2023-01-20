import axios from 'axios'

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" })
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_SERVICE}/api/auth/login`, userCredentials)
        console.log("####", res.data)
        const {email, password, ...otherData} = res.data
        window.localStorage.setItem("user", JSON.stringify(otherData))
        dispatch({ type: "LOGIN_SUCCESS", payload: otherData })
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error })
    }
}