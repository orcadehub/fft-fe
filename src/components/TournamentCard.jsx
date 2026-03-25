import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, CurrencyRupeeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const TournamentCard = ({ tournament }) => {
  const { user } = useAuth();
  const isLive = tournament.status === 'Live';
  const isFull = tournament.players && tournament.players.length >= tournament.maxPlayers;
  const hasJoined = user && tournament.players && tournament.players.some(p => p.user === user._id || p.user?._id === user._id);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeRemainingMs = new Date(tournament.startTime) - currentTime;

  const formatTimer = (ms) => {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  
  return (
    <div className={`bg-gray-800 border ${hasJoined ? 'border-ff-success/30 ring-1 ring-ff-success/10' : 'border-gray-700'} rounded-xl overflow-hidden hover:border-ff-orange transition group shadow-lg flex flex-col h-full relative`}>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-0"></div>
      
      {/* Header Image Area / Status */}
      <div className="h-32 bg-gray-700 relative z-10 p-4 flex flex-col justify-between">
        <div className="absolute inset-0 bg-ff-dark-blue opacity-30"></div>
        <div className="flex justify-between items-start relative z-20">
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-ff-orange text-white'}`}>
              {tournament.status}
            </span>
            {isFull && !hasJoined && (
              <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gray-600 text-gray-200 border border-white/10">
                FULL
              </span>
            )}
            {hasJoined && (
              <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-ff-success text-white shadow-lg">
                JOINED
              </span>
            )}
          </div>
          <span className="bg-black bg-opacity-60 px-2 py-1 rounded text-xs font-semibold text-gray-300 backdrop-blur-sm shadow-sm border border-gray-600">
            Lvl {tournament.levelReq}+
          </span>
        </div>
        <div className="flex items-end justify-between relative z-20">
          <h3 className="text-2xl font-black uppercase text-white shadow-sm drop-shadow-md">
            {tournament.gameMode}
          </h3>
          <span className="bg-ff-orange/20 text-ff-orange border border-ff-orange/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            {tournament.teamSize}
          </span>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-5 flex-grow relative z-10 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-400 text-xs mb-1 uppercase font-bold tracking-wider">Entry Fee</div>
            <div className="text-ff-success font-black text-lg flex items-center">
              {tournament.entryFee > 0 ? (
                <>
                  <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
                  {tournament.entryFee / (tournament.teamSize === '1v1' ? 1 : (tournament.teamSize === '2v2' ? 2 : 4))}
                </>
              ) : (
                <span className="text-ff-orange">FREE</span>
              )}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-400 text-xs mb-1 uppercase font-bold tracking-wider">Prize Pool</div>
            <div className="text-white font-black text-lg flex items-center">
              <CurrencyRupeeIcon className="h-5 w-5 mr-1 text-ff-orange" />
              {tournament.prizePool || 0}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mb-6 flex-grow">
          <div className="flex items-center text-gray-300">
            <UsersIcon className="h-5 w-5 mr-3 text-gray-500" />
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>{tournament.entryFee === 0 ? 'Reg. Cap' : 'Players'}</span>
                <span className="font-bold">{tournament.players ? tournament.players.length : 0} / {tournament.maxPlayers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${isFull ? 'bg-gray-500' : 'bg-ff-orange'}`} 
                  style={{ width: `${Math.min(100, ((tournament.players ? tournament.players.length : 0) / tournament.maxPlayers) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center text-gray-300">
            <ClockIcon className="h-5 w-5 mr-3 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {new Date(tournament.startTime).toLocaleDateString('en-GB')}, {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${timeRemainingMs <= 10 * 60 * 1000 && timeRemainingMs > 0 ? 'text-red-500 animate-pulse' : 'text-ff-orange'}`}>
                {timeRemainingMs > 0 ? `Starts In: ${formatTimer(timeRemainingMs)}` : 'Match Started / Ended'}
              </span>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/tournament/${tournament._id}`} 
          className={`mt-auto block w-full text-center py-3 font-bold rounded-lg transition ${
            hasJoined ? 'bg-ff-success hover:bg-green-600 text-white' : 
            isFull ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 
            'bg-gray-700 hover:bg-ff-gradient text-white'
          }`}
        >
          {hasJoined ? 'View Match Room' : isFull ? 'Tournament Full' : 'View details'}
        </Link>
      </div>
    </div>
  );
};

export default TournamentCard;
