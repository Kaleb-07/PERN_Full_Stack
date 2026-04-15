import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(page, 10, search);
      setUsers(data.data.users);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Adding a small debounce to search
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [page, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you certain you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <motion.div 
      className="admin-table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="admin-table-header">
        <h2>User Management</h2>
        <div className="admin-search-bar">
          <Search size={18} color="#71717a" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on new search
            }}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading users...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
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

export default AdminUsersTable;
