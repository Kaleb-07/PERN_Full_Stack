import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2, ShieldAlert, ShieldCheck, Mail, Calendar, CheckSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(page, 10, search);
      setUsers(data.data.users);
      setTotalPages(data.data.totalPages);
      setSelectedIds([]); // Reset selection on page change
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [page, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success('User authority synchronized');
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you certain you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User removed from system');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected users?`)) return;
    
    try {
      // For now, we'll delete them one by one if the backend doesn't have a bulk endpoint
      // Professional way: await adminService.bulkDeleteUsers(selectedIds)
      await Promise.all(selectedIds.map(id => adminService.deleteUser(id)));
      toast.success(`${selectedIds.length} users removed successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Bulk deletion encountered issues');
    }
  };

  const handleBulkRoleChange = async (newRole) => {
    try {
      await Promise.all(selectedIds.map(id => adminService.updateUserRole(id, newRole)));
      toast.success(`Authority updated for ${selectedIds.length} users`);
      fetchUsers();
    } catch (error) {
      toast.error('Bulk update encountered issues');
    }
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>User Operations</h2>
        <div className="admin-controls">
          <div className="admin-search-bar">
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Filter by name, email, or ID..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="modern-grid-header user-grid" style={{ gridTemplateColumns: '50px 1.5fr 1.5fr 1fr 1fr 0.8fr' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input 
            type="checkbox" 
            className="admin-checkbox" 
            checked={users.length > 0 && selectedIds.length === users.length}
            onChange={toggleSelectAll}
          />
        </div>
        <span>Identity</span>
        <span>Contact</span>
        <span>Authority</span>
        <span>Onboarding</span>
        <span>Actions</span>
      </div>

      <div className="modern-list">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse"> Synchronizing Data... </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No matching users found in the system.</div>
          ) : (
            users.map((user, index) => (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`modern-row-card user-grid ${selectedIds.includes(user.id) ? 'selected' : ''}`}
                style={{ gridTemplateColumns: '50px 1.5fr 1.5fr 1fr 1fr 0.8fr', borderColor: selectedIds.includes(user.id) ? 'var(--admin-accent)' : '' }}
              >
                {/* Checkbox */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admin-checkbox" 
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelectOne(user.id)}
                  />
                </div>

                {/* Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, var(--admin-accent), #4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: '#fff',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                  }}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{user.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>UID: {user.id.slice(0, 8)}</span>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8' }}>
                  <Mail size={14} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.email}</span>
                </div>

                {/* Authority */}
                <div>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>

                {/* Onboarding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b' }}>
                  <Calendar size={14} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {user.role === 'USER' ? (
                    <button 
                      title="Promote to Admin" 
                      className="action-btn" 
                      onClick={() => handleRoleChange(user.id, 'ADMIN')}
                    >
                      <ShieldCheck size={18} />
                    </button>
                  ) : (
                    <button 
                      title="Demote to User" 
                      className="action-btn" 
                      onClick={() => handleRoleChange(user.id, 'USER')}
                    >
                      <ShieldAlert size={18} />
                    </button>
                  )}
                  <button 
                    title="Delete User" 
                    className="action-btn delete" 
                    onClick={() => handleDelete(user.id)}
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
          <span className="text-sm font-black uppercase tracking-widest">Items Selected</span>
        </div>
        <div className="h-8 w-px bg-white/20"></div>
        <div className="bulk-actions-group">
          <button className="bulk-btn" onClick={() => handleBulkRoleChange('ADMIN')}>
            <ShieldCheck size={16} /> Promote Selected
          </button>
          <button className="bulk-btn" onClick={() => handleBulkRoleChange('USER')}>
            <ShieldAlert size={16} /> Demote Selected
          </button>
          <button className="bulk-btn danger" onClick={handleBulkDelete}>
            <Trash2 size={16} /> Delete Selected
          </button>
          <button className="bulk-btn" onClick={() => setSelectedIds([])} style={{ border: 'none', background: 'rgba(0,0,0,0.2)' }}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersTable;
