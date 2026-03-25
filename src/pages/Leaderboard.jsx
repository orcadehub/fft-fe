import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/solid';

const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:4400/api/tournaments/leaderboard');
                setPlayers(res.data);
            } catch (err) {
                console.error('Leaderboard error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 relative min-h-screen">
            <div className="absolute top-0 right-0 w-96 h-96 bg-ff-orange/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>

            <div className="text-center mb-16 mt-20 md:mt-0">
                <div className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md px-6 py-2 rounded-full border border-ff-orange/30 shadow-[0_0_20px_rgba(255,107,53,0.1)] mb-6">
                    <TrophyIcon className="h-5 w-5 text-ff-orange" />
                    <span className="text-ff-orange font-black uppercase tracking-[0.2em] text-xs">Hall of Eternal Fame</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-widest leading-none drop-shadow-2xl">
                    Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-ff-orange to-orange-500">Legends</span>
                </h1>
                <p className="text-gray-500 mt-6 font-bold uppercase tracking-widest text-sm">Top 100 Players by Battle Earnings</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-ff-orange/20 border-t-ff-orange rounded-full animate-spin"></div>
                        <FireIcon className="h-10 w-10 text-ff-orange absolute top-5 left-5 animate-pulse" />
                    </div>
                </div>
            ) : players.length > 0 ? (
                <div className="bg-gray-800/20 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="overflow-x-auto overflow-y-hidden">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-gray-900/50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-700/50">
                                    <th className="px-8 py-6 text-center w-24">Rank</th>
                                    <th className="px-8 py-6">Warrior Name</th>
                                    <th className="px-8 py-6 text-center">Earnings</th>
                                    <th className="px-8 py-6 text-center">K/D Rate</th>
                                    <th className="px-8 py-6 text-center">Arena Wins</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((p, index) => (
                                    <tr 
                                        key={index} 
                                        className={`group transition-all duration-300 border-b border-gray-800/30 hover:bg-white/5 ${index < 3 ? 'bg-ff-orange/5' : ''}`}
                                    >
                                        <td className="px-8 py-6 text-center">
                                            {index === 0 ? (
                                                <div className="w-10 h-10 bg-yellow-400 rounded-lg mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] rotate-3 group-hover:rotate-0 transition-transform">
                                                    <StarIcon className="h-6 w-6 text-gray-900" />
                                                </div>
                                            ) : index === 1 ? (
                                                <div className="w-9 h-9 bg-gray-300 rounded-lg mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(209,213,219,0.3)] rotate-3 group-hover:rotate-0 transition-transform">
                                                    <StarIcon className="h-5 w-5 text-gray-900" />
                                                </div>
                                            ) : index === 2 ? (
                                                <div className="w-8 h-8 bg-orange-400/80 rounded-lg mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(251,146,60,0.3)] rotate-3 group-hover:rotate-0 transition-transform">
                                                    <StarIcon className="h-4 w-4 text-gray-900" />
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 font-mono font-bold text-lg">#{index + 1}</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-black text-lg tracking-wide uppercase group-hover:text-ff-orange transition-colors">
                                                    {p.inGameName}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-mono tracking-widest">{p.ffUid}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-2xl font-black text-ff-success filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                                ₹{p.totalWinnings.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="bg-gray-900/50 rounded-lg px-4 py-1.5 inline-block border border-gray-700/50">
                                                <span className="text-white font-black text-sm">{p.stats?.kdRatio || '0.00'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-white font-black text-lg">{p.stats?.wins || 0}</span>
                                                <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Booyahs</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 opacity-30">
                    <TrophyIcon className="h-32 w-32 mx-auto mb-6 grayscale" />
                    <p className="font-black uppercase tracking-widest text-2xl text-white">The arena is empty</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
