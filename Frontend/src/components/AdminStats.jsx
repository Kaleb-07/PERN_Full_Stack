import React from 'react';
import { motion } from 'framer-motion';
import { Users, Film, Bookmark, Activity } from 'lucide-react';

const AdminStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Community',
      value: stats.totalUsers,
      icon: <Users size={28} />,
      delay: 0.1
    },
    {
      title: 'Library Assets',
      value: stats.totalMovies,
      icon: <Film size={28} />,
      delay: 0.2
    },
    {
      title: 'Global Saves',
      value: stats.totalWatchlistItems,
      icon: <Bookmark size={28} />,
      delay: 0.3
    },
    {
      title: 'Growth (7d)',
      value: stats.newUsersThisWeek,
      icon: <Activity size={28} />,
      delay: 0.4
    }
  ];

  return (
    <div className="admin-stats-grid">
      {statCards.map((card, index) => (
        <motion.div 
          key={index}
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.delay }}
        >
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-info">
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
