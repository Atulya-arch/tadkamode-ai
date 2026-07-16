import React, { useState } from 'react';
import { authService } from '../services/authService';
import { X, Lock, Mail, User, ShieldAlert, Check } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let user;
      if (isSignup) {
        user = await authService.signup(name, email, password);
      } else {
        user = await authService.login(email, password);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess(user);
        handleClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="glass-card w-full max-w-md rounded-[32px] overflow-hidden border border-white/20 shadow-2xl relative z-10 p-8 animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors border-none bg-transparent cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl font-bold">restaurant_menu</span>
          </div>
          <h3 className="font-display text-xl font-black text-on-surface">
            {isSignup ? 'Create Culinary Account' : 'Welcome to TadkaMode'}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            {isSignup ? 'Unlock personalized recipe history & favorite toggles' : 'Log in to access your saved chef creations'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container border border-error/20 rounded-2xl p-4 flex items-start gap-3 mb-6 text-xs text-on-error-container animate-shake">
            <ShieldAlert className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 mb-6 text-xs text-primary animate-scale-in">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <p className="font-bold">Authentication Successful! Logging in...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-surface-container-low border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:outline-none text-xs text-on-surface transition-all placeholder:text-on-surface-variant/50"
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
              <Mail className="w-4 h-4" />
            </span>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-surface-container-low border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:outline-none text-xs text-on-surface transition-all placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
              <Lock className="w-4 h-4" />
            </span>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 chars)"
              className="w-full bg-surface-container-low border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:outline-none text-xs text-on-surface transition-all placeholder:text-on-surface-variant/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 border-none cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{isSignup ? 'Register Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
          <span>{isSignup ? 'Already have an account?' : 'New to TadkaMode?'}</span>{' '}
          <button 
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="text-primary font-black hover:underline border-none bg-transparent cursor-pointer ml-1"
          >
            {isSignup ? 'Log In Instead' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
