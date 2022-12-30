import { useState } from "react"

const ForgetPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMsg("")

        const res = await fetch("/api/auth/forget-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ email }),
        })

        const json = await res.json()

        if (json.status) {
            setMsg(json.message)
        } else {
            setError(json.message)
        }

        console.log(json)
    }

    return (
        <div className="forget-password-page">
            <form onSubmit={handleSubmit} className="forget-password-form">
                <h3>Enter Your Registered email Address</h3>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    required
                />
                <button>Submit</button>
                {error && <div className="error-message">{error}</div>}
                {msg && <div className="success-message">{msg}</div>}
            </form>
        </div>
    )
}

export default ForgetPassword
