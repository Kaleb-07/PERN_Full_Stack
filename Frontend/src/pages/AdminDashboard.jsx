import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Film, 
  ShieldCheck, 
  Zap, 
  Settings,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';

import AdminStats from '../components/AdminStats';
import AdminUsersTable from '../components/AdminUsersTable';
import AdminMoviesTable from '../components/AdminMoviesTable';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resetStats = await adminService.getStats();
        setStats(resetStats.data);
      } catch (error) {
        toast.error('Failed to load system metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      {/* --- ELITE HEADER --- */}
      <header className="admin-header">
        <div className="admin-header-title">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Command Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Managing the pulse of Cinema Circle.
          </motion.p>
        </div>

        <motion.div 
          className="admin-status-pill"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="pulse-dot"></div>
          <span className="text-sm font-bold tracking-wider uppercase text-gray-400">System Live</span>
        </motion.div>
      </header>

      {/* --- LUXURY TABS --- */}
      <nav className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={20} /> Dashboard
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} /> User Ops
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          <Film size={20} /> Content
        </button>
      </nav>

      {/* --- DYNAMIC CONTENT --- */}
      <main className="admin-content">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {loading && activeTab === 'overview' ? (
              <div className="flex items-center gap-3 text-gray-500 py-10">
                <Zap className="animate-pulse" size={24} />
                <span className="font-bold tracking-widest uppercase">Initializing Analytics...</span>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="admin-overview-layout">
                    <div className="main-metrics">
                      <AdminStats stats={stats} />
                    </div>
                    
                    <div className="activity-sidebar">
                      <div className="activity-card">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">Quick Insight</h3>
                          <Settings size={16} className="text-gray-600" />
                        </div>
                        
                        <div className="activity-timeline">
                          {[
                            { user: 'System', action: 'Catalog Sync Complete', time: '2m ago', type: 'success', icon: <Activity size={12} /> },
                            { user: 'Admin', action: 'New User Promoted', time: '45m ago', type: 'info', icon: <Users size={12} /> },
                            { user: 'Carlos', action: 'Added "Interstellar"', time: '2h ago', type: 'movie', icon: <Film size={12} /> },
                            { user: 'System', action: 'Database Backup', time: '6h ago', type: 'neutral', icon: <ShieldCheck size={12} /> },
                          ].map((item, i) => (
                            <div key={i} className="timeline-item">
                              <div className="timeline-marker">
                                <div className={`marker-dot ${item.type}`}></div>
                                {i !== 3 && <div className="marker-line"></div>}
                              </div>
                              
                              <motion.div 
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                className="timeline-content"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`type-tag ${item.type}`}>{item.user}</span>
                                  <span className="time-text">{item.time}</span>
                                </div>
                                <p className="action-text">{item.action}</p>
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        <button className="audit-log-btn">
                          Launch Full Audit <Zap size={14} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'users' && <AdminUsersTable />}
                {activeTab === 'movies' && <AdminMoviesTable />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
