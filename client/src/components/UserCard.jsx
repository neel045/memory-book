import useAuthContext from "../hooks/useAuthContext"

const UserCard = ({ account, isFollowersList }) => {
    console.log(account)
    const { user, token, dispatch } = useAuthContext()
    const isUserFollowing = user.following.some((following) => following._id === account._id)

    const handleFollowUnfollow = async () => {
        if (user) {
            const res = await fetch(`/api/users/follow-unfollow/${account._id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const json = await res.json()

            if (!json.status) {
                return
            }

            if (json.status) {
                const { user } = json.data
                localStorage.setItem("user", JSON.stringify(user))
                dispatch({ type: "LOGIN", payload: { user } })
            }
        }
    }

    return (
        <div className="user-card">
            <img src={`img/users/${account.photo}`} alt="" className="user-img" />
            <p>{account.name}</p>
            <button onClick={handleFollowUnfollow}>
                {isUserFollowing ? "Unfollow" : "follow"}
            </button>
        </div>
    )
}

export default UserCard
