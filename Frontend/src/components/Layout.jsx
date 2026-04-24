import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const Layout = ({ children }) => {
  const location = useLocation()
  const isAuth = location.pathname === '/auth'

  if (isAuth) return <>{children}</>

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-container">
        <main className="main-content">
          {children}
        </main>
      </div>
      <RightSidebar />
    </div>
  )
}

export default Layout
