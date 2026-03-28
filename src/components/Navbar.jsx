import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { WalletIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isAdmin = !!localStorage.getItem('adminToken');
  const isTransparent = location.pathname === '/' || location.pathname === '/profile';

  // Close mobile and profile menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`w-full z-50 transition-all ${isTransparent ? 'fixed top-0 bg-transparent border-b border-white/10' : 'sticky top-0 bg-gray-900 border-b border-gray-800 shadow-ff-neon'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Premium CSS-based FF Logo Badge */}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-ff-orange to-orange-600 rounded-lg flex items-center justify-center transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(255,107,53,0.5)] border border-orange-400/30">
                <span className="text-white font-black text-xl italic tracking-tighter drop-shadow-md">FF</span>
              </div>
              {/* Tourney Title */}
              <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 uppercase tracking-widest drop-shadow-sm group-hover:from-white group-hover:to-orange-100 transition-all duration-300">
                Tourney
              </span>
            </Link>

            {/* Social Icons (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <a 
                href="https://www.instagram.com/ff.tourney" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:scale-110 hover:shadow-[0_0_12px_rgba(236,72,153,0.5)] transition-all duration-300"
                title="Follow us on Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/ff.tourney" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:scale-110 hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300"
                title="Join our Telegram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@ff.tourney" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:scale-110 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all duration-300"
                title="Subscribe on YouTube"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
            {(user || isAdmin) ? (
              <>
                {/* Navbar Links */}
                <div className="hidden md:flex items-center space-x-6 mr-4">
                  {isAdmin ? (
                    <>
                      <Link to="/moderators/agt/dashboard?mode=classic" className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide text-sm transition">Classic</Link>
                      <Link to="/moderators/agt/dashboard?mode=clashsquad" className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide text-sm transition">ClashSquad</Link>
                      <Link to="/moderators/agt/dashboard" className="text-red-500 hover:text-red-400 font-black uppercase tracking-widest text-sm transition flex items-center drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                        Moderator Panel
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard?mode=classic" className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide text-sm transition">Classic</Link>
                      <Link to="/dashboard?mode=clashsquad" className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide text-sm transition">ClashSquad</Link>
                      <Link to="/dashboard?mode=enrolled" className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide text-sm transition">Enrolled</Link>
                      <Link to="/leaderboard" className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide text-sm transition">Leaderboard</Link>
                    </>
                  )}
                </div>

                {user && (
                  <>
                    <Link to="/wallet" className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700/50 hover:bg-gray-700 transition group cursor-pointer">
                      <WalletIcon className="h-4 w-4 text-ff-success group-hover:scale-110 transition" />
                      <span className="font-bold text-sm">₹{user.walletBalance}</span>
                    </Link>
                    
                    <div className="relative">
                      <button 
                        onClick={() => { setProfileMenuOpen(!profileMenuOpen); setMobileMenuOpen(false); }} 
                        className="flex items-center space-x-1.5 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-700/50 transition group"
                      >
                        <UserCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-ff-orange transition" />
                        <span className="font-semibold hidden sm:inline text-sm text-gray-200 group-hover:text-white transition">Profile</span>
                      </button>

                      {/* Profile Context Dropdown */}
                      {profileMenuOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-fade-in flex flex-col py-1">
                          <Link to="/profile" className="px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-ff-orange transition border-b border-gray-800/50">Profile</Link>
                          <Link to="/history" className="px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-ff-orange transition border-b border-gray-800/50">History</Link>
                          <Link to="/wallet" className="px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-ff-orange transition border-b border-gray-800/50">Wallet</Link>
                          <Link to="/support" className="px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-ff-orange transition border-b border-gray-800/50">Support Center</Link>
                          <button onClick={logout} className="px-5 py-3 text-sm text-left text-red-500 hover:bg-gray-800 hover:text-red-400 font-bold transition">Logout</button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {isAdmin && !user && (
                    <button 
                      onClick={() => { localStorage.removeItem('adminToken'); window.location.href='/moderators/agt/login'; }} 
                      className="text-red-500 hover:text-white border border-red-500/50 hover:bg-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition"
                    >
                      Logout Mod
                    </button>
                )}

              </>
            ) : (
              <Link to="/profile" className="bg-ff-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(255,107,53,0.5)] transition hover:-translate-y-0.5">
                Login
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setProfileMenuOpen(false); }}
              className="md:hidden text-gray-400 hover:text-white transition focus:outline-none ml-2 bg-gray-800/80 p-1.5 rounded-md border border-gray-700/50"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu completely independent from desktop flow */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col z-40 origin-top animate-fade-in">
          <div className="flex flex-col px-6 py-6 space-y-4">
            
            {(user || isAdmin) ? (
              isAdmin ? (
                <>
                  <Link to="/moderators/agt/dashboard?mode=classic" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                    Mod Classic <span className="text-red-600">→</span>
                  </Link>
                  <Link to="/moderators/agt/dashboard?mode=clashsquad" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                    Mod ClashSquad <span className="text-red-600">→</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard?mode=classic" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                    Classic Match <span className="text-gray-600">→</span>
                  </Link>
                  <Link to="/dashboard?mode=clashsquad" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                    ClashSquad Match <span className="text-gray-600">→</span>
                  </Link>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                    Leaderboard <span className="text-gray-600">→</span>
                  </Link>
                </>
              )
            ) : (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                 Login to Play <span className="text-ff-orange">→</span>
              </Link>
            )}

            {/* Mobile Social Links */}
            <div className="pt-4 flex items-center justify-center space-x-6">
                <a href="https://www.instagram.com/ff.tourney" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://t.me/ff.tourney" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a href="https://www.youtube.com/@ff.tourney" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
             </div>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
