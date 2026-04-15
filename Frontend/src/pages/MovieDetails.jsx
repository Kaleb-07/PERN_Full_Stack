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
  Bookmark
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [rating, setRating] = useState(10)
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
        setLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('You must be logged in to review')
    
    setSubmitting(true)
    try {
      const { data } = await api.post('/reviews', {
        movieId: id,
        rating,
        comment
      })
      
      toast.success('Review posted!')
      setComment('')
      // Refresh reviews
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
      toast.success('Review deleted')
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const addToWatchlist = async () => {
    try {
      await api.post('/watchlist', { movieId: id, status: 'PLANNED' })
      toast.success('Added to watchlist!')
    } catch (error) {
      toast.error('Already in watchlist')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  )

  return (
    <div className="movie-details-page animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-back mb-8 flex items-center gap-2 text-secondary hover:text-white transition-colors">
        <ChevronLeft size={20} /> Back to Browse
      </button>

      {/* Hero Section */}
      <div className="movie-hero glass-panel p-8 mb-12 flex flex-col md:flex-row gap-8">
        <div className="hero-poster flex-shrink-0">
          <img 
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80'} 
            alt={movie.title} 
            className="rounded-xl shadow-2xl w-full md:w-64 aspect-[2/3] object-cover"
          />
        </div>
        
        <div className="hero-content flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="h1 mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map(genre => (
                  <span key={genre} className="badge bg-white bg-opacity-10 px-3 py-1 rounded-full text-xs font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={addToWatchlist} className="btn-secondary flex items-center gap-2">
              <Bookmark size={18} /> Add to Watchlist
            </button>
          </div>

          <div className="flex gap-6 mb-8 text-secondary text-sm">
            <span className="flex items-center gap-2"><Calendar size={18} /> {movie.releaseYear}</span>
            <span className="flex items-center gap-2"><Clock size={18} /> {movie.runtime || 'N/A'} min</span>
            <span className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" /> 
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'No Ratings'}
            </span>
          </div>

          <div className="synopsis mb-8">
            <h3 className="text-white font-semibold mb-2">Synopsis</h3>
            <p className="text-secondary leading-relaxed">{movie.overview || 'No synopsis available for this film.'}</p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="movie-community grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="h2 mb-6 flex items-center gap-3">
            <MessageSquare className="text-primary" size={24} />
            Community Reviews
          </h2>

          <div className="reviews-list space-y-4">
            {reviews.length === 0 ? (
              <div className="glass-panel p-8 text-center text-secondary italic">
                No reviews yet. Be the first to share your thoughts!
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card glass-panel p-6 animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                        {review.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{review.user?.name}</p>
                        <p className="text-xs text-secondary">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500 bg-opacity-10 px-2 py-1 rounded">
                        <Star size={14} className="fill-yellow-500" /> {review.rating}
                      </div>
                      {(user?.id === review.user?.id || user?.role === 'ADMIN') && (
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-secondary leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="review-form-container">
          <div className="glass-panel p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Rate this Movie</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6">
                <label className="block text-sm text-secondary mb-3">Score (1-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={rating} 
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="flex-grow accent-primary cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-primary w-8">{rating}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-secondary mb-2">Your Review</label>
                <textarea 
                  className="form-input w-full min-h-[120px] resize-none"
                  placeholder="What did you think of the story, acting, and visuals?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Post Review</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
