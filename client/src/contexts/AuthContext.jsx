import { createContext, useEffect, useReducer } from "react"

const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload.user, token: action.payload.token || state.token }

        case "LOGOUT":
            return { user: null, token: "" }

        default:
            return state
    }
}

const AuthContectProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null,
    })

    useEffect(() => {
        const user = localStorage.getItem("user")
        const token = localStorage.getItem("token")
        if (user) {
            dispatch({ type: "LOGIN", payload: { user: JSON.parse(user), token } })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>{props.children}</AuthContext.Provider>
    )
}

export { AuthContext, AuthContectProvider, authReducer }
