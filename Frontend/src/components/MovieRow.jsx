import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ChevronRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../services/api'

/**
 * MovieRow — Reusable horizontal scroll movie row
 * Adapted from Netflix Clone Row.jsx, integrated with your backend data.
 *
 * Props:
 *  - title      : string  — Section heading (e.g. "Top Rated", "Action Movies")
 *  - emoji      : string  — Optional emoji icon next to title (e.g. "⭐", "🎬")
 *  - movies     : array   — Movie objects from your API
 *  - isLarge    : bool    — If true, cards use portrait tall aspect ratio
 *  - onWatchlist: fn      — Callback to add a movie to watchlist
 *  - browseLink : string  — Route for "Explore All" link (default: /browse)
 */
const MovieRow = ({
  title,
  emoji = '',
  movies: initialMovies = [],
  genre = '',
  isLarge = false,
  onWatchlist,
  browseLink = '/browse',
}) => {
  // Initialize with passed movies (mocks) so it's visible "for now"
  const [movies, setMovies] = React.useState(initialMovies)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // If we have a genre, fetch fresh data from backend
    if (genre) {
      const fetchGenreMovies = async () => {
        // Only show loader if we don't already have mock data to show
        if (movies.length === 0) setLoading(true)
        
        try {
          const res = await api.get(`/movies?genre=${genre}`)
          const data = Array.isArray(res.data) ? res.data : (res.data.data || [])
          
          // Only update if we actually got results back from DB
          if (data.length > 0) {
            setMovies(data)
          }
        } catch (error) {
          console.error(`Error fetching genre ${genre}:`, error)
        } finally {
          setLoading(false)
        }
      }
      fetchGenreMovies()
    }
  }, [genre]) 

  // Sync state if initialMovies changes from parent
  React.useEffect(() => {
    if (initialMovies && initialMovies.length > 0) {
      setMovies(initialMovies)
    }
  }, [initialMovies])

  if (loading && movies.length === 0) {
    return (
      <div className="movie-row-section py-8 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!movies || movies.length === 0) return null

  return (
    <motion.section
      className="movie-row-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="content-section-header mb-6">
        <h2 className="movie-row-title">
          {title} {emoji && <span className="row-emoji">{emoji}</span>}
        </h2>
        <Link to={browseLink} className="row-explore-link">
          Explore All <ChevronRight size={14} />
        </Link>
      </div>

      {/* Horizontal Scroll Track */}
      <div className={`movie-row-track no-scrollbar ${isLarge ? 'row-large' : 'row-small'}`}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`movie-row-card group ${isLarge ? 'card-large' : 'card-small'}`}
          >
            <Link to={`/movie/${movie.id}`} className="row-card-link">
              {/* Poster / Backdrop Image */}
              <img
                src={isLarge ? movie.posterUrl : (movie.backdropUrl || movie.posterUrl)}
                alt={movie.title}
                className="row-card-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x170?text=No+Image'
                }}
              />

              {/* Rating Badge (Top Left) */}
              <div className="row-rating-badge">
                <span className="row-rating-value">{movie.rating?.toFixed(1) || '4.8'}</span>
                <Star size={10} className="row-rating-star" />
              </div>

              {/* Heart Button (Top Right) */}
              {onWatchlist && (
                <button
                  className="row-heart-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    onWatchlist(movie.id)
                  }}
                >
                  <Heart size={14} strokeWidth={2} />
                </button>
              )}

              {/* Info Overlay (Bottom) */}
              <div className="row-card-overlay">
                <div className="row-overlay-gradient" />
                <div className="row-card-info custom-transform-hover">
                  <h4 className="row-card-title">{movie.title}</h4>
                  <p className="row-card-genres">
                    {movie.genres?.slice(0, 2).join(', ') || movie.releaseYear}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default MovieRow
