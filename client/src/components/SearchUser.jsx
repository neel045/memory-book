import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"
import UserCard from "./UserCard"

const SearchUser = () => {
    const { user, token } = useAuthContext()

    const [name, setName] = useState("")
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")

    const handleSearch = async (e) => {
        setError("")
        e.preventDefault()
        if (name === "") {
            return
        }

        const res = await fetch(`/api/users/search-user?name=${name.trim()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const json = await res.json()
        if (!json.status) {
            setError(json.message)
        } else {
            setError("")
            setUsers(json.data.users)
        }
        console.log(json.data.users)
        setName("")
    }
    return (
        <div className="search-card">
            <form className="search-form" onSubmit={handleSearch}>
                <h3>Find Your friends</h3>
                <input
                    type="text"
                    className="search-box"
                    placeholder="search"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                {error && <div className="error-message">{error}</div>}
                <button>Search</button>
            </form>

            {users && users.length > 0
                ? users.map((account) => {
                      if (account._id != user._id) {
                          return <UserCard key={account._id} account={account} />
                      }
                  })
                : ""}
        </div>
    )
}

export default SearchUser
