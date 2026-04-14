import React from 'react'
import { TrendingUp, Plus } from 'lucide-react'

const movies = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', rating: 8.8, image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80' },
  { id: 2, title: 'The Dark Knight', genre: 'Action', rating: 9.0, image: 'https://images.unsplash.com/photo-1547721064-36203661264b?w=800&q=80' },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', rating: 8.7, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80' },
  { id: 4, title: 'Dune: Part Two', genre: 'Sci-Fi', rating: 8.9, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80' },
  { id: 5, title: 'Oppenheimer', genre: 'Biography', rating: 8.4, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80' },
  { id: 6, title: 'Avatar', genre: 'Fantasy', rating: 7.9, image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80' },
]

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      <header className="hero glass">
        <div className="hero-content">
          <span className="badge">Featured Selection</span>
          <h1>Experience the Future of <span>Cinema</span></h1>
          <p>Stream your favorite movies with incredible detail and immersive sound. Your journey into the extraordinary begins here.</p>
          <div className="hero-actions">
            <button className="btn-primary">Watch Now</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </header>

      <section className="movie-section">
        <div className="section-header">
          <TrendingUp size={24} className="icon" />
          <h2>Trending Now</h2>
        </div>
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card glass">
              <div className="card-image">
                <img src={movie.image} alt={movie.title} />
                <div className="card-overlay">
                  <button className="btn-icon"><Plus size={20} /></button>
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
      </section>
    </div>
  )
}

export default Home
