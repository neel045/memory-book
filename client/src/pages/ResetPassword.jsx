import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ResetPassword = () => {
    const [isValidUrl, setIsValidUrl] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")

    const { userId, token } = useParams()

    useEffect(() => {
        const verifyToken = async () => {
            const res = await fetch(`/api/auth/${userId}/reset-password/${token}`)
            const json = await res.json()
            console.log(json)

            if (json.status) {
                setIsValidUrl(true)
                setMsg(json.message)
                setError("")
            } else {
                setIsValidUrl(false)
                setError(json.message)
                setMsg("")
            }
        }
        verifyToken()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMsg("")

        if (password.length < 8) {
            setError("password length must be more than 8")
            return
        }

        if (password != confirmPassword) {
            setError("Both passwords are not same")
            return
        }

        const res = await fetch(`/api/auth/${userId}/reset-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                password,
            }),
        })

        const json = await res.json()

        if (json.status) {
            setMsg(json.message)
            setIsValidUrl(false)
        } else {
            setError(json.message)
        }
    }
    return (
        <div className="reset-password-page">
            {isValidUrl ? (
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                    />

                    <button>Change Passowrd</button>

                    {error && <div className="error-message">{error}</div>}
                    {msg && <div className="success-message">{msg}</div>}
                </form>
            ) : (
                <h1>Invalid Link</h1>
            )}
        </div>
    )
}

export default ResetPassword
