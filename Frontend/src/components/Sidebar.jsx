import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Bookmark, 
  Film, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  PlusSquare,
  Shield
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { logout, user } = useAuth()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'My Watchlist', icon: <Bookmark size={20} />, path: '/watchlist' },
    { name: 'Browse Movies', icon: <Search size={20} />, path: '/browse' },
    { name: 'Add Movie', icon: <PlusSquare size={20} />, path: '/add' },
  ]

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo">
          <Film className="logo-icon" size={28} />
          <span className="logo-text">Cine<span>Admin</span></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="nav-label">Main Menu</p>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin" 
              className={`nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              <Shield size={20} />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>

        <div className="nav-group">
          <p className="nav-label">General</p>
          <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={logout} className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-profile-mini">
            <div className="avatar">{user.name?.[0] || 'U'}</div>
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role === 'ADMIN' ? 'Admin' : 'Member'}</p>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="nav-item">
            <LogOut size={20} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
