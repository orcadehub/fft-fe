import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FireIcon, UserGroupIcon, UserIcon, UsersIcon, ClockIcon, PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import TournamentCard from '../components/TournamentCard';
import api from '../services/api';

import ffHeroBg1 from '../assets/fflogo1.jpg';
import ffHeroBg2 from '../assets/fflogo2.jpg';
import ffHeroBg3 from '../assets/fflogo3.jpg';

const backgrounds = [ffHeroBg3, ffHeroBg1, ffHeroBg2];

const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'classic'; // default to classic
    const [teamSize, setTeamSize] = useState('1v1');
    const [enrolledStatus, setEnrolledStatus] = useState('Upcoming'); // Upcoming, Live, Completed
    const [tournaments, setTournaments] = useState([]);
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                if (mode === 'enrolled') {
                    if (!token) {
                        setTournaments([]);
                        return;
                    }
                    const res = await api.get('/api/ff/tournaments/enrolled');
                    const filtered = res.data.filter(t => t.status === enrolledStatus);
                    setTournaments(filtered);
                } else {
                    const res = await api.get('/api/ff/tournaments/live');
                    const filtered = res.data.filter(t => {
                        const matchedMode = (mode === 'clashsquad' ? 'Clash Squad' : 'Classic');
                        return t.gameMode === matchedMode && t.teamSize === teamSize;
                    });
                    setTournaments(filtered);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, [mode, teamSize, enrolledStatus, token]);

    const teamOptions = [
        { id: '1v1', label: '1 vs 1', icon: <UserIcon className="h-5 w-5" /> },
        { id: '2v2', label: '2 vs 2', icon: <UserGroupIcon className="h-5 w-5" /> },
        { id: '4v4', label: '4 vs 4', icon: <UsersIcon className="h-5 w-5" /> },
    ];

    const enrolledOptions = [
        { id: 'Upcoming', label: 'Upcoming', icon: <ClockIcon className="h-5 w-5" /> },
        { id: 'Live', label: 'Active', icon: <PlayCircleIcon className="h-5 w-5" /> },
        { id: 'Completed', label: 'Completed', icon: <CheckCircleIcon className="h-5 w-5" /> },
    ];

    return (
        <div className="relative w-full min-h-screen">
            {/* Dynamic Background */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-top bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
            ></div>
            <div className="fixed inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95 z-0"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        {mode !== 'enrolled' && (
                            <div className="flex items-center space-x-2 mb-2">
                               <span className="h-1 w-8 bg-ff-orange rounded-full"></span>
                               <span className="text-ff-orange font-black uppercase tracking-tighter text-xs">Active Matchmaking</span>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-widest border-l-8 border-ff-orange pl-6 drop-shadow-lg leading-none">
                            {mode === 'enrolled' ? 'Enrolled' : (mode === 'clashsquad' ? 'Clash Squad' : 'Classic Mode')}
                        </h1>
                    </div>

                    {/* Filters Button Group */}
                    <div className={`bg-black/60 backdrop-blur-xl p-1 rounded-2xl border border-white/10 flex items-center shadow-2xl w-full overflow-x-auto scrollbar-hide ${mode === 'enrolled' ? 'md:w-[600px]' : 'md:w-auto'}`}>
                        {mode === 'enrolled' ? (
                            enrolledOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setEnrolledStatus(opt.id)}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-4 md:px-8 py-3.5 rounded-xl font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                                        enrolledStatus === opt.id 
                                        ? 'bg-gradient-to-r from-ff-orange to-orange-500 text-white shadow-[0_0_20px_rgba(255,107,53,0.4)] z-10' 
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <span className={enrolledStatus === opt.id ? 'text-white' : 'text-gray-600'}>{opt.icon}</span>
                                    <span className="text-sm md:text-base">{opt.label}</span>
                                </button>
                            ))
                        ) : (
                            teamOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTeamSize(opt.id)}
                                    className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 md:px-8 py-3.5 rounded-xl font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                                        teamSize === opt.id 
                                        ? 'bg-gradient-to-r from-ff-orange to-orange-500 text-white shadow-[0_0_20px_rgba(255,107,53,0.4)] z-10' 
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <span className={teamSize === opt.id ? 'text-white' : 'text-gray-600'}>{opt.icon}</span>
                                    <span className="text-sm md:text-base">{opt.label}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${mode}-${teamSize}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {loading ? (
                            <div className="col-span-full py-20 text-center">
                                <FireIcon className="h-16 w-16 text-ff-orange mx-auto animate-pulse" />
                                <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest">Scanning Battlefields...</p>
                            </div>
                        ) : tournaments.length > 0 ? (
                            tournaments.map((t) => (
                                <TournamentCard key={t._id} tournament={t} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 bg-gray-800/20 backdrop-blur-sm rounded-3xl border border-white/5 text-center">
                                <FireIcon className="h-20 w-20 mx-auto mb-6 opacity-10 text-white" />
                                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
                                    {mode === 'enrolled' ? 'No Enrolled Matches Found' : `No ${teamSize} Matches Found`}
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    {mode === 'enrolled' ? "You haven't joined any active tournaments yet." : "Check back later or try a different game mode."}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Dashboard;
