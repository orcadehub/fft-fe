import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-ff-orange to-orange-600 rounded-lg flex items-center justify-center transform -rotate-6 shadow-[0_0_15px_rgba(255,107,53,0.4)] border border-orange-400/30">
                <span className="text-white font-black text-lg italic tracking-tighter">FF</span>
              </div>
              <span className="text-xl font-black text-white uppercase tracking-widest">Tourney</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              India's premier Free Fire tournament platform. Compete, win, and earn real cash prizes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-gray-400 hover:text-ff-orange text-sm transition">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-ff-orange text-sm transition">Dashboard</Link></li>
              <li><Link to="/leaderboard" className="text-gray-400 hover:text-ff-orange text-sm transition">Leaderboard</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-ff-orange text-sm transition">Support Center</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-ff-orange text-sm transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-ff-orange text-sm transition">Terms & Conditions</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-ff-orange text-sm transition">About Us</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Connect</h4>
            <div className="flex items-center space-x-3 mb-4">
              <a
                href="https://www.instagram.com/ff.tourney"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:scale-110 transition-all duration-300"
                title="Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://t.me/ff.tourney"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:scale-110 transition-all duration-300"
                title="Telegram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@ff.tourney"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:scale-110 transition-all duration-300"
                title="YouTube"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              Email: <a href="mailto:support@fftourney.com" className="text-gray-400 hover:text-ff-orange transition">support@fftourney.com</a>
            </p>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} FF Tourney (fftourney.com). All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-300 transition">Privacy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition">Terms</Link>
              <Link to="/about" className="text-gray-500 hover:text-gray-300 transition">About</Link>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-4">
            Free Fire is a registered trademark of Garena. FF Tourney is not affiliated with or endorsed by Garena.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
