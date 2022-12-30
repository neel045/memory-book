import { createContext, useReducer } from "react"

const PostContext = createContext()

const postReducer = (state, action) => {
    switch (action.type) {
        case "SET_POSTS":
            return {
                posts: action.payload,
            }

        case "CREATE_POST":
            return {
                posts: [action.payload, ...state.posts],
            }

        case "DELETE_POST":
            return {
                posts: state.posts.filter((post) => post._id != action.payload._id),
            }

        case "UPDATE_POST":
            return {
                posts: state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                ),
            }

        default:
            return state
    }
}

const PostContextProvider = (props) => {
    const [state, dispatch] = useReducer(postReducer, {
        posts: null,
    })

    return (
        <PostContext.Provider value={{ ...state, dispatch }}>{props.children}</PostContext.Provider>
    )
}

export { PostContextProvider, PostContext, postReducer }
