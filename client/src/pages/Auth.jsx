import { useState } from "react"
import { Link } from "react-router-dom"
import useAuthentication from "../hooks/useAuthentication"
// import { useNavigate } from "react-router-dom"

const Auth = () => {
    const [isSignupPage, setIsSignupPage] = useState(false)
    const [currentPage, setCurrentPage] = useState("signup")
    const [formData, setFormData] = useState({ name: "", email: "", password: "" })
    const { error, setError, msg, isLoading, auth, setMsg } = useAuthentication()

    const handlePage = (e) => {
        e.preventDefault()
        setError("")
        setMsg("")
        setIsSignupPage((prev) => !prev)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => {
            return { ...prevData, [name]: value }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = `/api/auth/${isSignupPage ? "signup" : "signin"}`
        const data = isSignupPage
            ? new FormData(e.target)
            : { email: formData.email, password: formData.password }

        await auth(data, url)
        setFormData({ name: "", email: "", password: "" })
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>{isSignupPage ? "Signup" : "Login"}</h3>

            {isSignupPage && (
                <>
                    <label htmlFor="name">Name : </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleChange}
                        required
                        value={formData.name}
                    />

                    <label htmlFor="photo">Profile picture</label>
                    <input type="file" name="photo" id="photo" />
                </>
            )}

            <label htmlFor="email">Email : </label>
            <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                required
                value={formData.email}
            />

            <label htmlFor="password">Password :</label>
            <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                required
                value={formData.password}
            />

            {error && <div className="error-message">{error}</div>}
            {msg && <div className="success-message">{msg}</div>}

            <button disabled={isLoading}>{isSignupPage ? "Signup" : "Login"}</button>
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Link href="" onClick={handlePage}>
                    {isSignupPage ? "Already Registered ?" : "New here?"}
                </Link>
                <Link to="/forget-password">Forget Passwod ? </Link>
            </div>
        </form>
    )
}

export default Auth
