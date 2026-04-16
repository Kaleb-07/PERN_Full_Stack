import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  Bookmark, 
  Star, 
  Heart,
  Clapperboard,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'

const BrowseMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance', 'Animation', 'Documentary']

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/movies', {
        params: { search: searchTerm, genre: selectedGenre }
      })
      setMovies(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      toast.error('Failed to load movies')
    } finally {
      // Small delay for smooth transition feel
      setTimeout(() => setLoading(false), 400)
    }
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    fetchMovies()
  }

  const addToWatchlist = async (movieId) => {
    try {
      await api.post('/watchlist', { movieId, status: 'PLANNED' })
      toast.success('Added to watchlist!')
    } catch (error) {
      toast.error('Failed to add to watchlist')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <div className="browse-movies-page">
      {/* ELITE ENHANCED HEADER */}
      <motion.div 
        className="browse-header-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="browse-title-group">
          <div className="browse-results-tag">
            <Sparkles size={14} className="animate-pulse" />
            {loading ? 'Searching...' : `${movies.length} Cinema Gems Found`}
          </div>
          <h1>Browse <span>Universe</span></h1>
        </div>
        
        <div className="browse-controls">
          <form onSubmit={handleSearch} className="search-glass-wrapper">
            <input 
              type="text" 
              placeholder="Search movie titles..." 
              className="search-glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-glass-icon" size={20} />
          </form>

          <div className="relative">
            <select 
              className="genre-glass-select"
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                // Trigger fetch immediately on genre change for "Liquid" feel
                setTimeout(() => fetchMovies(), 0);
              }}
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* CONTENT AREA */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            className="flex flex-col items-center justify-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={64} strokeWidth={1} />
              <Clapperboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200" size={24} />
            </div>
            <p className="mt-6 text-secondary font-bold tracking-widest uppercase text-xs">Curating your experience...</p>
          </motion.div>
        ) : movies.length > 0 ? (
          <motion.div 
            key="grid"
            className="elite-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {movies.map(movie => (
              <motion.div 
                key={movie.id} 
                className="elite-movie-card"
                variants={itemVariants}
              >
                <div className="elite-card-poster-wrapper">
                  <Link to={`/movie/${movie.id}`}>
                    <img 
                      src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80'} 
                      alt={movie.title} 
                      className="elite-card-poster"
                    />
                  </Link>
                  
                  {/* Floating Rating HUD */}
                  <div className="elite-card-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{movie.rating?.toFixed(1) || '4.8'}</span>
                  </div>

                  {/* Floating Heart Action */}
                  <button 
                    onClick={() => addToWatchlist(movie.id)}
                    className="elite-card-wishlist"
                    title="Add to Watchlist"
                  >
                    <Heart size={20} fill="none" strokeWidth={2.5} />
                  </button>

                  <Link to={`/movie/${movie.id}`} className="elite-card-overlay">
                    <h3 className="elite-card-title">{movie.title}</h3>
                    <div className="elite-card-meta">
                      <span>{movie.releaseYear}</span>
                      <span className="elite-card-genre">{movie.genres?.[0] || 'Drama'}</span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            className="flex flex-col items-center justify-center py-32 glass-panel border-dashed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <Search size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Movies Found</h2>
            <p className="text-secondary max-w-xs text-center">We couldn't find any results for your search. Try adjusting your filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedGenre(''); fetchMovies(); }}
              className="mt-8 btn-primary"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BrowseMovies
