import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Play, 
  Star, 
  Clock, 
  Film,
  Users,
  Eye,
  Plus,
  Loader2
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const Home = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies')
        // Check if data is an array or if it's wrapped in a status/data object
        setMovies(Array.isArray(data) ? data : data.data || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
        toast.error('Failed to load movies')
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const addToWatchlist = async (movieId) => {
    try {
      await api.post('/watchlist', { movieId, status: 'PLANNED' })
      toast.success('Added to watchlist!')
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to watchlist'
      toast.error(message)
    }
  }

  const stats = [
    { label: 'Total Movies', value: movies.length, icon: <Film size={20} />, trend: '+12%', color: '#6366f1' },
    { label: 'Featured Genres', value: '8', icon: <Star size={20} />, trend: '+5%', color: '#f59e0b' },
    { label: 'Minutes Watched', value: '18.4k', icon: <Clock size={20} />, trend: '+24%', color: '#22c55e' },
    { label: 'Community', value: '850', icon: <Users size={20} />, trend: '+8%', color: '#ec4899' },
  ]

  return (
    <div className="dashboard-home animate-slide-up">
      <div className="dashboard-welcome">
        <h1 className="h1">Dashboard <span>Overview</span></h1>
        <p className="text-secondary">Welcome back! Here's the latest from the movie database.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card glass-panel">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-details">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-trend">{stat.trend} this month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <section className="featured-widget glass-panel">
          <div className="widget-header">
            <h2 className="h2">Recently Added</h2>
          </div>
          
          {loading ? (
            <div className="empty-state">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : movies.length > 0 ? (
            <div className="movie-grid-mini">
              {movies.slice(0, 4).map(movie => (
                <div key={movie.id} className="mini-movie-card">
                  <div className="thumb-container">
                    <img src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80'} alt={movie.title} />
                    <button onClick={() => addToWatchlist(movie.id)} className="add-btn"><Plus size={16} /></button>
                  </div>
                  <div className="mini-info">
                    <p className="mini-title text-sm">{movie.title}</p>
                    <p className="mini-meta text-xs">{movie.genres?.[0] || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Film size={40} className="text-muted" />
              <p>No movies available yet.</p>
            </div>
          )}
        </section>

        <section className="activity-widget glass-panel">
          <div className="widget-header">
            <h2 className="h2">Quick Add</h2>
          </div>
          <p className="text-secondary text-sm mb-4">You can manually add movies to your database from the "Add Movie" portal.</p>
          <button className="btn-primary w-full">Go to Add Movie</button>
        </section>
      </div>
    </div>
  )
}

export default Home
