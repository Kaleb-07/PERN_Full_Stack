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
import MovieRow from '../components/MovieRow'

const MOCK_MOVIES = [
  {
    id: 'm1',
    title: 'The Witcher',
    genres: ['Drama', 'Adventure', 'Fantasy'],
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&q=80'
  },
  {
    id: 'm2',
    title: 'Stranger Things',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80'
  },
  {
    id: 'm3',
    title: 'Interstellar',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80'
  },
  {
    id: 'm4',
    title: 'The Dark Knight',
    genres: ['Action', 'Crime', 'Drama'],
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80'
  },
  {
    id: 'm5',
    title: 'Inception',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 4.7,
    posterUrl: 'https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b4adc56?w=600&q=80'
  },
  {
    id: 'm6',
    title: 'La La Land',
    genres: ['Romance', 'Comedy', 'Music'],
    author: 'Damien Chazelle',
    rating: 4.5,
    posterUrl: 'https://images.unsplash.com/photo-1485095329183-d279b86ecec4?w=600&q=80'
  },
  {
    id: 'm7',
    title: 'The Conjuring',
    genres: ['Horror', 'Mystery', 'Thriller'],
    rating: 4.6,
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80'
  },
  {
    id: 'm8',
    title: 'Our Planet',
    genres: ['Documentary'],
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1544551763-47a0159f963f?w=600&q=80'
  }
];

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [movies, setMovies] = useState(MOCK_MOVIES)
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

        const dbMovies = Array.isArray(moviesRes.data) ? moviesRes.data : moviesRes.data.data || []
        if (dbMovies.length > 0) {
          setMovies(dbMovies)
        }
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

  // Find the explicitly featured moviees or fallback to the most recent one
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


        {/* Cinematic Hero Banner V4 */}
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
            <Link to="/browse" className="row-explore-link">Explore All <ChevronRight size={14} /></Link>
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

        {/* Top Rated */}
        <MovieRow
          title="Top Rated"
          emoji="⭐"
          movies={[...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12)}
          isLarge={true}
          onWatchlist={addToWatchlist}
        />

        {/* Action Movies */}
        <MovieRow
          title="Action Movies"
          emoji="💥"
          genre="Action"
          movies={movies.filter(m => m.genres?.map(g => g.toLowerCase()).includes('action'))}
          isLarge={false}
          onWatchlist={addToWatchlist}
        />

        {/* Comedy Movies */}
        <MovieRow
          title="Comedy Movies"
          emoji="😂"
          genre="Comedy"
          movies={movies.filter(m => m.genres?.map(g => g.toLowerCase()).includes('comedy'))}
          isLarge={false}
          onWatchlist={addToWatchlist}
        />

        {/* Horror Movies */}
        <MovieRow
          title="Horror Movies"
          emoji="👻"
          genre="Horror"
          movies={movies.filter(m => m.genres?.map(g => g.toLowerCase()).includes('horror'))}
          isLarge={false}
          onWatchlist={addToWatchlist}
        />

        {/* Romance Movies */}
        <MovieRow
          title="Romance Movies"
          emoji="❤️"
          genre="Romance"
          movies={movies.filter(m => m.genres?.map(g => g.toLowerCase()).includes('romance'))}
          isLarge={false}
          onWatchlist={addToWatchlist}
        />

        {/* Documentaries */}
        <MovieRow
          title="Documentaries"
          emoji="🎥"
          genre="Documentary"
          movies={movies.filter(m => m.genres?.map(g => g.toLowerCase()).includes('documentary'))}
          isLarge={false}
          onWatchlist={addToWatchlist}
        />

      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <aside className="activity-right-panel glass-panel">
        
        {/* TOP GROUP: Search, Notification, Profile */}
        <div className="sidebar-top-group">
          <div className="sidebar-search-container">
            <input 
              type="text" 
              placeholder="Search" 
              className="sidebar-search-input"
            />
            <Search size={16} className="sidebar-search-icon" />
          </div>
          
          <button className="sidebar-icon-btn">
            <Activity size={20} strokeWidth={2.5} />
          </button>
          
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
            alt="Profile" 
            className="sidebar-avatar"
          />
        </div>

        {/* SECTION: Continue Watching */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-gray-800">Continue watching</h3>
          <div className="flex flex-col gap-4">
            {watchlist.slice(0, 3).map((item) => (
              <div key={item.id} className="continue-card group" onClick={() => navigate(`/movie/${item.movieId}`)}>
                <div className="continue-thumbnail-box">
                  <img src={item.movie?.posterUrl} alt={item.movie?.title} className="continue-img" />
                  <div className="continue-play-overlay">
                    <div className="play-circle">
                      <Play size={14} fill="white" />
                    </div>
                  </div>
                </div>
                <div className="continue-info">
                  <h4 className="continue-title">{item.movie?.title}</h4>
                  <p className="continue-genres">
                    {item.movie?.genres?.slice(0, 2).join(', ') || 'Action, Drama'}
                  </p>
                  <span className="continue-year">{item.movie?.releaseYear || '2023'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: Friends Activity */}
        <div className="mt-2">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Friends activity</h3>
          <div className="flex flex-col gap-6">
            {[
              { id: 1, name: 'James Banistor', status: 'Is now watching Stranger Things', avatar: 'JB' },
              { id: 2, name: 'Jenna Barbera', status: 'Is now watching You', avatar: 'JB' },
              { id: 3, name: 'Sara Cameron', status: 'Is now watching The Witcher', avatar: 'SC' },
              { id: 4, name: 'Jonathan Paul', status: 'Is now watching Dune', avatar: 'JP' },
            ].map((friend) => (
              <div key={friend.id} className="friend-row">
                <div className="friend-avatar-circle">
                  {friend.id === 1 ? (
                    <img src="https://i.pravatar.cc/150?u=james" alt="" className="friend-avatar-img" />
                  ) : friend.id === 2 ? (
                    <img src="https://i.pravatar.cc/150?u=jenna" alt="" className="friend-avatar-img" />
                  ) : (
                    <span>{friend.avatar}</span>
                  )}
                </div>
                <div className="friend-meta">
                  <span className="friend-username">{friend.name}</span>
                  <span className="friend-watching-text">{friend.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </aside>
    </div>
  )
}

export default Home
