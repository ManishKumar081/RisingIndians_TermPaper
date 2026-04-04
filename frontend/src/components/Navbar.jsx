import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-dot" />
        NewsVerify
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
            About
          </Link>
        </li>
        
        {/* <li>
          <a
            href="http://localhost:5000/health"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            API
          </a>
        </li> */}
      </ul>
    </nav>
  );
}