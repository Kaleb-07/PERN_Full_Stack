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
  Loader2,
  BookmarkCheck,
  Award
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, watchlistRes] = await Promise.all([
          api.get('/movies'),
          api.get('/watchlist')
        ])
        
        setMovies(Array.isArray(moviesRes.data) ? moviesRes.data : moviesRes.data.data || [])
        setWatchlist(Array.isArray(watchlistRes.data) ? watchlistRes.data : watchlistRes.data.data || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const addToWatchlist = async (movieId) => {
    try {
      await api.post('/watchlist', { movieId, status: 'PLANNED' })
      toast.success('Added to watchlist!')
      // Refresh watchlist
      const { data } = await api.get('/watchlist')
      setWatchlist(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to watchlist'
      toast.error(message)
    }
  }

  const completedCount = watchlist.filter(item => item.status === 'COMPLETED').length
  const avgRating = watchlist.filter(item => item.rating).reduce((acc, curr, index, arr) => acc + curr.rating / arr.length, 0).toFixed(1)

  const stats = [
    { label: 'Your Watchlist', value: watchlist.length, icon: <BookmarkCheck size={20} />, trend: 'Active', color: '#6366f1' },
    { label: 'Completed', value: completedCount, icon: <Play size={20} />, trend: 'Finished', color: '#22c55e' },
    { label: 'Avg Rating', value: avgRating > 0 ? avgRating : 'N/A', icon: <Award size={20} />, trend: 'Points', color: '#f59e0b' },
    { label: 'Total Catalog', value: movies.length, icon: <Film size={20} />, trend: 'Movies', color: '#ec4899' },
  ]

  return (
    <div className="dashboard-home animate-slide-up">
      <div className="dashboard-welcome">
        <h1 className="h1">Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span></h1>
        <p className="text-secondary">Here is what's happening with your movie collection today.</p>
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

        {user?.role === 'ADMIN' && (
          <section className="activity-widget glass-panel">
            <div className="widget-header">
              <h2 className="h2">Quick Add</h2>
            </div>
            <p className="text-secondary text-sm mb-4">You can manually add movies to your database from the "Add Movie" portal.</p>
            <button className="btn-primary w-full" onClick={() => navigate('/add')}>Go to Add Movie</button>
          </section>
        )}
      </div>
    </div>
  )
}

export default Home
