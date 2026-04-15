import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  Film,
  Calendar,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'

const BrowseMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/movies', {
        params: { search, genre }
      })
      setMovies(data.data || [])
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies()
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [search, genre])

  const addToWatchlist = async (movieId) => {
    try {
      await api.post('/watchlist', { movieId, status: 'PLANNED' })
      toast.success('Added to watchlist!')
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to watchlist'
      toast.error(message)
    }
  }

  return (
    <div className="browse-movies-container animate-slide-up">
      <div className="dashboard-welcome">
        <h1 className="h1">Browse <span>Movies</span></h1>
        <p className="text-secondary">Explore our extensive library and find your next favorite film.</p>
      </div>

      <div className="filter-bar glass-panel mb-8">
        <div className="search-input-wrapper">
          <Search size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-input-wrapper">
          <Filter size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder="Filter by genre..." 
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : movies.length > 0 ? (
        <div className="movie-grid-main">
          {movies.map((movie, index) => (
            <motion.div 
              key={movie.id} 
              className="movie-card-detailed glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="movie-poster-wrapper">
                <img 
                  src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80'} 
                  alt={movie.title} 
                />
                <button 
                  onClick={() => addToWatchlist(movie.id)} 
                  className="add-to-watchlist-btn"
                  title="Add to Watchlist"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="movie-card-content">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta-tags">
                  <span className="meta-tag">
                    <Calendar size={14} /> {movie.releaseYear}
                  </span>
                  {movie.runtime && (
                    <span className="meta-tag">
                      <Clock size={14} /> {movie.runtime} min
                    </span>
                  )}
                </div>
                <div className="movie-genres-list">
                  {movie.genres.map(g => (
                    <span key={g} className="genre-pill">{g}</span>
                  ))}
                </div>
                <p className="movie-overview-short">
                  {movie.overview || 'No overview available for this title.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="empty-state py-20">
          <Film size={64} className="text-muted mb-4" />
          <h2 className="h2">No movies found</h2>
          <p className="text-secondary">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}

export default BrowseMovies
