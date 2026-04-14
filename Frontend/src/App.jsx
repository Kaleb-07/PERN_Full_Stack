import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import Auth from './pages/Auth'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2024 CineWave. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
