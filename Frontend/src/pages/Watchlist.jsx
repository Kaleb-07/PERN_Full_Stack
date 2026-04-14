import React, { useState, useEffect } from 'react'
import { 
  Bookmark, 
  Trash2, 
  Filter, 
  Search as SearchIcon,
  MoreVertical,
  Play,
  Loader2,
  Star as StarIcon
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const { data } = await api.get('/watchlist')
      setWatchlist(data.data || [])
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      toast.error('Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`)
      toast.success('Removed from watchlist')
      setWatchlist(watchlist.filter(item => item.id !== id))
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#22c55e'
      case 'WATCHING': return '#f59e0b'
      default: return '#6366f1'
    }
  }

  return (
    <div className="watchlist-dashboard animate-slide-up">
      <div className="page-header-flex">
        <div>
          <h1 className="h1">My <span>Watchlist</span></h1>
          <p className="text-secondary">Manage your saved movies and tracking status.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="watchlist-table-container glass-panel">
        <div className="table-header">
          <div className="search-box">
            <SearchIcon size={16} />
            <input type="text" placeholder="Search in watchlist..." />
          </div>
          <div className="table-tabs">
            <button className="tab active">All</button>
            <button className="tab">Watching</button>
            <button className="tab">Planned</button>
            <button className="tab">Completed</button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : watchlist.length > 0 ? (
          <table className="watchlist-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Date Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map(item => (
                <tr key={item.id}>
                  <td className="movie-cell">
                    <img 
                      src={item.movie?.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80'} 
                      alt={item.movie?.title} 
                      className="mini-poster" 
                    />
                    <div>
                      <p className="movie-title">{item.movie?.title}</p>
                      <p className="movie-genre">{item.movie?.genres?.[0] || 'Unknown'}</p>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill" style={{ backgroundColor: `${getStatusColor(item.status)}15`, color: getStatusColor(item.status) }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <StarIcon size={16} fill={item.rating ? '#fbbf24' : 'none'} color={item.rating ? '#fbbf24' : '#64748b'} />
                      <span>{item.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-btn-sm" title="Watch"><Play size={16} /></button>
                      <button className="icon-btn-sm" onClick={() => handleDelete(item.id)} title="Remove"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state p-20 text-center">
            <Bookmark size={48} className="text-muted mb-4 opacity-20" />
            <h3 className="h2">Watchlist is empty</h3>
            <p className="text-secondary">Start exploring movies to build your collection.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
