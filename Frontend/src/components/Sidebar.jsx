import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  LayoutGrid,
  User,
  Bell,
  Calendar,
  MessageSquare,
  Search,
  Settings,
  LogOut,
  Film,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: 'Home', icon: <Home size={22} />, path: '/' },
    { name: 'Browse', icon: <LayoutGrid size={22} />, path: '/browse' },
    { name: 'Profile', icon: <User size={22} />, path: '/profile' },
    { name: 'Special', icon: <Zap size={22} />, path: '/special', hasDot: true },
    { name: 'Alerts', icon: <Bell size={22} />, path: '/alerts' },
    { name: 'Schedule', icon: <Calendar size={22} />, path: '/schedule' },
    { name: 'Chat', icon: <MessageSquare size={22} />, path: '/chat' },
  ]

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Film className="logo-icon-adaptive" size={28} />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="logo-text-adaptive ml-3"
            >
              Fil<span>Screen</span>
            </motion.span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="liquid-segment">
          <div className="nav-main">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                title={isCollapsed ? item.name : ''}
              >
                <div className="icon-wrapper">
                  {item.icon}
                  {item.hasDot && <span className="status-dot"></span>}
                </div>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="nav-label"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            ))}
          </div>

          <div className="nav-footer">
            <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`} title="Settings">
               <div className="icon-wrapper"><Settings size={22} /></div>
               {!isCollapsed && <span className="nav-label">Settings</span>}
            </Link>
            
            <button onClick={logout} className="nav-item logout-btn" title="Logout">
              <div className="icon-wrapper"><LogOut size={22} /></div>
              {!isCollapsed && <span className="nav-label">Logout</span>}
            </button>
          </div>
        </div>
      </nav>

    </aside>
  )
}



export default Sidebar




