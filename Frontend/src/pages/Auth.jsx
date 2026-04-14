import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const { login, register, loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
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
    <div className="auth-page animate-slide-up">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2 className="h2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-secondary">{isLogin ? 'Enter your credentials to continue' : 'Join CineAdmin to start managing your watchlist'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          )}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button className="btn-primary auth-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? 'Login' : 'Sign Up'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
