import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CheckBadgeIcon, ShieldCheckIcon, KeyIcon, IdentificationIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import WalletModal from '../components/WalletModal';

import ffHeroBg1 from '../assets/fflogo1.jpg';
import ffHeroBg2 from '../assets/fflogo2.jpg';
import ffHeroBg3 from '../assets/fflogo3.jpg';

const backgrounds = [ffHeroBg3, ffHeroBg1, ffHeroBg2];

const Profile = () => {
  const { user, login, register, updateUserWallet } = useAuth();
  const navigate = useNavigate();
  const [ffUid, setFfUid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // UID Verification States
  const [isUidVerified, setIsUidVerified] = useState(false);
  const [verifyingUid, setVerifyingUid] = useState(false);
  const [detectedPlayer, setDetectedPlayer] = useState({ name: '', level: 0 });

  useEffect(() => {
    if (user) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [user]);

  // Handle UID Verification (Real FF API fetch via Backend)
  const handleVerifyUid = async () => {
    if (!ffUid) return setError('Please enter a UID to verify.');
    setError('');
    setVerifyingUid(true);
    
    try {
      const res = await api.get(`/api/auth/verify/${ffUid}`);
      
      if (res.data.success) {
        setDetectedPlayer({ 
          name: res.data.name, 
          level: res.data.level 
        });
        setIsUidVerified(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Could not verify UID. Make sure it is correct.');
      setIsUidVerified(false);
    } finally {
      setVerifyingUid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isLoginMode) {
      result = await login(ffUid, password);
    } else {
      if (!isUidVerified) {
        setError('Please verify your UID first.');
        setLoading(false);
        return;
      }
      // Auto-pass fetched details to registration
      result = await register(ffUid, password, detectedPlayer.name, detectedPlayer.level);
    }

    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Authentication failed');
    } else {
      navigate('/dashboard');
    }
  };

  if (!user) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center pt-16">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/95 z-0"></div>

        <div className="relative z-10 w-full max-w-md px-4 py-8 mt-10 md:mt-0">
          <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,107,53,0.15)] p-8 overflow-hidden relative">
            
            <div className="text-center mb-6 relative z-10">
              <h1 className="text-4xl font-black uppercase text-white tracking-tight">
                {isLoginMode ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-gray-300 mt-2 font-medium">
                {isLoginMode ? 'Welcome back, Player' : 'Register your UID to start'}
              </p>
            </div>

            {/* Toggle Modes */}
            <div className="flex bg-black/40 p-1 rounded-xl mb-8 relative z-10 border border-white/5">
                <button 
                    onClick={() => { setIsLoginMode(true); setError(''); setIsUidVerified(false); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLoginMode ? 'bg-ff-orange text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => { setIsLoginMode(false); setError(''); setIsUidVerified(false); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLoginMode ? 'bg-ff-orange text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Signup
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {error && <div className="text-red-500 bg-red-500/10 p-3 rounded text-xs text-center border border-red-500/30 font-bold backdrop-blur-sm">{error}</div>}
              
              <div className="animate-fade-in space-y-6">
                  {/* UID Field with Auto-Verification */}
                  <div className="group">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ml-1">Free Fire UID</label>
                    <div className="flex space-x-2">
                        <div className="relative flex-grow">
                        <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-ff-orange transition" />
                        <input type="text"
                            className={`w-full bg-black/40 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-ff-orange transition text-white font-mono text-lg ${isUidVerified && !isLoginMode ? 'border-ff-success/50 bg-green-500/5' : ''}`}
                            value={ffUid}
                            onChange={(e) => { setFfUid(e.target.value); setIsUidVerified(false); }}
                            placeholder="192837465"
                            required
                        />
                        </div>
                        {!isLoginMode && !isUidVerified && (
                             <button 
                                type="button" 
                                onClick={handleVerifyUid}
                                disabled={verifyingUid || !ffUid}
                                className="bg-ff-dark-blue hover:bg-gray-800 text-ff-orange border border-ff-orange/30 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition active:scale-95 disabled:opacity-50"
                             >
                                {verifyingUid ? 'Fetching...' : 'Verify'}
                             </button>
                        )}
                        {isUidVerified && !isLoginMode && (
                            <div className="flex items-center px-4 bg-green-500/10 border border-ff-success/30 rounded-xl text-ff-success">
                                <CheckBadgeIcon className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Auto-Fetched Player Stats (Visible only during Signup after verification) */}
                  {!isLoginMode && isUidVerified && (
                      <div className="bg-black/80 border border-white/5 p-4 rounded-2xl animate-fade-in flex items-center justify-between shadow-2xl relative overflow-hidden group">
                          <div className="absolute right-0 top-0 h-full w-24 bg-ff-success opacity-5 blur-3xl rounded-full"></div>
                          <div className="flex space-x-4 items-center z-10">
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <ChartBarIcon className="h-6 w-6 text-ff-success" />
                              </div>
                              <div>
                                  <p className="text-[9px] font-black text-ff-success uppercase tracking-[0.1em] mb-1">Authenticated Player</p>
                                  <div className="flex items-center space-x-3">
                                      <span className="text-xl font-black text-white tracking-tighter italic">{detectedPlayer.name}</span>
                                      <span className="bg-ff-orange/20 text-ff-orange px-2 py-0.5 rounded text-[10px] font-black border border-ff-orange/30">LVL {detectedPlayer.level}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="group">
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ml-1 transition ${(!isLoginMode && !isUidVerified) ? 'text-gray-700' : 'text-gray-400'}`}>Secure Password</label>
                    <div className="relative">
                      <KeyIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition ${(!isLoginMode && !isUidVerified) ? 'text-gray-800' : 'text-gray-500 group-focus-within:text-ff-orange'}`} />
                      <input type="password"
                        className={`w-full bg-black/40 border border-gray-700/50 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-ff-orange transition text-white font-mono text-lg shadow-inner disabled:opacity-30 disabled:cursor-not-allowed`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={!isLoginMode && !isUidVerified}
                      />
                    </div>
                  </div>
                  
                  {!isLoginMode && isUidVerified && (
                      <div className="bg-ff-orange/5 border border-ff-orange/20 p-4 rounded-xl flex items-start space-x-3">
                        <ShieldCheckIcon className="h-5 w-5 text-ff-orange shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                            Ready to register. All verified player details will be saved to your profile instantly.
                        </p>
                      </div>
                  )}

                  <button 
                    type="submit" 
                    className={`w-full bg-ff-orange text-white py-4.5 rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_4px_15px_rgba(255,107,53,0.3)] hover:opacity-90 active:scale-95 transition-all disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed uppercase`}
                    disabled={loading || (!isLoginMode && !isUidVerified)}
                  >
                    {loading ? 'Finalizing...' : (isLoginMode ? 'Login To Arena' : 'Finish Registration')}
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-24 relative z-10">
      <div className="bg-gray-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Profile Header */}
        <div className="h-64 bg-gray-800 border-b border-white/5 relative flex flex-col items-center justify-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ff-orange via-transparent to-transparent"></div>
            
            <div className="relative z-10 text-center">
                <div className="inline-block px-4 py-1.5 bg-ff-orange/20 border border-ff-orange/30 rounded-full text-[10px] font-black text-ff-orange uppercase tracking-[0.2em] mb-4">
                    Verified Elite Player
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl mb-2">
                    {user.inGameName}
                </h1>
                
                {user.isBanned && (
                    <div className="bg-red-600/90 backdrop-blur-md border border-red-400 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
                        Account Banned by Free Fire
                    </div>
                )}

                <div className="flex items-center justify-center space-x-4">
                    <p className="text-ff-orange font-mono font-black text-sm px-3 py-1 bg-black/40 rounded-lg border border-white/5">UID: {user.ffUid}</p>
                    <p className="text-white font-black text-sm px-3 py-1 bg-ff-orange/80 rounded-lg shadow-lg">LVL {user.level || '?'}</p>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8 md:p-12 space-y-12">
            <div>
                 <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 border-l-4 border-ff-orange pl-4 ml-2">Financial Snapshot</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/30 p-8 rounded-2xl border-b-4 border-green-500 text-center flex flex-col justify-between group hover:bg-black/40 transition">
                        <div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Available Balance</p>
                            <p className="text-4xl font-black text-white italic group-hover:scale-105 transition">₹{user.walletBalance}</p>
                        </div>
                        <button 
                            onClick={() => navigate('/wallet')}
                            className="mt-6 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95"
                        >
                            Manage Wallet
                        </button>
                    </div>
                    
                    <div className="bg-black/30 p-8 rounded-2xl border-b-4 border-ff-orange text-center flex flex-col justify-center hover:bg-black/40 transition">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Winnings</p>
                        <p className="text-4xl font-black text-white italic">₹{user.totalWinnings || 0}</p>
                        <p className="text-[9px] text-ff-orange font-bold uppercase mt-2 opacity-60">Career Earnings</p>
                    </div>

                    <div className="bg-black/30 p-8 rounded-2xl border-b-4 border-blue-500 text-center flex flex-col justify-center hover:bg-black/40 transition">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Role</p>
                        <p className="text-4xl font-black text-white uppercase italic">{user.role || 'Player'}</p>
                        <p className="text-[9px] text-blue-400 font-bold uppercase mt-2 opacity-60">Account Status</p>
                    </div>
                 </div>
            </div>

            {/* In-Game Combat Stats */}
            <div>
                 <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 border-l-4 border-blue-500 pl-4 ml-2">Combat Performance</h2>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="K/D Ratio" value={user.stats?.kdRatio || '0.00'} color="border-blue-500" />
                    <StatCard label="Matches" value={user.stats?.matchesPlayed || 0} color="border-purple-500" />
                    <StatCard label="Wins" value={user.stats?.wins || 0} color="border-ff-success" />
                    <StatCard label="Ranked" value={user.ffData?.basicInfo?.rankPoint || 'N/A'} color="border-red-500" />
                 </div>
            </div>

            {/* Official API Data Section */}
            {user.ffData && user.ffData.basicInfo && (
                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 animate-fade-in">
                    <div className="flex items-center space-x-3 mb-6">
                        <ChartBarIcon className="h-5 w-5 text-ff-orange" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Official Fire Services Info</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12">
                         <InfoItem label="Region" value={user.ffData.basicInfo.region || 'IND'} />
                         <InfoItem label="Honor Score" value={user.ffData.basicInfo.honorScore} />
                         <InfoItem label="EXP" value={user.ffData.basicInfo.exp} />
                         <InfoItem label="Create Time" value={user.ffData.basicInfo.createTime ? new Date(user.ffData.basicInfo.createTime * 1000).toLocaleDateString() : 'Active User'} />
                         
                         {/* Dynamic rendering for any additional basicInfo fields */}
                         {Object.entries(user.ffData.basicInfo).map(([key, value]) => {
                            const skip = ['nickname', 'level', 'region', 'honorScore', 'exp', 'createTime', 'rankPoint'];
                            if (skip.includes(key) || typeof value === 'object') return null;
                            return <InfoItem key={key} label={key.replace(/([A-Z])/g, ' $1').toUpperCase()} value={String(value)} />;
                        })}
                    </div>
                    
                    {/* Secondary Stats like Rank Information if available in other */}
                    {(user.other?.rankInfo || user.other?.basicInfo) && (
                         <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12">
                             <InfoItem label="Likes" value={user.other?.basicInfo?.liked} />
                             <InfoItem label="Credit Score" value={user.other?.creditScoreInfo?.creditScore} />
                             <InfoItem label="Season" value={user.other?.basicInfo?.seasonId} />
                             <InfoItem label="Version" value={user.other?.basicInfo?.releaseVersion} />
                         </div>
                    )}
                </div>
            )}

            {/* Additional Game Assets Section */}
            {user.other && (user.other.clanBasicInfo || user.other.socialInfo || user.other.petInfo) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    {/* Clan Info */}
                    {user.other.clanBasicInfo && (
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 group hover:bg-black/50 transition">
                            <div className="flex items-center space-x-3 mb-6">
                                <ShieldCheckIcon className="h-5 w-5 text-ff-success" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Clan Affiliation</h3>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black text-white italic">{user.other.clanBasicInfo.clanName}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">LVL {user.other.clanBasicInfo.clanLevel} • {user.other.clanBasicInfo.memberNum} Members</p>
                                </div>
                                <div className="h-12 w-12 bg-ff-success/10 border border-ff-success/20 rounded-xl flex items-center justify-center">
                                    <span className="text-ff-success font-black text-xl italic leading-none">C</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social/Signature */}
                    {user.other.socialInfo && (
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-8 group hover:bg-black/50 transition">
                            <div className="flex items-center space-x-3 mb-6">
                                <IdentificationIcon className="h-5 w-5 text-blue-400" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Player Signature</h3>
                            </div>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 min-h-[60px] flex items-center">
                                <p className="text-sm font-mono text-gray-300 italic">
                                    {user.other.socialInfo.signature || "No official signature set."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {!user.digiLockerVerified && (
            <div className="bg-blue-500/10 border-t border-blue-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
                        <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white font-black uppercase tracking-widest text-sm mb-1">Identity Verification Required</p>
                        <p className="text-gray-400 text-xs max-w-md text-left">Complete DigiLocker KYC to unlock cash withdrawals and participate in premium high-stakes tournaments.</p>
                    </div>
                </div>
                <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition shadow-[0_4px_15px_rgba(59,130,246,0.3)] shrink-0 active:scale-95">
                    Verify Identity Now
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
    <div className={`bg-black/30 p-8 rounded-2xl border-b-4 ${color} text-center hover:bg-black/40 transition group`}>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-black text-white italic group-hover:scale-105 transition">{value}</p>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-sm font-bold text-gray-200">{value}</p>
    </div>
);

export default Profile;
