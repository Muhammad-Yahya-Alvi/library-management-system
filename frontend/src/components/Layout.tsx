import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Library, LogOut, LayoutDashboard } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink: React.FC<{ to: string, children: React.ReactNode, icon: React.ReactNode }> = ({ to, children, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
          isActive 
            ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' 
            : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col w-full selection:bg-primary-100 selection:text-primary-900">
      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-primary-600 p-2 rounded-xl text-white group-hover:bg-primary-700 transition-colors shadow-primary-200 shadow-lg">
              <Library size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              Library<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
            {/* Conditional nav based on auth could go here */}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200/40">
                  <div className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-[10px] font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-200/50 transform active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full pt-10 pb-20 px-4 md:px-8">
        {children}
      </main>

      {/* Clean Modern Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-10 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 opacity-60">
            <Library size={20} className="text-primary-600" />
            <span className="font-bold text-slate-800 tracking-tight">LibraryHub</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            © 2026 Crafted with precision for your reading journey.
          </p>
          <div className="flex space-x-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
