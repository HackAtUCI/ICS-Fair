import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  bags: number;
}

export default function Navbar({ bags }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  let buttonText = "";
  let nextRoute = "";

  if (location.pathname === "/") {
    buttonText = "WEBCAM";
    nextRoute = "/webcam";
  } else {
    buttonText = "COUNTER";
    nextRoute = "/";
  }

  const handleNavigation = () => {
    navigate(nextRoute, { state: { bags } });
  };

  return (
    <nav className="navbar">
      <button onClick={handleNavigation} className="nav-button">
        {buttonText}
      </button>
    </nav>
  );
}
