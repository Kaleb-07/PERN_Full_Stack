import React, { useState } from 'react'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card glass">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p>{isLogin ? 'Enter your credentials to access your account' : 'Save your favorite movies and more'}</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input type="text" placeholder="Full Name" required />
            </div>
          )}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type="password" placeholder="Password" required />
          </div>
          
          <button className="btn-primary auth-submit">
            {isLogin ? 'Login' : 'Create Account'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
