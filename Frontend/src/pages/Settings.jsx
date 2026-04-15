import React, { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2,
  Settings as SettingsIcon,
  User
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match")
    }

    if (formData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters")
    }

    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
      
      toast.success("Password updated successfully!")
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error updating password:', error)
      const message = error.response?.data?.error || "Failed to update password"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-page animate-slide-up">
      <div className="dashboard-welcome">
        <h1 className="h1">Account <span>Settings</span></h1>
        <p className="text-secondary">Manage your security preferences and profile information.</p>
      </div>

      <div className="dashboard-content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <section className="settings-section glass-panel p-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header mb-8 pb-4 border-b border-white border-opacity-5">
            <h2 className="h2 flex items-center gap-3">
              <Shield className="text-primary" size={24} />
              Security Settings
            </h2>
            <p className="text-secondary text-sm mt-1">Ensure your account stays protected by using a strong password.</p>
          </div>

          <form className="settings-form" onSubmit={handlePasswordChange}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group mb-6">
                <label className="form-label mb-2 block">
                  <Lock size={16} className="inline mr-2 text-muted" />
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Enter your current password"
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-grid gap-6">
                <div className="form-group">
                  <label className="form-label mb-2 block">
                    <Lock size={16} className="inline mr-2 text-muted" />
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-input w-full"
                      placeholder="Enter new password"
                      required
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label mb-2 block">
                    <Lock size={16} className="inline mr-2 text-muted" />
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Re-type new password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
                style={{ padding: '0.875rem 2.5rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="settings-section glass-panel p-8 mt-8 opacity-60" style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
          <div className="section-header mb-6">
            <h2 className="h2 flex items-center gap-3">
              <User className="text-muted" size={24} />
              Profile Information (Coming Soon)
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white border-opacity-5">
              <span className="text-secondary">Full Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white border-opacity-5">
              <span className="text-secondary">Email Address</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings
