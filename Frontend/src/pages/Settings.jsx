import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2,
  Settings as SettingsIcon,
  User,
  Info,
  Bell,
  Users,
  CreditCard,
  X,
  Zap,
  Moon,
  Languages,
  CheckCircle,
  Clock
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  
  // Password Form State
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Full Profile & Preference State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    phoneNumber: user?.phoneNumber || '',
    fax: user?.fax || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || 'United States',
    postcode: user?.postcode || '',
    emailNotifications: user?.emailNotifications ?? true,
    pushNotifications: user?.pushNotifications ?? true,
    autoPlayPromos: user?.autoPlayPromos ?? true,
    themePreference: user?.themePreference || 'dark',
    subscriptionTier: user?.subscriptionTier || 'Free'
  })

  const tabs = [
    { id: 'general', label: 'General Information', icon: <Info size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'manager', label: 'Account Manager', icon: <Users size={18} /> },
    { id: 'billings', label: 'Billings', icon: <CreditCard size={18} /> },
  ]

  const handlePasswordChangeLocal = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({ 
      ...profileData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleToggle = (name) => {
    setProfileData(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile', profileData)
      const updatedUser = data.data.user
      
      // Update Context & Local Storage
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      toast.success("Settings updated successfully!")
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match")
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters")
    }
    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })
      toast.success("Password updated successfully!")
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error(error.response?.data?.error || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  const handleGlobalSave = (e) => {
    e?.preventDefault()
    if (activeTab === 'security') {
      handlePasswordChange()
    } else {
      // General, Preferences, Notifications all use handleProfileUpdate
      handleProfileUpdate()
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">General Information</h2>
              <p className="text-secondary text-sm">Manage your personal and organizational profile details.</p>
            </div>

            <div className="form-block-title">Profile picture upload</div>
            <div className="prof-picture-upload">
              <div className="prof-avatar-circle">
                <img src={`https://ui-avatars.com/api/?name=${profileData.name}&background=e2e8f0&color=64748b&size=128`} alt="Avatar" />
              </div>
              <div className="prof-info-text">
                <h4>{profileData.name || 'User'}</h4>
                <p>{profileData.city ? `${profileData.city}, ${profileData.country}` : 'No location set'}</p>
                <div className="upload-actions">
                  <button className="btn-save-changes py-1.5 px-4 text-xs">Upload New Photo</button>
                  <button className="btn-cancel py-1.5 px-4 text-xs border-none text-red-500 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>

            <div className="form-block-title">Organization Information</div>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label className="settings-field-label">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
              <div className="settings-field">
                <label className="settings-field-label">Business Name</label>
                <input 
                  type="text" 
                  name="businessName"
                  value={profileData.businessName}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
              <div className="settings-field">
                <label className="settings-field-label">Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
              <div className="settings-field">
                <label className="settings-field-label">Fax</label>
                <input 
                  type="text" 
                  name="fax"
                  value={profileData.fax}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
            </div>

            <div className="form-block-title">Address</div>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label className="settings-field-label">Country</label>
                <select 
                  name="country"
                  value={profileData.country}
                  onChange={handleProfileChange}
                  className="settings-input settings-input-select"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>
              <div className="settings-field">
                <label className="settings-field-label">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={profileData.city}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
              <div className="settings-field">
                <label className="settings-field-label">Postcode</label>
                <input 
                  type="text" 
                  name="postcode"
                  value={profileData.postcode}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
              <div className="settings-field">
                <label className="settings-field-label">State</label>
                <input 
                  type="text" 
                  name="state"
                  value={profileData.state}
                  onChange={handleProfileChange}
                  className="settings-input" 
                />
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">Preferences</h2>
              <p className="text-secondary text-sm">Customize your dashboard appearance and playback experience.</p>
            </div>

            <div className="flex flex-col gap-6 mt-8">
              <div className="settings-toggle-row">
                <div className="flex items-center gap-4">
                  <div className="toggle-icon-box bg-indigo-50 text-primary">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Auto-Play Promos</div>
                    <div className="text-xs text-gray-500">Smooth playback on hover</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle('autoPlayPromos')}
                  className={`settings-toggle-btn ${profileData.autoPlayPromos ? 'active' : ''}`}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="flex items-center gap-4">
                  <div className="toggle-icon-box bg-slate-50 text-slate-800">
                    <Moon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Dark Mode</div>
                    <div className="text-xs text-gray-500">Easier on the eyes at night</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle('themePreference')}
                  className={`settings-toggle-btn ${profileData.themePreference === 'dark' ? 'active' : ''}`}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>

              <div className="settings-field max-w-sm mt-4">
                <label className="settings-field-label flex items-center gap-2">
                  <Languages size={14} /> Display Language
                </label>
                <select className="settings-input settings-input-select">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">Notifications</h2>
              <p className="text-secondary text-sm">Stay updated with the latest drops and activity.</p>
            </div>

            <div className="flex flex-col gap-6 mt-8">
              <div className="settings-toggle-row">
                <div className="flex items-center gap-4">
                  <div className="toggle-icon-box bg-blue-50 text-blue-600">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Email Notifications</div>
                    <div className="text-xs text-gray-500">Receive weekly digests and alerts</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle('emailNotifications')}
                  className={`settings-toggle-btn ${profileData.emailNotifications ? 'active' : ''}`}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="flex items-center gap-4">
                  <div className="toggle-icon-box bg-orange-50 text-orange-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Push Notifications</div>
                    <div className="text-xs text-gray-500">Real-time alerts in your browser</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle('pushNotifications')}
                  className={`settings-toggle-btn ${profileData.pushNotifications ? 'active' : ''}`}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
            </div>
          </div>
        )

      case 'billings':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">Billings</h2>
              <p className="text-secondary text-sm">Manage your subscription and billing history.</p>
            </div>

            <div className="mt-8">
              <div className="billing-plan-card">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Current Plan</span>
                    <h3 className="text-2xl font-black text-gray-800 mt-1">{profileData.subscriptionTier} Membership</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-2xl text-primary">
                    <CreditCard size={24} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-bold mb-6">
                  <CheckCircle size={16} /> Active until May 2026
                </div>
                <button className="btn-primary w-full py-3 text-sm">Upgrade to Premium</button>
              </div>

              <div className="mt-10">
                <h4 className="font-bold text-gray-800 mb-4">Payment Method</h4>
                <div className="p-4 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center py-10 text-gray-400">
                  <CreditCard size={32} className="mb-2 opacity-30" />
                  <p className="text-xs font-medium">No payment method added</p>
                  <button className="text-xs font-bold text-primary mt-2">Add New Card</button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'manager':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">Account Manager</h2>
              <p className="text-secondary text-sm">View or transfer administrative control of this account.</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="account-member-item">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{profileData.name}</div>
                    <div className="text-[10px] text-gray-500">Primary Account Owner</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">
                  Verified
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-6">
                <div className="flex items-center gap-3 text-slate-400 mb-3">
                  <Clock size={16} />
                  <span className="text-xs font-bold">Activity Log</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                  Your account activity is being monitored for security. You can view full logs in the enterprise dashboard.
                </p>
                <button className="text-xs font-bold text-slate-800 hover:underline">View Activity History</button>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="animate-slide-up">
            <div className="form-section-header">
              <h2 className="settings-sect-title">Security Settings</h2>
              <p className="text-secondary text-sm">Update your password and secure your account.</p>
            </div>

            <form className="max-w-md mt-8">
              <div className="elite-form-group mb-6">
                <label className="settings-field-label mb-2 block">Current Password</label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChangeLocal}
                    className="settings-input w-full"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="elite-form-group">
                  <label className="settings-field-label mb-2 block">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChangeLocal}
                      className="settings-input w-full"
                      placeholder="Min 6 characters"
                      required
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="elite-form-group">
                  <label className="settings-field-label mb-2 block">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChangeLocal}
                    className="settings-input w-full"
                    placeholder="Re-type password"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="settings-dashboard animate-slide-up">
      <div className="settings-header">
        <div className="settings-header-text">
          <h1>Settings</h1>
          <p>Manage your professional identity and account security.</p>
        </div>
        <div className="settings-action-btns">
          <button className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button 
            className={`btn-save-changes flex items-center gap-2 ${loading ? 'opacity-70' : ''}`} 
            onClick={handleGlobalSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="settings-body">
        <nav className="settings-v-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-nav-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="settings-content-main">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Settings;
