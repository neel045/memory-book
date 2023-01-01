import navLogo from "../assets/memory-book-logo.jpg"
import { Link } from "react-router-dom"
import "./Navbar.css"
import useAuthContext from "../hooks/useAuthContext"
import useLogout from "../hooks/useLogout"

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = (e) => {
        e.preventDefault()
        logout()
    }
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <img src={navLogo} id="nav-logo" />
                    <strong>MemoryBook</strong>
                </Link>

                <nav>
                    {user ? (
                        <div style={{ display: "flex" }}>
                            <Link to="/profile" style={{ paddingRight: "10px" }}>
                                <img
                                    src={`img/users/${user.photo}`}
                                    alt=""
                                    className="user-photo"
                                />
                                <p>{user.name}</p>
                            </Link>
                            <Link>
                                <button onClick={handleLogout}> Logout</button>
                            </Link>
                        </div>
                    ) : (
                        <Link to="/auth">Login/Signup</Link>
                    )}
                    <div></div>
                </nav>
            </div>
        </header>
    )
}
export default Navbar
