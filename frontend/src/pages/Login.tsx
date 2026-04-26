import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.token, response.data.username);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 animate-fadeIn min-h-[70vh]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-primary-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-60"></div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-soft-lg w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>

        <div className="text-center mb-10">
          <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary-600 shadow-sm border border-primary-100">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 font-medium mt-2">Sign in to manage your collection</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 flex items-start space-x-3 border border-red-100 text-sm font-semibold animate-shake">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User size={20} />
              </span>
              <input
                type="text"
                placeholder="Your username"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium placeholder:text-slate-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
              <a href="#" className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">Forgot?</a>
            </div>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-primary-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center space-x-2 group"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 font-medium">
            New here?{' '}
            <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors inline-flex items-center space-x-1">
              <span>Create Account</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
