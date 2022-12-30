import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import useAuthContext from "./hooks/useAuthContext"
import Auth from "./pages/Auth"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import VerifyEmail from "./pages/VerifyEmail"

function App() {
    const { user } = useAuthContext()
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        exact
                        path="/profile"
                        // element={!user ? <Navigate to="/auth" /> : <Profile />}
                        element={<Profile />}
                    />
                    <Route exact path="/" element={!user ? <Navigate to="/auth" /> : <Home />} />
                    <Route exact path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
                    <Route exact path="/forget-password" element={<ForgetPassword />} />
                    <Route
                        exact
                        path="/auth/:userId/reset-password/:token"
                        element={<ResetPassword />}
                    />
                    <Route
                        exact
                        path="/auth/:userId/verify-email/:token"
                        element={<VerifyEmail />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
