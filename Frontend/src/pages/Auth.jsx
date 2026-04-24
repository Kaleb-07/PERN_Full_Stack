// Professional Auth Redesign
import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, ArrowRight, Loader2, Film, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const { login, register, loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      await login(formData.email, formData.password)
    } else {
      await register(formData.name, formData.email, formData.password)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="auth-container">
      {/* Left side: Modern Simple Showcase */}
      <div className="auth-showcase">
        <div className="auth-showcase-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
          alt="Cinematic Background" 
          className="auth-bg-img"
        />

        {/* Repositioned Mini Floating Cards */}
        <div className="floating-elements-container">
          <div className="floating-card float-1 glass-panel">
            <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&q=80" alt="Matrix Poster" />
          </div>
          <div className="floating-card float-2 glass-panel">
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&q=80" alt="Inception Poster" />
          </div>
          <div className="floating-card float-3 glass-panel">
            <div className="stat-pill">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Movies</span>
            </div>
          </div>
          <div className="floating-card float-4 glass-panel">
            <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&q=80" alt="Film Reel" />
          </div>
          <div className="floating-card float-5 glass-panel">
            <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80" alt="Movie Clapboard" />
          </div>
        </div>

        <div className="auth-showcase-content">
          <div className="auth-brand-logo animate-fade-in-up">
            <div className="logo-box">
              <Film size={28} className="text-white" />
            </div>
            <h1 className="h1">Cine<span className="text-primary-light">Admin</span></h1>
          </div>
          
          <div className="auth-quote animate-slide-up-delay">
            <div className="quote-badge">
              <Sparkles size={16} /> Premium Access
            </div>
            <h2>Curate the ultimate cinematic universe.</h2>
            <p>Manage users, review analytics, and organize thousands of titles with our state-of-the-art admin dashboard.</p>
          </div>
        </div>
      </div>

      {/* Right side: The glassmorphic form */}
      <div className="auth-form-wrapper">
        <div className="blob-3"></div>
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-muted">
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Join our community and start curating your watchlist'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group animate-slide-up">
                <User className="input-icon" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="premium-input"
                />
              </div>
            )}
            
            <div className="input-group animate-slide-up delay-1">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="premium-input"
              />
            </div>
            
            <div className="input-group animate-slide-up delay-2">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
                className="premium-input"
              />
            </div>
            
            <button className="btn-primary auth-submit animate-slide-up delay-3" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} className="arrow-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer animate-fade-in delay-4">
            <p className="text-sm text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="btn-link" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
