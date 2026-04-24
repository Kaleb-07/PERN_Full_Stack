import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const { data } = await api.get('/watchlist');
      setWatchlist(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const addToWatchlist = async (movieId) => {
    try {
      // Check if already in watchlist
      if (watchlist.find(item => item.movieId === movieId)) {
        toast.error('Already in your favorites!');
        return;
      }

      const { data } = await api.post('/watchlist', { movieId, status: 'PLANNED' });
      const newItem = data.data || data;
      
      // Update local state immediately for snappy feel
      setWatchlist(prev => [newItem, ...prev]);
      toast.success('Added to Favorites! ✨');
      
      // Refresh to get full movie data if needed
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to add to Favorites');
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setWatchlist(prev => prev.filter(item => item.id !== id));
      toast.success('Removed from Favorites');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, loading, addToWatchlist, removeFromWatchlist, fetchWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
