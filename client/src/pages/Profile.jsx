import { useEffect, useState } from "react"
import PostDetail from "../components/PostDetail"
import UserCard from "../components/UserCard"
import useAuthContext from "../hooks/useAuthContext"
import usePostContext from "../hooks/usePostsContext"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import "./css/Profile.css"
import Modal from "react-modal"
import { Navigate } from "react-router-dom"

const customStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        width: 400,
    },
}

const Profile = () => {
    const { user, token, dispatch: authDispatch } = useAuthContext()
    const [error, setError] = useState("")
    const { posts, dispatch } = usePostContext()
    const [contentToShow, setContentToShow] = useState("posts")
    const [modalOpen, setModalOpen] = useState(false)
    const [changePasswordModal, setchangePasswordModal] = useState(false)
    Modal.setAppElement("*")
    const [msg, setMsg] = useState("")

    const [userUpdateData, setUserUpdateData] = useState({
        name: "",
        about: "",
    })

    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    })

    useEffect(() => {
        setError("")
        const fetchPost = async () => {
            const res = await fetch(`/api/posts/by/${user._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const json = await res.json()

            if (res.ok) {
                dispatch({ type: "SET_POSTS", payload: json.data.posts })
            }
            if (!res.ok) {
                setPosts(null)
                setError(json.message)
            }
        }
        if (user) {
            fetchPost()
            setUserUpdateData({ name: user.name, about: user.about })
        }
    }, [dispatch, user])

    const updateUser = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        console.log({ formData })

        const res = await fetch(`/api/users/${user._id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const json = await res.json()

        if (json.status) {
            const { user } = json.data
            localStorage.setItem("user", JSON.stringify(user))
            authDispatch({ type: "LOGIN", payload: { user } })
            setModalOpen((prev) => !prev)
        }

        if (!json.status) {
            setError(json.message)
            setModalOpen((prev) => !prev)
        }
    }

    const changePassword = async (e) => {
        e.preventDefault()
        if (
            changePasswordData.currentPassword.length < 8 ||
            changePasswordData.newPassword.length < 8
        ) {
            return
        }

        const res = await fetch(`api/auth/${user._id}/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                password: changePasswordData.currentPassword,
                newPassword: changePasswordData.newPassword,
            }),
        })

        const json = await res.json()

        console.log(json)
        if (json.status) {
            setMsg(json.message)
        } else {
        }
    }

    return (
        <div className="profile-page">
            {error && <div className="error-message"> {error}</div>}

            {user && (
                <div className="update-user">
                    <Modal
                        isOpen={modalOpen}
                        update-form
                        onRequestClose={() => setModalOpen(false)}
                        style={customStyles}
                    >
                        <form className="form-update" onSubmit={updateUser}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={(e) =>
                                    setUserUpdateData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                value={userUpdateData.name}
                                required
                            />

                            <label htmlFor="about">About</label>
                            <textarea
                                name="about"
                                id="about"
                                cols="33"
                                rows="6"
                                onChange={(e) =>
                                    setUserUpdateData((prev) => ({
                                        ...prev,
                                        about: e.target.value,
                                    }))
                                }
                                value={userUpdateData.about}
                                style={{ padding: "10px" }}
                            ></textarea>

                            <label htmlFor="photo">Profile Picture</label>
                            <input type="file" name="photo" id="photo" />
                            <button>Submit</button>
                        </form>
                    </Modal>
                </div>
            )}

            {user && (
                <div className="change-password">
                    <Modal
                        isOpen={changePasswordModal}
                        update-form
                        onRequestClose={() => setchangePasswordModal(false)}
                        style={customStyles}
                    >
                        <form className="form-update" onSubmit={changePassword}>
                            <h3>Change Password</h3>

                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                onChange={(e) =>
                                    setChangePasswordData((prev) => ({
                                        ...prev,
                                        currentPassword: e.target.value,
                                    }))
                                }
                                value={changePasswordData.currentPassword}
                                required
                            />

                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                onChange={(e) =>
                                    setChangePasswordData((prev) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                    }))
                                }
                                value={changePasswordData.newPassword}
                                required
                            />
                            {msg && <div className="success-message">{msg} </div>}
                            <button>Submit</button>
                        </form>
                    </Modal>
                </div>
            )}

            {user && (
                <div className="profile">
                    <header>
                        <img src={`img/users/${user.photo}`} alt={user.name} />
                        <div className="profile-details">
                            <div className="profile-header">
                                <p>
                                    <strong>{user.name}</strong>
                                </p>

                                <button onClick={() => setModalOpen((prev) => !prev)}>Edit</button>
                                <button onClick={() => setchangePasswordModal((prev) => !prev)}>
                                    Change Password
                                </button>
                            </div>

                            <div className="profile-stats">
                                <span>
                                    <strong>{posts && posts.length} </strong>
                                    posts
                                </span>
                                <span>
                                    <strong>{user.following.length} </strong>
                                    following
                                </span>
                                <span>
                                    <strong>{user.followers.length} </strong>
                                    followers
                                </span>
                            </div>
                            <p className="profile-about">{user.about}</p>
                            <p className="profile-about">
                                Joined{" "}
                                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </header>

                    <main>
                        <div className="profile-nav">
                            <span
                                className={contentToShow === "posts" ? "selected" : ""}
                                onClick={() => setContentToShow("posts")}
                            >
                                posts
                            </span>
                            <span
                                className={contentToShow === "following" ? "selected" : ""}
                                onClick={() => setContentToShow("following")}
                            >
                                following
                            </span>
                            <span
                                className={contentToShow === "followers" ? "selected" : ""}
                                onClick={() => setContentToShow("followers")}
                            >
                                followers
                            </span>
                        </div>
                        <div className="profile-content">
                            {contentToShow === "posts" &&
                                (posts && posts.length > 0 ? (
                                    posts.map((post) => <PostDetail key={post._id} post={post} />)
                                ) : (
                                    <h2>Nothing posted</h2>
                                ))}
                            {contentToShow === "following" &&
                                (user && user.following.length > 0 ? (
                                    user.following.map((follower) => (
                                        <UserCard key={follower._id} account={follower} />
                                    ))
                                ) : (
                                    <p>follow more people</p>
                                ))}
                            {contentToShow === "followers" &&
                                (user && user.followers.length > 0 ? (
                                    user.followers.map((following) => (
                                        <UserCard
                                            key={following._id}
                                            account={following}
                                            isFollowersList={true}
                                        />
                                    ))
                                ) : (
                                    <div>No followers</div>
                                ))}
                        </div>
                    </main>
                </div>
            )}

            {!user && <Navigate to="/auth" />}
        </div>
    )
}

export default Profile
