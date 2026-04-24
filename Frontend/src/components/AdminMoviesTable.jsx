import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2, Filter, Plus, Calendar, User, Film, Activity, Settings, Pencil, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';
import AddMovieModal from './AddMovieModal';

const AdminMoviesTable = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMovies(page, 10, search, genre);
      setMovies(data.data.movies);
      setTotalPages(data.data.totalPages);
      setSelectedIds([]); // Reset selection on page change
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
    if (!window.confirm('Are you sure you want to remove this asset from the library?')) return;
    try {
      await adminService.deleteMovie(movieId);
      toast.success('Movie catalog updated');
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete movie');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === movies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(movies.map(m => m.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${selectedIds.length} assets from the library?`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => adminService.deleteMovie(id)));
      toast.success(`${selectedIds.length} assets removed successfully`);
      fetchMovies();
    } catch (error) {
      toast.error('Bulk removal encountered issues');
    }
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Content Catalog</h2>
        <div className="admin-controls">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="command-menu-wrapper">
              <button 
                className="command-btn" 
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} /> New Entry
              </button>
              
              <div className="command-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Film size={16} className="text-indigo-500" />
                  <span>Add New Movie</span>
                </button>
                <button className="dropdown-item disabled">
                  <Activity size={16} />
                  <span>Batch Import</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item disabled">
                  <Settings size={16} />
                  <span>Metadata Sync</span>
                </button>
              </div>
            </div>
            <div className="admin-search-bar" style={{ width: '220px' }}>
              <Filter size={20} color="#64748b" />
              <input 
                type="text" 
                placeholder="Genre Filter..." 
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="admin-search-bar">
              <Search size={20} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="modern-grid-header movie-grid" style={{ gridTemplateColumns: '50px 2fr 0.8fr 1.2fr 1fr 0.5fr' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input 
            type="checkbox" 
            className="admin-checkbox" 
            checked={movies.length > 0 && selectedIds.length === movies.length}
            onChange={toggleSelectAll}
          />
        </div>
        <span>Cinematic Asset</span>
        <span>Vintage</span>
        <span>Classifications</span>
        <span>Curator</span>
        <span>Actions</span>
      </div>

      <div className="modern-list">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Scanning Library...</div>
          ) : movies.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No cinematic assets found in the current selection.</div>
          ) : (
            movies.map((movie, index) => (
              <motion.div 
                key={movie.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`modern-row-card movie-grid ${selectedIds.includes(movie.id) ? 'selected' : ''}`}
                style={{ gridTemplateColumns: '50px 2fr 0.8fr 1.2fr 1fr 0.5fr', borderColor: selectedIds.includes(movie.id) ? 'var(--admin-accent)' : '' }}
              >
                {/* Checkbox */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admin-checkbox" 
                    checked={selectedIds.includes(movie.id)}
                    onChange={() => toggleSelectOne(movie.id)}
                  />
                </div>

                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img 
                    src={movie.posterUrl} 
                    alt="" 
                    style={{ 
                      width: '44px', 
                      height: '64px', 
                      borderRadius: '10px', 
                      objectFit: 'cover',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{movie.title}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                      <Film size={12} className="text-indigo-500" />
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>ID: {movie.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                {/* Vintage (Year) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8' }}>
                  <Calendar size={14} />
                  <span style={{ fontWeight: 700 }}>{movie.releaseYear}</span>
                </div>

                {/* Classifications (Genres) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {movie.genres.slice(0, 2).map(g => (
                    <span key={g} style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.3rem 0.75rem', 
                      background: 'rgba(99, 102, 241, 0.08)', 
                      borderRadius: '8px',
                      color: '#818cf8',
                      fontWeight: 800,
                      border: '1px solid rgba(99, 102, 241, 0.15)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>{g}</span>
                  ))}
                </div>

                {/* Curator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b' }}>
                  <User size={14} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{movie.creator?.name || 'System'}</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button 
                    title="Edit Asset" 
                    className="action-btn" 
                    onClick={() => {
                      setMovieToEdit(movie);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    title="Remove from Library" 
                    className="action-btn delete" 
                    onClick={() => handleDelete(movie.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="modern-pagination">
        <div className="text-gray-500 font-bold text-xs uppercase tracking-widest">
          Showing Page {page} of {totalPages || 1}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="admin-page-btn" 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="admin-page-btn" 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <div className={`bulk-action-bar ${selectedIds.length > 0 ? 'active' : ''}`}>
        <div className="bulk-info">
          <div className="selection-count">{selectedIds.length}</div>
          <span className="text-sm font-black uppercase tracking-widest">Assets Selected</span>
        </div>
        <div className="h-8 w-px bg-white/20"></div>
        <div className="bulk-actions-group">
          <button className="bulk-btn danger" onClick={handleBulkDelete}>
            <Trash2 size={16} /> Wipe Selected Assets
          </button>
          <button className="bulk-btn" onClick={() => setSelectedIds([])} style={{ border: 'none', background: 'rgba(0,0,0,0.2)' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Pop-up Modal */}
      <AddMovieModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setMovieToEdit(null);
        }} 
        onSuccess={fetchMovies}
        movieToEdit={movieToEdit}
      />
    </div>
  );
};

export default AdminMoviesTable;
