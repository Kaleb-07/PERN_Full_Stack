import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  MessageSquare, 
  Trash2, 
  Send,
  Loader2,
  Bookmark,
  Clapperboard,
  History,
  TrendingUp,
  Film
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './MovieDetails.css'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToWatchlist: addToGlobalWatchlist } = useWatchlist()
  
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [rating, setRating] = useState(8)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, reviewsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/reviews/movie/${id}`)
        ])
        setMovie(movieRes.data.data)
        setReviews(reviewsRes.data.data.reviews)
      } catch (error) {
        toast.error('Failed to load movie details')
        navigate('/browse')
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }
    fetchData()
  }, [id, navigate])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('You must be logged in to review')
    
    setSubmitting(true)
    try {
      await api.post('/reviews', {
        movieId: id,
        rating,
        comment
      })
      
      toast.success('Review posted successfully!')
      setComment('')
      const reviewsRes = await api.get(`/reviews/movie/${id}`)
      setReviews(reviewsRes.data.data.reviews)
    } catch (error) {
      toast.error('Failed to post review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`)
      toast.success('Review removed')
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 w-full h-full">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="mt-8 text-secondary font-bold tracking-widest uppercase text-xs">Loading details...</p>
    </div>
  )

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '8.4'

  const scheduleWatch = async () => {
    const scheduledTime = prompt('Enter watch time (YYYY-MM-DD HH:MM):', new Date().toISOString().slice(0, 16).replace('T', ' '))
    if (!scheduledTime) return

    try {
      await api.post('/schedule', { 
        movieId: id, 
        scheduledAt: new Date(scheduledTime).toISOString() 
      })
      toast.success('Movie scheduled successfully!')
    } catch (error) {
      toast.error('Failed to schedule movie')
    }
  }

  const addToWatchlist = async () => {
    try {
      await addToGlobalWatchlist(id)
    } catch (error) {
      // toast is already handled in context
    }
  }

  const watchTrailer = () => {
    if (movie?.trailerUrl) {
      window.open(movie.trailerUrl, '_blank')
    } else {
      toast.error('Trailer not available for this movie')
    }
  }

  return (
    <div className="movie-details-page animate-fade-in shadow-inner">
      <div className="details-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ChevronLeft size={18} /> Back
        </button>
      </div>

      <motion.div 
        className="profile-hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="profile-poster" variants={itemVariants}>
          <img 
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800'} 
            alt={movie.title} 
          />
        </motion.div>
        
        <div className="profile-info">
          <motion.div variants={itemVariants}>
            <h1 className="profile-title">{movie.title}</h1>
            
            <div className="profile-meta-row">
              <div className="meta-chip rating-chip">
                <Star size={16} fill="currentColor" />
                <span>{averageRating} Rating</span>
              </div>
              <div className="meta-chip">
                <Calendar size={16} />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="meta-chip">
                <Clock size={16} />
                <span>{movie.runtime || '124'} Min</span>
              </div>
              <div className="meta-chip">
                <Film size={16} />
                <span>{movie.genres?.[0] || 'Drama'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="profile-actions" variants={itemVariants}>
            <button onClick={addToWatchlist} className="btn-primary">
              <Bookmark size={18} fill="none" /> Add to Watchlist
            </button>
            <button onClick={scheduleWatch} className="btn-secondary">
              <Clock size={18} /> Schedule Watch
            </button>
            <button onClick={watchTrailer} className="btn-secondary">
              <Clapperboard size={18} /> Watch Trailer
            </button>
          </motion.div>

          <motion.div className="synopsis-block" variants={itemVariants}>
            <h3>Synopsis</h3>
            <p>{movie.overview || 'An extraordinary journey unfolds in this captivating film. Join the characters as they explore new worlds and overcome incredible challenges in this must-watch cinema experience.'}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* 💬 COMMUNITY STAGE */}
      <div className="community-grid">
        {/* REVIEWS COLUMN */}
        <div>
          <div className="reviews-header">
            <div className="reviews-icon-box">
               <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              <p className="text-sm text-gray-500 font-semibold">{reviews.length} total reviews</p>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {reviews.length === 0 ? (
                <motion.div 
                  className="review-card flex flex-col items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <History size={48} className="mb-4 text-gray-300" />
                  <p className="text-center font-bold text-gray-500">No reviews yet.<br/>Be the first to share your thoughts!</p>
                </motion.div>
              ) : (
                reviews.map((review, index) => (
                  <motion.div 
                    key={review.id} 
                    className="review-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="reviewer-avatar">
                          {review.user?.name?.[0]}
                        </div>
                        <div className="review-meta">
                          <h4>{review.user?.name}</h4>
                          <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="review-score-badge">
                          <Star size={14} fill="currentColor" /> {review.rating}/10
                        </div>
                        {(user?.id === review.user?.id || user?.role === 'ADMIN') && (
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[1.05rem] text-gray-700 leading-relaxed font-medium">"{review.comment}"</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RATING FORM COLUMN */}
        <div className="relative">
          <motion.div 
            className="rating-form-container"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="form-title">
              <TrendingUp className="text-primary" size={24} />
              Write a Review
            </h3>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-600">Your Rating</span>
                  <span className="text-xl font-black text-primary">{rating}<span className="text-xs text-gray-400 ml-1">/10</span></span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="clean-slider"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 mb-3">Your Thoughts</label>
                <textarea 
                  className="clean-textarea"
                  placeholder="What did you think of the movie?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full justify-center"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Post Review</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
