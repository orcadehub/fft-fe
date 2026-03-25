import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CurrencyRupeeIcon, FireIcon } from '@heroicons/react/24/solid';

const CreateTournament = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomCode: '',
    password: '',
    entryFee: 20,
    gameMode: 'Bermuda',
    startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    maxPlayers: 48,
  });
  const [isFree, setIsFree] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFree && formData.maxPlayers % 100 !== 0) {
      return setError('Free tournaments must be in multiples of 100 players');
    }
    
    try {
      const payload = { ...formData, entryFee: isFree ? 0 : formData.entryFee };
      const res = await api.post('/api/tournaments', payload);
      navigate(`/tournament/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create tournament');
    }
  };

  if (!user) return <div className="p-10 text-center text-xl text-gray-500">Please login first</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-gray-800 rounded-3xl p-8 md:p-12 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-ff-orange/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase text-white tracking-tighter italic">
              Create <span className="text-ff-orange">Arena</span>
            </h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Configure Match Parameters</p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 self-end">
            <button 
                type="button"
                onClick={() => { setIsFree(false); setFormData({...formData, entryFee: 20, maxPlayers: 48}); }}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isFree ? 'bg-ff-orange text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Paid
            </button>
            <button 
                type="button"
                onClick={() => { setIsFree(true); setFormData({...formData, entryFee: 0, maxPlayers: 100}); }}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isFree ? 'bg-ff-orange text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Free
            </button>
          </div>
        </div>

        {user.level < 60 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-5 rounded-2xl mb-8 flex items-center space-x-4 animate-pulse">
            <FireIcon className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-black uppercase text-xs tracking-widest">Verification Required</p>
              <p className="text-[12px] font-bold mt-0.5">Level 60+ accounts only. You are currently Level {user.level}.</p>
            </div>
          </div>
        )}

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold text-center italic">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">Room Code</label>
              <input type="text"
                className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white font-mono text-lg placeholder-gray-700 shadow-inner group-focus-within:border-ff-orange"
                value={formData.roomCode}
                onChange={(e) => setFormData({...formData, roomCode: e.target.value})}
                required placeholder="12345678"
                disabled={user.level < 60}
              />
            </div>
            <div className="group">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">Room Password</label>
              <input type="text"
                className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white font-mono text-lg placeholder-gray-700 shadow-inner group-focus-within:border-ff-orange"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required placeholder="SECRET"
                disabled={user.level < 60}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">Game Map / Mode</label>
              <select 
                className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white appearance-none cursor-pointer"
                value={formData.gameMode}
                onChange={(e) => setFormData({...formData, gameMode: e.target.value})}
                disabled={user.level < 60}
              >
                <option value="Bermuda">Bermuda (Classic)</option>
                <option value="Clash Squad">Clash Squad</option>
                <option value="Purgatory">Purgatory (Classic)</option>
                <option value="Kalahari">Kalahari (Classic)</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">
                {isFree ? 'Registration Cap' : 'Entry Fee (₹)'}
              </label>
              <div className="relative">
                {isFree ? (
                    <select 
                        className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white appearance-none cursor-pointer font-black italic"
                        value={formData.maxPlayers}
                        onChange={(e) => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
                        disabled={user.level < 60}
                    >
                        <option value={100}>100 Players</option>
                        <option value={200}>200 Players</option>
                        <option value={300}>300 Players</option>
                        <option value={400}>400 Players</option>
                        <option value={500}>500 Players</option>
                        <option value={1000}>1000 Players</option>
                    </select>
                ) : (
                    <>
                        <CurrencyRupeeIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input type="number" min="10" max="500"
                            className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 pl-14 px-6 focus:outline-none focus:border-ff-orange transition text-white font-black italic text-lg"
                            value={formData.entryFee}
                            onChange={(e) => setFormData({...formData, entryFee: parseInt(e.target.value)})}
                            required
                            disabled={user.level < 60}
                        />
                    </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">Start Time</label>
              <input type="datetime-local"
                className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white font-bold"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
                disabled={user.level < 60}
              />
            </div>
            {!isFree && (
                <div className="group animate-fade-in">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 ml-1">Player Limit</label>
                <input type="number" min="4" max="50"
                    className="w-full bg-black/40 border border-gray-700/50 rounded-2xl py-4 px-6 focus:outline-none focus:border-ff-orange transition text-white font-black"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
                    required
                    disabled={user.level < 60}
                />
                </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5">
            {!isFree ? (
                <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 mb-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-ff-orange opacity-0 group-hover:opacity-[0.03] transition duration-500"></div>
                   <div className="z-10">
                     <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Guaranteed Prize Pool</p>
                     <p className="text-3xl font-black text-white italic tracking-tighter">₹{Math.floor(formData.entryFee * formData.maxPlayers * 0.85)}</p>
                   </div>
                   <div className="text-right z-10">
                     <p className="text-ff-orange text-[10px] font-black uppercase tracking-widest bg-ff-orange/10 px-3 py-1 rounded-lg border border-ff-orange/20">85% To Players</p>
                   </div>
                </div>
            ) : (
                <div className="bg-blue-600/10 p-6 rounded-2xl border border-blue-600/20 mb-8 flex items-center space-x-4 animate-fade-in">
                    <div className="bg-blue-600/20 p-3 rounded-xl">
                        <FireIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white font-black uppercase text-[10px] tracking-widest">Free Entry Configuration</p>
                        <p className="text-gray-400 text-[11px] font-bold mt-1">First 48 players to join the room using the shared ID/Password will play. First-come, first-served.</p>
                    </div>
                </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden group ${user.level < 60 ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-ff-orange text-white shadow-[0_10px_30px_rgba(255,107,53,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,53,0.5)] hover:-translate-y-1 active:scale-95'}`}
              disabled={user.level < 60}
            >
              <span className="relative z-10">Initialize {isFree ? 'Free' : 'Pro'} Tournament</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
