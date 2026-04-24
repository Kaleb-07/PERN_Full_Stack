import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import Auth from './pages/Auth'
import Settings from './pages/Settings'
import MovieDetails from './pages/MovieDetails'
import BrowseMovies from './pages/BrowseMovies'
import AddMovie from './pages/AddMovie'
import AdminDashboard from './pages/AdminDashboard'
import Schedule from './pages/Schedule'
import Chat from './pages/Chat'
import AdminRoute from './components/AdminRoute'
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
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/browse" element={<BrowseMovies />} />
                <Route path="/add" element={<AdminRoute><AddMovie /></AdminRoute>} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
