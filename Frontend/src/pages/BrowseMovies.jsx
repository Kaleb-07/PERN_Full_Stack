import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Loader2, Bookmark, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
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
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
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

  return (
    <div className="browse-movies-page animate-slide-up">
      <div className="page-header mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="h1">Browse <span>Movies</span></h1>
        
        <form onSubmit={handleSearch} className="search-filter-controls flex flex-wrap gap-4">
          <div className="search-box relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="form-input pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="genre-filter flex items-center gap-2">
            <Filter size={18} className="text-muted" />
            <select 
              className="form-input"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="empty-state py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="mt-4 text-secondary">Loading cinema gems...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="movies-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card glass-panel group animate-slide-up">
              <div className="poster-container relative aspect-[2/3] overflow-hidden rounded-t-xl">
                <Link to={`/movie/${movie.id}`}>
                  <img 
                    src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80'} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <button 
                  onClick={() => addToWatchlist(movie.id)}
                  className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                  title="Add to Watchlist"
                >
                  <Bookmark size={18} />
                </button>
              </div>
              <div className="movie-info p-4">
                <Link to={`/movie/${movie.id}`}>
                  <h3 className="text-white font-medium mb-1 truncate hover:text-primary transition-colors">{movie.title}</h3>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-xs">{movie.releaseYear}</span>
                  <span className="text-primary text-xs font-semibold">{movie.genres?.[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state py-20 glass-panel">
          <Star className="text-muted mb-4" size={48} />
          <p className="text-xl font-medium">No movies match your search</p>
          <p className="text-secondary">Try a different title or genre</p>
        </div>
      )}
    </div>
  )
}

export default BrowseMovies
