import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AuthContectProvider } from "./contexts/AuthContext"
import { PostContextProvider } from "./contexts/PostContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthContectProvider>
            <PostContextProvider>
                <App />
            </PostContextProvider>
        </AuthContectProvider>
    </React.StrictMode>
)
