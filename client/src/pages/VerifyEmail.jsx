import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import successMark from "../assets/success-green-check-mark-icon.svg"

const VerifyEmail = () => {
    const [isValidUrl, setIsValidUrl] = useState(false)

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

    return (
        <div
            className="verify-email-page"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "80vh",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isValidUrl ? (
                <img src={successMark} style={{ height: "200px" }} />
            ) : (
                <h1>Invalid Link</h1>
            )}

            {error && <div className="error-message">{error}</div>}
            {msg && <div className="success-message">{msg}</div>}
        </div>
    )
}

export default VerifyEmail
