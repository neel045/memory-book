import useAuthContext from "./useAuthContext"
import usePostContext from "./usePostsContext"

const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: postDispatch } = usePostContext()

    const logout = () => {
        localStorage.removeItem("user")
        dispatch({ type: "LOGOUT" })
        postDispatch({ type: "SET_POSTS", payload: null })
    }

    return { logout }
}

export default useLogout
