import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Film, Home, Bookmark, User } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <Film className="logo-icon" size={32} />
        <span className="logo-text">Cine<span>Wave</span></span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <Home size={20} />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/watchlist" className={isActive('/watchlist') ? 'active' : ''}>
            <Bookmark size={20} />
            <span>Watchlist</span>
          </Link>
        </li>
        <li>
          <Link to="/auth" className={isActive('/auth') ? 'active' : ''}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
