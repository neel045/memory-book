import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"
import usePostContext from "../hooks/usePostsContext"

const CreatePostForm = () => {
    const [text, setText] = useState("")
    const [fileName, setFileName] = useState("")
    const [error, setError] = useState("")
    const { dispatch } = usePostContext()
    const { user, token } = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (text.length === 0 && fileName.length === 0) {
            return
        }
        setError("")
        const data = new FormData(e.target)

        const res = await fetch(`/api/posts/new/${user._id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        })
        const json = await res.json()

        if (!res.ok) {
            setError(json.message)
        }

        if (res.ok) {
            setText("")
            console.log(json.data.post)
            setFileName("")
            dispatch({ type: "CREATE_POST", payload: json.data.post })
        }
    }
    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h3>Add Post</h3>
            <textarea
                name="text"
                cols="35"
                rows="5"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>

            <label htmlFor="photo">
                <span className="material-icons">file_upload</span>
                <span>{fileName}</span>
            </label>
            <input
                type="file"
                name="photo"
                id="photo"
                onChange={(e) => setFileName(e.target.files[0].name)}
            />
            {error && <div className="error-message">{error}</div>}
            <button>Post</button>
        </form>
    )
}

export default CreatePostForm
