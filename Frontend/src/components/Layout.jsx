import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-container">
        <main className={`main-content ${!isHome ? 'page-content' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
