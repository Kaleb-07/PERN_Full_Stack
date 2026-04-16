import React, { useState, useEffect } from 'react'
import {
  Play,
  Plus,
  Loader2,
  Search,
  Star,
  ChevronRight,
  Info,
  Layers,
  Users,
  Film,
  Heart,
  Activity
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('New')

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
      const { data } = await api.get('/watchlist')
      setWatchlist(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center p-20 w-full h-full">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  )

  // Find the explicitly featured movie, or fallback to the most recent one
  const featuredMovie = movies.find(m => m.isFeatured) || movies[0] || {
    title: 'Featured Cinema',
    overview: 'Discover the latest releases and curated collections.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    genres: ['Featured'],
    rating: 0
  }

  const tabs = ['New', 'Series', 'Movies', 'TV shows']

  return (
    <div className="dashboard-home animate-fade-in shadow-inner">
      {/* --- MAIN FEED --- */}
      <div className="home-feed py-10 px-12">

        {/* Luxury Top-Centered Header Navigation */}
        <header className="home-header">
          <div className="filter-tabs-container">
            <div className="filter-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="active-pill-background"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="tab-label">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </header>


        {/* Cinematic Hero Banner v4 */}
        <section className="hero-banner">
          <img
            src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
            className="hero-image"
            alt="Hero"
          />
          <div className="hero-overlay">
            {/* Top Row: Tags & Rating */}
            <div className="hero-top-row">
              <div className="hero-tags">
                {featuredMovie.genres?.slice(0, 2).map(g => (
                  <span key={g} className="hero-tag-pill">{g}</span>
                ))}
                {(!featuredMovie.genres || featuredMovie.genres.length === 0) && (
                  <>
                    <span className="hero-tag-pill">Science fiction</span>
                    <span className="hero-tag-pill">Adventure</span>
                  </>
                )}
              </div>
              <div className="hero-rating-badge">
                <span className="font-bold">4.8</span>
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>
            </div>

            {/* Middle/Bottom: Info & Actions */}
            <div className="hero-bottom-area">
              <div className="hero-content">
                <h1 className="hero-title">{featuredMovie.title}</h1>
                <p className="hero-description">
                  {featuredMovie.overview}
                </p>
                <div className="hero-actions">
                  <Link to={`/movie/${featuredMovie.id}`} className="hero-watch-btn">
                    <Play size={20} fill="currentColor" /> Watch
                  </Link>
                  <button onClick={() => addToWatchlist(featuredMovie.id)} className="hero-fav-btn">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Social Proof Indicator */}
              <div className="friends-watching-indicator">
                <div className="friend-avatars">
                  {[11, 12, 13].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="avatar-pill" alt="" />
                  ))}
                  <div className="avatar-plus-pill">+3</div>
                </div>
                <div className="friends-text">
                  <p className="main-text">Friends are</p>
                  <p className="sub-text">watching</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section>
          <div className="content-section-header mb-8">
            <h2 className="text-2xl font-black">Trending now 🔥</h2>
            <Link to="/browse" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">Explore All <ChevronRight size={14} /></Link>
          </div>
          <div className="carousel-container no-scrollbar p-1 gap-6 my-6">
            {movies.slice(1, 7).map(movie => (
              <div key={movie.id} className="movie-card-squircle group">
                <Link to={`/movie/${movie.id}`} className="relative block w-full h-full">
                  <img src={movie.posterUrl} alt={movie.title} className="card-thumb" />

                  {/* Glassmorphism Badges (Top) */}
                  <div className="card-top-row">
                    <div className="card-rating-pill">
                      <span className="rating-value">{movie.rating?.toFixed(1) || '4.8'}</span>
                      <Star size={12} className="rating-star" />
                    </div>
                    <button 
                      className="card-heart-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        addToWatchlist(movie.id);
                      }}
                    >
                      <Heart size={16} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Content Overlay (Bottom) */}
                  <div className="card-content-overlay">
                    <div className="overlay-gradient"></div>
                    <div className="card-text-content custom-transform-hover">
                      <h4 className="card-title">{movie.title}</h4>
                      <p className="card-genres">
                        {movie.genres?.slice(0, 2).join(', ') || 'Action, Thriller'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <aside className="activity-right-panel glass-panel">

        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entertainment..."
            className="form-input-modern pl-14 py-4"
          />
        </div>

        {/* Continue Watching */}
        <div>
          <h3 className="section-title-alt mb-6 flex items-center gap-2">
            <Activity size={18} className="text-primary" /> Continue watching
          </h3>
          <div className="flex flex-col gap-5">
            {watchlist.slice(0, 3).map(item => (
              <div key={item.id} className="continue-watching-card group" onClick={() => navigate(`/movie/${item.movieId}`)}>
                <div className="thumbnail-box shadow-lg">
                  <img src={item.movie?.posterUrl} alt="" className="transition-transform group-hover:scale-110" />
                  <div className="play-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={28} fill="white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-black truncate pr-4 text-gray-800">{item.movie?.title}</h4>
                  <p className="text-[11px] text-gray-400 font-bold mb-2">{item.movie?.genres?.[0]}</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-primary h-full w-2/3 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Activity */}
        <div>
          <h3 className="section-title-alt mb-6">Friends activity</h3>
          <div className="flex flex-col gap-8">
            <div className="friend-item">
              <div className="relative">
                <img src="https://i.pravatar.cc/100?img=12" className="friend-avatar w-14 h-14" alt="" />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-white">
                  <div className="live-dot" style={{ margin: 0 }}></div>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-800">James Banistor</h4>
                <p className="text-[11px] text-gray-500 mt-1">Watching <span className="font-black text-gray-800">Stranger Things</span></p>
              </div>
            </div>
            <div className="friend-item">
              <div className="relative">
                <img src="https://i.pravatar.cc/100?img=44" className="friend-avatar w-14 h-14" alt="" />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-white">
                  <div className="live-dot" style={{ margin: 0 }}></div>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-800">Jenna Barbera</h4>
                <p className="text-[11px] text-gray-500 mt-1">Watching <span className="font-black text-gray-800">Interstellar</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Upgrade Card */}
        <div className="mt-auto p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
          <h4 className="text-lg font-black mb-2">Upgrade to PRO</h4>
          <p className="text-xs opacity-70 mb-6 font-medium">Get 4K quality, offline mode and early access.</p>
          <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black text-xs hover:shadow-glow transition-all">Go Premium</button>
        </div>

      </aside>
    </div>
  )
}

export default Home
