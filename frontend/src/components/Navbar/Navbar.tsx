import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

export default function Navbar () {
    const location = useLocation()

    let buttonText = ''
    let nextRoute = ''

    if (location.pathname === '/') {
        buttonText = 'WEBCAM'
        nextRoute = '/webcam'
    } else {
        buttonText = 'COUNTER'
        nextRoute = '/'
    }
    return (
        <nav className="navbar">
            <Link to={nextRoute} className="nav-button">{buttonText}</Link>
        </nav>
    )
}