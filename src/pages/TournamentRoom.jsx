import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import api, { API_BASE_URL } from '../services/api';
import { UsersIcon, TrophyIcon, ShieldCheckIcon, FireIcon } from '@heroicons/react/24/solid';
import WalletModal from '../components/WalletModal';
import JoinConfirmationModal from '../components/JoinConfirmationModal';
import { toast } from 'react-toastify';

const TournamentRoom = () => {
  const { id } = useParams();
  const { user, token, updateUserWallet } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [missingAmount, setMissingAmount] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await api.get(`/api/ff/tournaments/${id}`);
        setTournament(res.data);
      } catch (err) {
        toast.error('Failed to load tournament');
      }
    };
    fetchTournament();

    socket.emit('join_tournament', id);
    
    const handlePlayerJoined = (players) => {
      setTournament(prev => prev ? { ...prev, players } : null);
    };

    const handleLeaderboardUpdate = (data) => {
      fetchTournament();
    };

    socket.on('player_joined', handlePlayerJoined);
    socket.on('leaderboard_update', handleLeaderboardUpdate);

    return () => {
      socket.off('player_joined', handlePlayerJoined);
      socket.off('leaderboard_update', handleLeaderboardUpdate);
    };
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);

    
    try {
      // Direct Join via Wallet
      const res = await api.post(`/api/ff/tournaments/${id}/join`);

      if (res.data.tournament) {
        setTournament(res.data.tournament);
        if (updateUserWallet) {
          updateUserWallet(res.data.walletBalance);
        }
        toast.success('Joined successfully! Good luck.');
      }
      setIsJoinModalOpen(false);
    } catch (err) {
      const data = err.response?.data;
      setIsJoinModalOpen(false);
      if (data?.requiresRecharge) {
        setMissingAmount(data.missingAmount);
        setIsWalletModalOpen(true);
      } else {
        toast.error(data?.error || 'Failed to join tournament');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tournament) return <div className="p-10 text-center text-gray-500 text-xl font-bold animate-pulse">Loading Room...</div>;

  const hasJoined = user && tournament.players.some(p => p.user._id === user._id || p.user === user._id);
  
  // Prize calculation based on per-player entry fee
  const playerMultiplier = tournament.teamSize === '1v1' ? 1 : (tournament.teamSize === '2v2' ? 2 : 4);
  const perPlayerFee = tournament.entryFee / playerMultiplier;
  const currentPool = Math.floor((tournament.players.length * perPlayerFee) * 0.8);
  const displayPrizePool = tournament.prizePool || 0;

  const timeRemainingMs = new Date(tournament.startTime) - currentTime;
  const isRegistrationClosed = timeRemainingMs <= 2 * 60 * 1000;
  const isRoomVisible = timeRemainingMs <= 5 * 60 * 1000 && timeRemainingMs > 2 * 60 * 1000;

  const formatTimer = (ms) => {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJoinClick = () => {
    if (!user) {
      toast.info('Please login to join tournaments');
      return;
    }
    if (user.walletBalance < perPlayerFee) {
      setMissingAmount(perPlayerFee - user.walletBalance);
      setIsWalletModalOpen(true);
      return;
    }
    setIsJoinModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Instagram Story Notice - Free Rooms Only */}
      {tournament.entryFee === 0 && (
        <a 
          href="https://www.instagram.com/ff.tourney" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-orange-900/30 border border-pink-500/20 rounded-xl p-4 mb-6 hover:border-pink-500/40 transition-all group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-xs uppercase tracking-widest">Room ID & Password</p>
              <p className="text-gray-400 text-[11px] font-medium mt-0.5">Will be shared on our <span className="text-pink-400 font-bold">Instagram Story</span> <span className="text-pink-300 font-black">@ff.tourney</span> before match time</p>
            </div>
            <span className="text-pink-400 text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </a>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl relative">
            <div className="w-full bg-gray-900 border-b border-gray-700 flex flex-col items-center justify-center py-10 px-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-ff-dark-blue opacity-10"></div>
               <h1 className="text-3xl font-black uppercase text-white shadow-sm mt-4 tracking-wider z-10">{tournament.gameMode}</h1>
               <div className="mt-2 flex items-center bg-gray-900 border border-ff-orange/30 px-4 py-1.5 rounded-full z-10 shadow-lg mb-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-3">Starts In</span>
                  <span className={`font-mono font-black tracking-widest text-lg ${timeRemainingMs <= 10 * 60 * 1000 ? 'text-red-500 animate-pulse' : 'text-ff-orange'}`}>{formatTimer(timeRemainingMs)}</span>
               </div>
               <div className="mt-2 flex flex-col items-center z-10 w-full">
                  <div className="text-ff-success font-black text-3xl filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">₹{displayPrizePool}</div>
                  <div className="text-white text-[10px] uppercase font-black tracking-widest mt-1 bg-ff-success/20 px-4 py-1 rounded-full border border-ff-success/30">Max Potential Winnings</div>
                  
                  <div className="mt-8 mb-4 w-full grid grid-cols-2 px-6 text-center">
                     <div className="border-r border-white/10">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 leading-none">Joined Pool</p>
                        <p className="text-2xl font-black text-ff-success">₹{currentPool}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 leading-none">Entry Per Pl.</p>
                        <p className="text-2xl font-black text-white">₹{perPlayerFee}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400 uppercase font-bold text-sm tracking-wide">Entry Fee</span>
                  <span className={tournament.entryFee === 0 ? 'text-ff-orange font-black' : 'text-white font-black'}>
                    {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400 uppercase font-bold text-sm tracking-wide">Start Time</span>
                  <span className="text-white font-bold">
                    {new Date(tournament.startTime).toLocaleDateString('en-GB')}, {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400 uppercase font-bold text-sm tracking-wide">Min Level</span>
                  <span className="text-white font-black">{tournament.levelReq}+</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400 uppercase font-bold text-sm tracking-wide">Status</span>
                  <span className={tournament.status === 'Live' ? 'text-red-500 font-black animate-pulse' : 'text-ff-orange font-bold uppercase'}>{tournament.status}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-gray-400 uppercase font-bold text-sm tracking-wide">Players</span>
                  <span className="text-white font-bold flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                    {tournament.players.length} / {tournament.maxPlayers}
                  </span>
                </div>
              </div>

              {/* Reward Structure Section */}
              <div className="bg-black/40 rounded-xl p-5 border border-white/5 mb-6">
                <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4 flex items-center">
                  <TrophyIcon className="h-3 w-3 mr-2 text-ff-orange" /> Reward Structure
                </h3>
                {tournament.entryFee === 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold">1st Place (BOOYAH)</span>
                      <span className="text-ff-success font-black">₹{Math.floor(displayPrizePool * 0.5)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-bold italic">2nd Runner Up</span>
                      <span className="text-white font-bold opacity-80">₹{Math.floor(displayPrizePool * 0.3)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500 font-bold italic">3rd Place</span>
                      <span className="text-white font-bold opacity-60">₹{Math.floor(displayPrizePool * 0.2)}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-gray-600 font-black uppercase tracking-widest text-center leading-relaxed">
                      *Sponsored Free Tournament Distribution*
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-ff-success/5 p-3 rounded-lg border border-ff-success/10">
                       <div className="flex flex-col">
                          <span className="text-[10px] text-ff-success font-black uppercase tracking-widest mb-1">Per Kill Prize</span>
                          <span className="text-2xl font-black text-white italic tracking-tighter">₹{Math.floor((displayPrizePool) / (tournament.maxPlayers - 1))}</span>
                       </div>
                       <FireIcon className="h-8 w-8 text-ff-orange opacity-40" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed text-center px-2">
                       Platform Fee (20%) Removed. Remaining Amount Distributed Per Kill to All Brave Fighters.
                    </p>
                  </div>
                )}
              </div>


              {hasJoined ? (
                <div className="bg-ff-success/10 border border-ff-success/20 rounded-xl p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-ff-success opacity-5 rotate-45 translate-x-6 -translate-y-6"></div>
                  <ShieldCheckIcon className="h-10 w-10 text-ff-success mx-auto mb-2 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]" />
                  <h3 className="text-white font-bold text-base uppercase tracking-tight mb-3">Room Access Active</h3>
                  
                  <div className="space-y-2">
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 flex items-center justify-between px-4 group/code cursor-pointer hover:bg-black transition">
                      <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider">ROOM ID</span>
                      <p className="text-ff-success font-mono text-xl tracking-tight truncate ml-4 font-black">{tournament.roomCode}</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 flex items-center justify-between px-4 group/pass cursor-pointer hover:bg-black transition">
                      <span className="text-gray-400 text-[9px] font-black uppercase tracking-wider">PASS</span>
                      <p className="text-white font-mono text-xl tracking-widest ml-4 font-black">{tournament.password}</p>
                    </div>
                    {isRoomVisible ? (
                      <p className="mt-3 text-[9px] text-ff-success font-black uppercase tracking-[0.3em] animate-pulse">Match Sync Active</p>
                    ) : timeRemainingMs <= 0 ? (
                      <p className="mt-3 text-[9px] text-red-500 font-black uppercase tracking-[0.3em] animate-pulse">In Progress</p>
                    ) : (
                      <p className="mt-3 text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">Credentials Secured</p>
                    )}
                  </div>
                </div>
              ) : isRegistrationClosed ? (
                <div className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-center text-xl bg-gray-700 text-gray-400 border border-gray-600">
                  Registration Closed
                </div>
              ) : tournament.players.length >= tournament.maxPlayers ? (
                <div className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-center text-xl bg-gray-700 text-gray-500 border border-gray-600">
                  Room is Full
                </div>
              ) : (
                <button 
                  onClick={handleJoinClick}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xl transition bg-ff-gradient text-white hover:shadow-[0_0_20px_rgba(255,107,53,0.6)] transform hover:-translate-y-1"
                >
                  {loading ? 'Processing...' : `Join for ₹${perPlayerFee}`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-ff-orange opacity-5"></div>
              <h2 className="text-2xl font-black uppercase text-white tracking-widest flex items-center z-10">
                <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
                Live Leaderboard
              </h2>
            </div>
            
            <div className="p-0">
              {tournament.players.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-black w-16 text-center">#</th>
                        <th className="p-4 font-black">Player</th>
                        <th className="p-4 font-black text-center">Kills</th>
                        <th className="p-4 font-black text-center text-ff-success">Prize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.players.sort((a,b) => b.kills - a.kills || a.rank - b.rank).map((p, index) => (
                        <tr key={index} className={`border-b border-gray-800 hover:bg-gray-750 transition ${hasJoined && user.ffUid === p.ffUid ? 'bg-gray-800 bg-opacity-80 border-l-4 border-l-ff-orange' : ''}`}>
                          <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                          <td className="p-4">
                            <div className="font-bold text-white mb-1">{p.inGameName}</div>
                            <div className="text-xs text-gray-500 font-mono">{p.ffUid}</div>
                          </td>
                          <td className="p-4 text-center font-black text-lg text-white">{p.kills}</td>
                          <td className="p-4 text-center font-bold text-ff-success text-lg">₹{p.prizeWon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <UsersIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">Waiting for players to join</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        requiredAmount={missingAmount}
        onRechargeSuccess={(newBalance) => {
          setIsWalletModalOpen(false);
          // Success message or automatic join attempt could go here
        }}
      />
      
      {user && (
        <JoinConfirmationModal 
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onConfirm={handleJoin}
          entryFee={perPlayerFee}
          walletBalance={user.walletBalance}
        />
      )}
    </div>
  );
};

export default TournamentRoom;
