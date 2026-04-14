import React from 'react'
import { Bookmark, Trash2 } from 'lucide-react'

const watchlistMovies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', rating: 8.8, image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80' },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', rating: 8.7, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80' },
]

const Watchlist = () => {
  return (
    <div className="watchlist-page animate-fade-in">
      <header className="page-header">
        <h1 className="page-title">My <span>Watchlist</span></h1>
        <p className="page-subtitle">Movies you've saved to watch later.</p>
      </header>

      {watchlistMovies.length > 0 ? (
        <div className="movie-grid">
          {watchlistMovies.map(movie => (
            <div key={movie.id} className="movie-card glass">
              <div className="card-image">
                <img src={movie.image} alt={movie.title} />
                <div className="card-overlay">
                  <button className="btn-icon btn-danger"><Trash2 size={20} /></button>
                </div>
              </div>
              <div className="card-info">
                <h3>{movie.title}</h3>
                <div className="card-meta">
                  <span>{movie.genre}</span>
                  <span className="rating">★ {movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass">
          <Bookmark size={48} className="icon" />
          <h3>Your watchlist is empty</h3>
          <p>Explore movies and add them to your list to see them here.</p>
          <button className="btn-primary">Browse Movies</button>
        </div>
      )}
    </div>
  )
}

export default Watchlist
