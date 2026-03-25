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

                {/* Mobile Hamburger Toggle */}
                <button 
                  onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setProfileMenuOpen(false); }}
                  className="md:hidden text-gray-400 hover:text-white transition focus:outline-none ml-2 bg-gray-800/80 p-1.5 rounded-md border border-gray-700/50"
                >
                  {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
              </>
            ) : (
              <Link to="/profile" className="bg-ff-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(255,107,53,0.5)] transition hover:-translate-y-0.5">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu completely independent from desktop flow */}
      {(user || isAdmin) && mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col z-40 origin-top animate-fade-in">
          <div className="flex flex-col px-6 py-6 space-y-4">
            
            {isAdmin ? (
               <>
                 <Link to="/moderators/agt/dashboard?mode=classic" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                   Mod Classic <span className="text-red-600">→</span>
                 </Link>
                 <Link to="/moderators/agt/dashboard?mode=clashsquad" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-red-500 font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                   Mod ClashSquad <span className="text-red-600">→</span>
                 </Link>
                 <Link to="/moderators/agt/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-red-500 hover:text-red-400 font-black uppercase tracking-widest transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                   Moderator Panel <span className="text-red-800">→</span>
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
                 <Link to="/dashboard?mode=enrolled" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                   Enrolled <span className="text-gray-600">→</span>
                 </Link>
                 <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-ff-orange font-bold uppercase tracking-wide transition border-b border-gray-800/80 pb-3 flex items-center justify-between">
                   Leaderboard <span className="text-gray-600">→</span>
                 </Link>
               </>
            )}
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
