import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
