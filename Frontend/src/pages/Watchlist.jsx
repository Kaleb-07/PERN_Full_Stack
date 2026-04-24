import React, { useState, useEffect } from 'react'
import { 
  Bookmark, 
  Trash2, 
  Filter, 
  Search as SearchIcon,
  Play,
  Loader2,
  Star as StarIcon,
  Sparkles,
  Clapperboard,
  Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWatchlist } from '../context/WatchlistContext'
import { Link } from 'react-router-dom'
import './Watchlist.css'

const Watchlist = () => {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWatchlist = watchlist.filter(item => 
    item.movie?.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="watchlist-gallery-page">
      
      {/* Header Section */}
      <header className="watchlist-hero-header">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="watchlist-title-group"
        >
          <div className="watchlist-badge-premium">
            <Sparkles size={14} />
            <span>Premium Collection</span>
          </div>
          <h1>My <span>Watchlist</span></h1>
          <p>Your curated universe of cinematic experiences.</p>
        </motion.div>

        <div className="watchlist-controls">
          <div className="search-glass-wrapper">
            <input 
              type="text" 
              placeholder="Search your collection..." 
              className="search-glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="search-glass-icon" size={20} />
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="watchlist-content">
        {loading ? (
          <div className="luxury-loader-container">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        ) : filteredWatchlist.length > 0 ? (
          <motion.div 
            className="elite-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredWatchlist.map(item => (
                <motion.div 
                  key={item.id} 
                  className="elite-movie-card"
                  variants={itemVariants}
                  layout
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <div className="elite-card-poster-wrapper">
                    <Link to={`/movie/${item.movieId}`}>
                      <img 
                        src={item.movie?.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80'} 
                        alt={item.movie?.title} 
                        className="elite-card-poster"
                      />
                    </Link>
                    
                    <div className="elite-card-rating">
                      <StarIcon size={14} fill="currentColor" />
                      <span>{item.movie?.rating?.toFixed(1) || '4.8'}</span>
                    </div>

                    <button 
                      onClick={() => removeFromWatchlist(item.id)}
                      className="elite-card-wishlist active"
                      title="Remove from favorites"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="elite-card-overlay">
                      <h4 className="elite-card-title">{item.movie?.title}</h4>
                      <div className="elite-card-meta">
                        <span className="elite-card-genre">{item.movie?.genres?.[0] || 'Drama'}</span>
                        <span>{item.movie?.releaseYear || '2024'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="watchlist-empty-state"
          >
            <div className="empty-glow-icon">
              <Bookmark size={64} className="opacity-20" />
            </div>
            <h3>Your collection is empty</h3>
            <p>Start exploring and add movies to your premium watchlist.</p>
            <Link to="/browse" className="hero-watch-btn mt-8">
              Explore Movies
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
