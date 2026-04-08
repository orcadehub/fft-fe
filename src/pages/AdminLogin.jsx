import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/ff/moderators/login', {
        username,
        password
      });

      // Save admin token to local storage securely
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('moderator', JSON.stringify(res.data.moderator));
      
      // Redirect to a specific dashboard or just tournament creator
      toast.success('Admin authorized');
      navigate('/moderators/agt/dashboard'); 
      
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed. Please check credentials.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-gray-900 border border-red-500/20 rounded-3xl p-8 relative shadow-2xl z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/30">
            <ShieldCheckIcon className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">Moderator access</h2>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">Restricted Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                placeholder="admin@freefire.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">Secure Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Authorize Login'}
          </button>
        </form>
        
        <p className="text-[9px] text-gray-500 font-black uppercase text-center mt-8 tracking-[0.2em]">
          All logins are monitored and IP logged.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
