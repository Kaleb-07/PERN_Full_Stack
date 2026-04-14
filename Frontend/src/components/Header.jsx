import React from 'react'
import { Bell, Search, User, ChevronDown } from 'lucide-react'

const Header = () => {
  return (
    <header className="header glass-panel">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search movies, genres, actors..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-menu-trigger">
          <div className="user-avatar">JD</div>
          <div className="user-details">
            <p className="user-name">John Doe</p>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
