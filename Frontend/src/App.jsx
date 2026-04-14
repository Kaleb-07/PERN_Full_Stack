import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import Auth from './pages/Auth'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/*" 
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
