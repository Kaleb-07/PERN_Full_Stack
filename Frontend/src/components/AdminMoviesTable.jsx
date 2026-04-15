import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';

const AdminMoviesTable = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMovies(page, 10, search, genre);
      setMovies(data.data.movies);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [page, search, genre]);

  const handleDelete = async (movieId) => {
    if (!window.confirm('Delete this movie? This breaks all user watchlists containing it.')) return;
    
    try {
      await adminService.deleteMovie(movieId);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete movie');
    }
  };

  return (
    <motion.div 
      className="admin-table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="admin-table-header">
        <h2>Content Library</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="admin-search-bar" style={{ width: '180px' }}>
            <Filter size={18} color="#71717a" />
            <input 
              type="text" 
              placeholder="Filter Genre..." 
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="admin-search-bar">
            <Search size={18} color="#71717a" />
            <input 
              type="text" 
              placeholder="Search movies by title..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Genres</th>
            <th>Uploaded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading movies...</td></tr>
          ) : movies.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No movies found.</td></tr>
          ) : (
            movies.map((movie) => (
              <tr key={movie.id}>
                <td style={{ fontWeight: 500 }}>{movie.title}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.genres.join(', ')}</td>
                <td style={{ color: '#a1a1aa' }}>{movie.creator?.name || 'Unknown'}</td>
                <td>
                  <button 
                    title="Remove Movie" 
                    className="action-btn delete" 
                    onClick={() => handleDelete(movie.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="admin-pagination">
        <button 
          className="admin-page-btn" 
          disabled={page <= 1} 
          onClick={() => setPage(p => p - 1)}
        >
          <ChevronLeft size={18} /> Prev
        </button>
        <span>Page {page} of {totalPages || 1}</span>
        <button 
          className="admin-page-btn" 
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default AdminMoviesTable;
