import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CheckBadgeIcon, ShieldCheckIcon, KeyIcon, IdentificationIcon, MagnifyingGlassIcon, ChartBarIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import WalletModal from '../components/WalletModal';
import { toast } from 'react-toastify';

import ffHeroBg1 from '../assets/fflogo1.jpg';
import ffHeroBg2 from '../assets/fflogo2.jpg';
import ffHeroBg3 from '../assets/fflogo3.jpg';

const backgrounds = [ffHeroBg3, ffHeroBg1, ffHeroBg2];

import { GoogleLogin } from '@react-oauth/google';

const skillNames = {
    // Active Skills
    606: "Drop the Beat (Alok)",
    7606: "Time Turner (Chrono)",
    4306: "Master of All (K)",
    6201: "Riptide Rhythm (Skyler)",
    1101: "Senses Shock (Homer)",
    306: "Xtreme Encounter (Xayne)",
    
    // Passive Skills
    7106: "Sustained Raids (Jota)",
    1305: "Maniac (D-Bee)",
    2104: "Limelight (Wolfrahh)",
    906: "Bushido (Hayato)",
    1006: "Gluttony (Maxim)",
    1206: "Agility (Kelly)",
    
    // Default fallback list grows as more are discovered
};

const getSkillName = (id) => skillNames[id] || `Tactical Skill ${id}`;

const Profile = () => {
  const { user, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (user) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [user]);

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    const result = await googleLogin(response.credential);
    setLoading(false);
    
    if (result.success) {
      toast.success('Signed in successfully!');
      // After login, stay on profile to complete FF UID if needed
    } else {
      toast.error(result.error || 'Google sign-in failed');
    }
  };

  const [newFfUid, setNewFfUid] = useState('');
  const [isUpdatingUid, setIsUpdatingUid] = useState(false);

  const handleUpdateUid = async () => {
    if (!newFfUid) return toast.warn('Enter your Free Fire UID');
    setIsUpdatingUid(true);
    try {
      const res = await api.post('/api/ff/auth/update-uid', { ffUid: newFfUid });
      if (res.data.success) {
         toast.success('Free Fire UID Linked!');
         window.location.reload(); // Refresh to update user info in AuthContext
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Link failed');
    } finally {
      setIsUpdatingUid(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Do you want to disconnect your Free Fire account? This will hide your game stats.')) return;
    try {
      const res = await api.post('/api/ff/auth/disconnect');
      if (res.data.success) {
        toast.info('Account disconnected');
        window.location.reload();
      }
    } catch (err) {
      toast.error('Failed to disconnect');
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
          <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,107,53,0.15)] p-10 overflow-hidden relative text-center">
            
            <div className="mb-10">
              <div className="w-20 h-20 bg-ff-orange rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-[0_0_30px_rgba(255,107,53,0.4)]">
                <span className="text-white font-black text-4xl italic">FF</span>
              </div>
              <h1 className="text-4xl font-black uppercase text-white tracking-tight leading-none">
                Gamer Portal
              </h1>
              <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">
                Sign in to join the ultimate arena
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-full flex justify-center transform scale-110">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error('Google login failed')}
                        theme="filled_blue"
                        shape="pill"
                        size="large"
                        text="continue_with"
                    />
                </div>
                
                {loading && (
                    <div className="flex items-center space-x-2 text-ff-orange animate-pulse">
                        <div className="w-2 h-2 bg-ff-orange rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-ff-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-ff-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest ml-2">Authenticating...</span>
                    </div>
                )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    By continuing, you agree to our <br/> 
                    <a href="/terms" className="text-ff-orange hover:underline">Terms of Service</a> & <a href="/privacy" className="text-ff-orange hover:underline">Privacy Policy</a>
                </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 relative z-10">
      <div className="space-y-8">
        
        {/* Dynamic Header - Stats Cards Block */}
        {user.ffUid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {/* Game Name Card */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                    <UserCircleIcon className="h-20 w-20 text-white" />
                </div>
                <p className="text-[10px] font-black text-ff-orange uppercase tracking-[0.2em] mb-3">Professional Nickname</p>
                <h2 className="text-2xl font-black text-white italic truncate tracking-tighter">{user.inGameName}</h2>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{user.ffData?.basicInfo?.region || 'IND'} Region</span>
                    {user.isBanned && <span className="text-red-500 text-[10px] font-black animate-pulse uppercase">Banned</span>}
                </div>
            </div>

            {/* Level Card */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Player Level</p>
                <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-white italic">{user.level || 0}</span>
                    <span className="text-blue-500/50 font-black text-sm uppercase">EXP {user.ffData?.basicInfo?.exp || '0'}</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(user.level / 100) * 100}%` }}></div>
                </div>
            </div>

            {/* Likes Card */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <p className="text-[10px] font-black text-ff-success uppercase tracking-[0.2em] mb-3">Popularity Status</p>
                <div className="flex items-center space-x-3">
                    <span className="text-5xl font-black text-white italic">{user.ffData?.basicInfo?.liked || 0}</span>
                    <div className="bg-ff-success/10 p-2 rounded-lg border border-ff-success/20">
                        <CheckBadgeIcon className="h-5 w-5 text-ff-success" />
                    </div>
                </div>
                <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Community Recommendations</p>
            </div>

            {/* UID Card with Disconnect */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Game Identity</p>
                    <button 
                        onClick={handleDisconnect}
                        className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition"
                        title="Disconnect Account"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-widest font-mono">{user.ffUid}</h2>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-ff-success rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Live Global Sync</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl border border-ff-orange/30 p-12 text-center shadow-[0_0_50px_rgba(255,107,53,0.1)]">
                <IdentificationIcon className="h-16 w-16 text-ff-orange mx-auto mb-6 opacity-30" />
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Connect Your Profile</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-8 max-w-sm mx-auto leading-relaxed">
                    Link your Free Fire UID to unlock advanced combat metrics and participate in elite tournaments.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                     <input 
                        type="text" 
                        value={newFfUid}
                        onChange={(e) => setNewFfUid(e.target.value)}
                        placeholder="ENTER 8-10 DIGIT UID"
                        className="bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-center tracking-[0.3em] focus:outline-none focus:border-ff-orange transition w-full shadow-2xl"
                     />
                     <button 
                        onClick={handleUpdateUid}
                        disabled={isUpdatingUid}
                        className="w-full sm:w-auto bg-ff-orange hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition active:scale-95 disabled:opacity-50"
                     >
                        {isUpdatingUid ? 'Syncing...' : 'Connect'}
                     </button>
                </div>
             </div>
          </div>
        )}

        {/* Detailed Stats Block */}
        {user.ffUid && (
          <div className="space-y-8 animate-fade-in-up">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Financial & Game Info */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Sub Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <MiniStat label="Rank Points" value={user.ffData?.basicInfo?.rankingPoints || '1500+'} color="text-ff-orange" />
                          <MiniStat label="Credit Score" value={user.ffData?.creditScoreInfo?.creditScore || '100'} color="text-ff-success" />
                          <MiniStat label="Season ID" value={user.ffData?.basicInfo?.seasonId || '50'} color="text-blue-400" />
                          <MiniStat label="K/D Ratio" value={user.stats?.kdRatio || '0.00'} color="text-purple-400" />
                      </div>

                      {/* Main Financial Card */}
                      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                          <div>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Arena Wallet</p>
                              <h3 className="text-5xl font-black text-white italic">₹{user.walletBalance}</h3>
                              <p className="text-gray-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Total Earnings: ₹{user.totalWinnings || 0}</p>
                          </div>
                          <button 
                            onClick={() => navigate('/wallet')}
                            className="mt-6 md:mt-0 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ff-orange hover:text-white transition-all shadow-xl active:scale-95"
                          >
                            Manage Funds
                          </button>
                      </div>

                      {/* Official API Metadata Section */}
                      <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-8">
                          <div className="flex items-center space-x-3 mb-8">
                              <ChartBarIcon className="h-5 w-5 text-ff-orange" />
                              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Game Account Metadata</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
                               <InfoItem label="Account ID" value={user.ffData?.basicInfo?.accountId} />
                               <InfoItem label="Release Version" value={user.ffData?.basicInfo?.releaseVersion} />
                               <InfoItem label="Create At" value={user.ffData?.basicInfo?.createAt ? new Date(user.ffData.basicInfo.createAt * 1000).toLocaleDateString() : 'N/A'} />
                               <InfoItem label="Honor Score" value={user.ffData?.basicInfo?.honorScore || '100'} />
                               {/* Loop additional fields */}
                               <InfoItem label="CS Rank Points" value={user.ffData?.basicInfo?.csRankingPoints} />
                               <InfoItem label="BR Max Rank" value={user.ffData?.basicInfo?.maxRank} />
                               <InfoItem label="CS Max Rank" value={user.ffData?.basicInfo?.csMaxRank} />
                               <InfoItem label="Diamond Cost" value={user.ffData?.diamondCostRes?.diamondCost || '0'} />
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Social & Assets */}
                  <div className="space-y-8">
                      {/* Pet Info */}
                      {user.ffData?.petInfo && (
                          <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group">
                              <div className="flex items-center space-x-3 mb-6">
                                  <ShieldCheckIcon className="h-5 w-5 text-ff-orange" />
                                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Companion</h3>
                              </div>
                              <div className="flex items-center space-x-6">
                                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition">
                                      <span className="text-2xl opacity-50">🐾</span>
                                  </div>
                                  <div>
                                      <p className="text-xl font-black text-white italic">LVL {user.ffData.petInfo.level}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">PET ID: {user.ffData.petInfo.id}</p>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Clan Info */}
                      <div className="bg-gray-900 border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <ShieldCheckIcon className="h-5 w-5 text-ff-success" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Guild Affiliation</h3>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic">{user.ffData?.clanBasicInfo?.clanName || 'NO GUILD'}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    {user.ffData?.clanBasicInfo?.clanLevel ? `LVL ${user.ffData.clanBasicInfo.clanLevel} • Verified Global` : 'Loner Status'}
                                </p>
                            </div>
                      </div>

                      {/* Social Signature */}
                      <div className="bg-gray-900 border border-white/10 rounded-3xl p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <IdentificationIcon className="h-5 w-5 text-blue-400" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Player Motto</h3>
                            </div>
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 italic text-sm text-gray-300 font-medium">
                                "{user.ffData?.socialInfo?.signature || "I love free fire"}"
                            </div>
                      </div>

                      {/* Profile Skills */}
                      {user.ffData?.profileInfo?.equipedSkills && (
                          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8">
                             <div className="flex items-center space-x-3 mb-6">
                                <KeyIcon className="h-5 w-5 text-purple-400" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Tactical Loadout</h3>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {user.ffData.profileInfo.equipedSkills.map((skill, i) => (
                                    <span key={i} className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                        {getSkillName(skill.skillId)}
                                    </span>
                                ))}
                             </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Account Status Flags (Bottom) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/5">
                   <StatusFlag label="Show BR Rank" active={user.ffData?.basicInfo?.showBrRank} />
                   <StatusFlag label="Show CS Rank" active={user.ffData?.basicInfo?.showCsRank} />
                   <StatusFlag label="KYC Verified" active={user.digiLockerVerified} />
                   <StatusFlag label="Wallet Linked" active={!!user.walletBalance} />
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => (
    <div className="bg-gray-900/50 border border-white/5 p-4 rounded-2xl text-center hover:bg-white/5 transition">
        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-black italic tracking-tighter ${color}`}>{value || 'N/A'}</p>
    </div>
);

const StatusFlag = ({ label, active }) => (
    <div className="flex items-center space-x-3 bg-black/20 px-4 py-3 rounded-xl border border-white/5">
        <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-ff-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-sm font-bold text-gray-200">{value || '---'}</p>
    </div>
);

export default Profile;
