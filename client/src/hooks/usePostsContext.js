import { useContext } from "react"
import { PostContext } from "../contexts/PostContext"

const usePostContext = () => {
    const context = useContext(PostContext)

    if (!context) {
        throw Error("usePostsContext must be used inside of PostContextProvider")
    }

    return context
}

export default usePostContext
