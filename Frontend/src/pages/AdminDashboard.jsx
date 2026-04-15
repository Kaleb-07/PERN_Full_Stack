import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Film } from 'lucide-react';
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
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>System metrics, user management, and content moderation.</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} /> Overview
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> User Management
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          <Film size={18} /> Content Library
        </button>
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        {loading && activeTab === 'overview' && (
          <p style={{ color: '#a1a1aa' }}>Loading analytics...</p>
        )}
        
        {activeTab === 'overview' && !loading && <AdminStats stats={stats} />}
        {activeTab === 'users' && <AdminUsersTable />}
        {activeTab === 'movies' && <AdminMoviesTable />}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
