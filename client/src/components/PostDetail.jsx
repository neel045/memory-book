import { useState } from "react"
import "./PostDetail.css"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import useAuthContext from "../hooks/useAuthContext"
import usePostContext from "../hooks/usePostsContext"

const PostDetail = ({ post }) => {
    const { user, token } = useAuthContext()
    const [isLiked, setIsLiked] = useState(post.likes.includes(user._id))
    const [showComments, setShowComments] = useState(false)
    const { dispatch } = usePostContext()
    const [commentText, setCommentText] = useState("")

    const deletePost = async (e) => {
        e.preventDefault()

        const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const json = await res.json()
        if (res.ok) {
            dispatch({ type: "DELETE_POST", payload: json.data.post })
        }
    }

    const handleLikes = async () => {
        const res = await fetch(`/api/posts/likes`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ postId: post._id }),
        })

        const json = await res.json()

        if (res.ok) {
            setIsLiked((prev) => !prev)
            dispatch({ type: "UPDATE_POST", payload: json.data.post })
        }
    }

    const addComment = async () => {
        if (commentText === "") {
            return
        }
        const res = await fetch(`/api/posts/add-comment`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                postId: post._id,
                comment: {
                    text: commentText,
                    postedBy: user._id,
                },
            }),
        })

        const json = await res.json()

        if (res.ok) {
            dispatch({ type: "UPDATE_POST", payload: json.data.post })
        }

        setCommentText("")
    }

    const deleteComment = async (commentToDelete) => {
        const res = await fetch(`/api/posts/delete-comment`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                postId: post._id,
                comment: commentToDelete,
            }),
        })

        const json = await res.json()

        if (res.ok) {
            dispatch({ type: "UPDATE_POST", payload: json.data.post })
        }
    }

    return (
        <div className="card">
            <div className="card-header">
                <img
                    src={`img/users/${post.postedBy.photo}`}
                    alt={post.postedBy.name}
                    className="user-photo"
                />
                <div className="user-details">
                    <p>
                        <strong>{post.postedBy.name}</strong>
                    </p>
                    <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                </div>

                {post.postedBy._id === user._id && (
                    <span className="material-icons" onClick={deletePost}>
                        delete_outline
                    </span>
                )}
            </div>
            <div className="card-image">
                {post.text && <p>{post.text}</p>}
                {post.photo && <img src={`img/posts/${post.photo}`} alt="post image" />}
                <div className="card-like">
                    <span className="material-icons heart" onClick={handleLikes}>
                        {isLiked ? "favorite" : "favorite_border"}
                    </span>
                    <span>{post.likes.length}</span>
                    <span
                        className="material-icons"
                        onClick={() => setShowComments((prev) => !prev)}
                    >
                        add_comment
                    </span>
                    <span>{post.comments.length}</span>
                </div>
            </div>
            <div className="card-footer">
                <div
                    className="comment-container"
                    style={{ display: showComments ? "block" : "none" }}
                >
                    <form className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a Comment.."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <span className="material-icons" onClick={addComment}>
                            send
                        </span>
                    </form>

                    <div className="comments-list">
                        {post.comments &&
                            post.comments.map((comment) => {
                                return (
                                    <div className="comment" key={comment._id}>
                                        <div className="comment-header">
                                            <img
                                                src={`img/users/${comment.postedBy.photo}`}
                                                alt="photo"
                                                className="user-photo"
                                                style={{ height: "25px" }}
                                            />
                                            <p>
                                                <strong>{comment.postedBy.name}</strong>
                                            </p>
                                            <span
                                                className="material-icons"
                                                onClick={() => deleteComment(comment)}
                                            >
                                                delete_outline
                                            </span>
                                        </div>

                                        <p>{comment.text}</p>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetail
