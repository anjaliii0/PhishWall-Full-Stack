import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L3 6V11C3 15.4 6.4 19.5 11 20.9C15.6 19.5 19 15.4 19 11V6L11 2Z"
                stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(251,191,36,0.08)"/>
              <path d="M8 11L10 13L14 9" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="logo-text">Phish<span className="logo-accent">Wall</span></span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
            Home
          </NavLink>
          <NavLink to="/scan" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Scanner
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            About
          </NavLink>
        </nav>

        <NavLink to="/scan" className="header-cta">
          <span>Scan Now</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavLink>
      </div>
    </header>
  );
}