import { useState } from "react"
import useAuthContext from "./useAuthContext"

const useAuthentication = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState("")

    const { dispatch } = useAuthContext()

    const auth = async (data, url) => {
        setIsLoading(true)
        setError("")
        setMsg("")
        console.log("from auth", data)

        const isSignInCalled = url.includes("signin")

        const options = {
            method: "POST",
            body: data,
        }

        if (isSignInCalled) {
            options["headers"] = { "Content-Type": "application/json" }
            options.body = JSON.stringify(data)
        }

        const res = await fetch(url, options)
        let json = await res.json()

        if (json.status) {
            setMsg(json.message)
        } else {
            setError(json.message)
        }

        if (isSignInCalled && json.status) {
            const { user } = json.data
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", user.token)
            dispatch({ type: "LOGIN", payload: { user, token: user.token } })
        }
        setIsLoading(false)
    }

    return { error, isLoading, auth, msg, setMsg, setError }
}

export default useAuthentication
