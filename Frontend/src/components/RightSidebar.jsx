import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Activity, 
  Play, 
  Heart, 
  ChevronRight, 
  Star,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import './RightSidebar.css';

const RightSidebar = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="activity-right-panel glass-panel luxury-sidebar">
      
      {/* TOP GROUP: Search & Profile */}
      <div className="sidebar-top-group">
        <div className="sidebar-search-container">
          <input 
            type="text" 
            placeholder="Search universe..." 
            className="sidebar-search-input"
          />
          <Search size={16} className="sidebar-search-icon" />
        </div>
        
        <div className="sidebar-profile-link">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="sidebar-avatar"
          />
        </div>
      </div>

      {/* SECTION: My Favorites (The special side part) */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h3 className="section-title-premium">
            <Sparkles size={16} className="sparkle-icon" />
            My Favorites
          </h3>
          <Link to="/watchlist" className="view-all-link">View All</Link>
        </div>
        
        <div className="favorites-list">
          <AnimatePresence mode="popLayout">
            {watchlist.length > 0 ? (
              watchlist.slice(0, 4).map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={item.id} 
                  className="favorite-card group"
                >
                  <div className="fav-thumb-wrapper" onClick={() => navigate(`/movie/${item.movieId}`)}>
                    <img src={item.movie?.posterUrl} alt={item.movie?.title} className="fav-img" />
                    <div className="fav-play-overlay">
                      <Play size={12} fill="white" />
                    </div>
                  </div>
                  
                  <div className="fav-info" onClick={() => navigate(`/movie/${item.movieId}`)}>
                    <h4 className="fav-title">{item.movie?.title}</h4>
                    <div className="fav-meta">
                      <Star size={10} fill="#fbbf24" stroke="none" />
                      <span>{item.movie?.rating?.toFixed(1) || '4.8'}</span>
                      <span className="dot">•</span>
                      <span>{item.movie?.genres?.[0] || 'Movie'}</span>
                    </div>
                  </div>

                  <button 
                    className="remove-fav-btn"
                    onClick={() => removeFromWatchlist(item.id)}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="empty-favorites">
                <Heart size={32} className="opacity-10 mb-2" />
                <p>Click heart icons to add movies here!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION: Continue Watching */}
      <div className="sidebar-section">
        <h3 className="section-title-premium">Continue watching</h3>
        <div className="continue-stack">
          {[1].map((i) => (
            <div key={i} className="mini-continue-card">
              <div className="mini-progress-ring">
                <svg width="40" height="40">
                  <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                  <circle cx="20" cy="20" r="18" stroke="#6366f1" strokeWidth="3" fill="none" 
                    strokeDasharray="113" strokeDashoffset="40" strokeLinecap="round" />
                </svg>
                <Play size={10} fill="white" className="mini-play-icon" />
              </div>
              <div className="mini-info">
                <h5 className="mini-info-title">The Bear</h5>
                <p className="mini-info-subtitle">S2 • E4 (12m left)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Network Activity */}
      <div className="sidebar-section network-activity">
        <h3 className="section-title-premium">Network Activity</h3>
        <div className="friends-mini-list">
          {[
            { id: 1, name: 'James', status: 'watching Dune', img: 'https://i.pravatar.cc/100?img=11' },
            { id: 2, name: 'Sarah', status: 'watching Witcher', img: 'https://i.pravatar.cc/100?img=5' },
          ].map((friend) => (
            <div key={friend.id} className="friend-mini-row">
              <img src={friend.img} alt="" className="friend-mini-avatar" />
              <div className="friend-mini-meta">
                <span className="name">{friend.name}</span>
                <span className="status">is {friend.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default RightSidebar;
