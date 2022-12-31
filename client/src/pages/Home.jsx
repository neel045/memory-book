import { useEffect } from "react"
import CreatePostForm from "../components/CreatePostForm"
import PostDetail from "../components/PostDetail"
import SearchUser from "../components/SearchUser"
import useAuthContext from "../hooks/useAuthContext"
import usePostContext from "../hooks/usePostsContext"

const Home = () => {
    const { posts, dispatch } = usePostContext()
    const { user, token } = useAuthContext()

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`/api/posts/feed/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const json = await res.json()

            if (res.ok) {
                dispatch({ type: "SET_POSTS", payload: json.data.posts })
            }
        }
        if (user) {
            fetchPosts()
        }
    }, [user, dispatch])

    return (
        <div
            className="home"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                padding: "20px",
            }}
        >
            {user && <CreatePostForm user={user} />}
            {user && (
                <div>{posts && posts.map((post) => <PostDetail key={post._id} post={post} />)}</div>
            )}

            {user && <SearchUser />}
        </div>
    )
}

export default Home
