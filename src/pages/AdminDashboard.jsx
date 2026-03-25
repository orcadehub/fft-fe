import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon, UserGroupIcon, UserIcon, UsersIcon, ClockIcon, PlayCircleIcon, 
  CheckCircleIcon, PlusCircleIcon, TrashIcon, PencilSquareIcon 
} from '@heroicons/react/24/solid';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

import ffHeroBg1 from '../assets/fflogo1.jpg';
import ffHeroBg2 from '../assets/fflogo2.jpg';
import ffHeroBg3 from '../assets/fflogo3.jpg';

const backgrounds = [ffHeroBg3, ffHeroBg1, ffHeroBg2];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'classic'; // default to classic
    const [teamSize, setTeamSize] = useState('1v1');
    const [tournaments, setTournaments] = useState([]);
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState('Classic');
    const [createTeamSize, setCreateTeamSize] = useState('1v1');
    const [createEntryFee, setCreateEntryFee] = useState(10);
    const [createMaxPlayers, setCreateMaxPlayers] = useState(48);
    const [createPrizePool, setCreatePrizePool] = useState(0);
    const [createStartTime, setCreateStartTime] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        const pad = (n) => String(n).padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    });

    const getMinDateTime = () => {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };

    const generateRoomNamePreview = () => {
        const dt = createStartTime ? new Date(createStartTime) : new Date();
        const ddmmyyyy = String(dt.getDate()).padStart(2, '0') + 
                         String(dt.getMonth() + 1).padStart(2, '0') + 
                         dt.getFullYear();
        const xx = createMode === 'Classic' ? 'CL' : 'CS';
        const z = createTeamSize === '1v1' ? '1' : createTeamSize === '2v2' ? '2' : '4';
        return `FFT_${ddmmyyyy}_${xx}${z}_XX`;
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);
    const [editForm, setEditForm] = useState({
        roomCode: '',
        password: '',
        status: '',
        entryFee: 0,
        startTime: ''
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingTournamentId, setDeletingTournamentId] = useState(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/moderators/agt/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:4400/api/moderators/tournaments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = res.data.filter(t => {
                const matchedMode = (mode === 'clashsquad' ? 'Clash Squad' : 'Classic');
                return t.gameMode === matchedMode && t.teamSize === teamSize;
            });
            setTournaments(filtered);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/moderators/agt/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTournaments();
    }, [mode, teamSize, token]);

    const handleDeleteClick = (id) => {
        setDeletingTournamentId(id);
        setDeleteConfirmText('');
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        try {
            await axios.delete(`http://localhost:4400/api/moderators/tournaments/${deletingTournamentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTournaments(tournaments.filter(t => t._id !== deletingTournamentId));
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete tournament');
        }
    };

    const handleEditClick = (t) => {
        setEditingTournament(t);
        const dt = new Date(t.startTime);
        const pad = (n) => String(n).padStart(2, '0');
        const formattedDate = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
        
        setEditForm({
            roomCode: t.roomCode,
            password: t.password,
            status: t.status
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4400/api/moderators/tournaments/${editingTournament._id}`, {
                roomCode: editForm.roomCode,
                password: editForm.password,
                status: editForm.status
            }, { headers: { Authorization: `Bearer ${token}` }});
            setIsEditModalOpen(false);
            fetchTournaments();
        } catch (err) {
            console.error(err);
            alert('Failed to update room.');
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                gameMode: createMode,
                teamSize: createTeamSize,
                entryFee: Number(createEntryFee),
                maxPlayers: Number(createMaxPlayers),
                startTime: createStartTime ? new Date(createStartTime).toISOString() : undefined,
                prizePool: Number(createPrizePool)
            };
            await axios.post('http://localhost:4400/api/moderators/tournaments', payload, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsCreateModalOpen(false);
            fetchTournaments();
        } catch (err) {
            console.error(err);
            alert('Failed to create new room.');
        }
    };

    const teamOptions = [
        { id: '1v1', label: '1 vs 1', icon: <UserIcon className="h-5 w-5" /> },
        { id: '2v2', label: '2 vs 2', icon: <UserGroupIcon className="h-5 w-5" /> },
        { id: '4v4', label: '4 vs 4', icon: <UsersIcon className="h-5 w-5" /> },
    ];

    return (
        <div className="relative w-full min-h-screen">
            <div 
                className="fixed inset-0 z-0 bg-cover bg-top bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
            ></div>
            <div className="fixed inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95 z-0"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                           <span className="h-1 w-8 bg-red-600 rounded-full"></span>
                           <span className="text-red-600 font-black uppercase tracking-widest text-xs flex items-center">
                              <FireIcon className="h-4 w-4 mr-1" /> Moderator Privileges Active
                           </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-widest border-l-8 border-ff-orange pl-6 drop-shadow-lg leading-none">
                            {mode === 'clashsquad' ? 'Clash Squad' : 'Classic Mode'}
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center w-full lg:w-auto">
                        {/* Filters Button Group */}
                        <div className="bg-black/60 backdrop-blur-xl p-1 rounded-2xl border border-white/10 flex items-center shadow-2xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                            {teamOptions.map((opt) => (
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
                            ))}
                        </div>
                        
                        {/* Create Room Button */}
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition transform hover:-translate-y-1 whitespace-nowrap flex items-center w-full md:w-auto justify-center"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Create Room
                        </button>
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
                                <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest">Scanning Server Data...</p>
                            </div>
                        ) : tournaments.length > 0 ? (
                            tournaments.map((t) => (
                                <AdminTournamentCard 
                                   key={t._id} 
                                   tournament={t} 
                                   onDelete={() => handleDeleteClick(t._id)}
                                   onEdit={() => handleEditClick(t)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-32 bg-gray-800/20 backdrop-blur-sm rounded-3xl border border-white/5 text-center">
                                <FireIcon className="h-20 w-20 mx-auto mb-6 opacity-10 text-white" />
                                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
                                    No {teamSize} Matches Found
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    Create a new room or try a different filter.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Create Room Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-gray-900 border border-red-500/30 rounded-3xl p-8 relative z-10 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
                                Drop New Room
                            </h2>
                            <form onSubmit={handleCreateSubmit} className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block">Game Mode</label>
                                        <div className="flex bg-black p-1 rounded-lg border border-white/5">
                                            <button 
                                                type="button"
                                                onClick={() => { setCreateEntryFee(createEntryFee > 0 ? createEntryFee : 10); }}
                                                className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${createEntryFee > 0 ? 'bg-ff-orange text-white' : 'text-gray-500'}`}
                                            >Paid</button>
                                            <button 
                                                type="button"
                                                onClick={() => { setCreateEntryFee(0); }}
                                                className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${createEntryFee === 0 ? 'bg-ff-orange text-white' : 'text-gray-500'}`}
                                            >Free</button>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        {['Classic', 'Clash Squad'].map(m => (
                                            <button 
                                                type="button"
                                                key={m}
                                                onClick={() => setCreateMode(m)}
                                                className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest text-xs transition active:scale-95 ${createMode === m ? 'bg-red-600/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-2">Team Size</label>
                                    <div className="flex gap-4">
                                        {['1v1', '2v2', '4v4'].map(m => (
                                            <button 
                                                type="button"
                                                key={m}
                                                onClick={() => setCreateTeamSize(m)}
                                                className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest text-xs transition active:scale-95 ${createTeamSize === m ? 'bg-ff-orange/20 border-ff-orange text-ff-orange shadow-[0_0_10px_rgba(255,107,53,0.3)]' : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">
                                            {createEntryFee == 0 ? 'Registration Limit' : 'Entry Fee'}
                                        </label>
                                        <div className="relative">
                                            {createEntryFee == 0 ? (
                                                <select 
                                                   onChange={(e) => setCreateMaxPlayers(e.target.value)}
                                                   className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-2 text-white font-black text-center focus:outline-none focus:border-red-500 transition shadow-inner text-xs appearance-none cursor-pointer"
                                                >
                                                   <option value="100">100 Players</option>
                                                   <option value="200">200 Players</option>
                                                   <option value="300">300 Players</option>
                                                   <option value="500">500 Players</option>
                                                   <option value="1000">1000 Players</option>
                                                </select>
                                            ) : (
                                                <>
                                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-black text-xs">₹</span>
                                                   <input 
                                                       type="number" 
                                                       min="1"
                                                       required
                                                       value={createEntryFee}
                                                       onChange={(e) => {
                                                            const fee = e.target.value;
                                                            setCreateEntryFee(fee);
                                                            setCreatePrizePool(Math.floor(fee * createMaxPlayers * 0.8));
                                                       }}
                                                       className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 pl-7 pr-1 text-white font-black text-center focus:outline-none focus:border-red-500 transition shadow-inner text-sm"
                                                   />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">
                                            {createEntryFee == 0 ? 'Sponsored Prize (₹)' : 'Start Date & Time'}
                                        </label>
                                        <div className="relative">
                                            {createEntryFee == 0 ? (
                                                <>
                                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-black text-xs">₹</span>
                                                   <input 
                                                       type="number" 
                                                       min="0"
                                                       required
                                                       value={createPrizePool}
                                                       onChange={(e) => setCreatePrizePool(e.target.value)}
                                                       className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 pl-7 text-white font-black text-center focus:outline-none focus:border-red-500 transition shadow-inner text-sm"
                                                   />
                                                </>
                                            ) : (
                                                <input 
                                                    type="datetime-local" 
                                                    required
                                                    min={getMinDateTime()}
                                                    value={createStartTime}
                                                    onChange={(e) => setCreateStartTime(e.target.value)}
                                                    className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-1 text-[10px] text-white font-black text-center focus:outline-none focus:border-red-500 transition shadow-inner [color-scheme:dark]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {createEntryFee == 0 && (
                                   <div className="animate-fade-in group">
                                       <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">Start Date & Time</label>
                                       <input 
                                           type="datetime-local" 
                                           required
                                           min={getMinDateTime()}
                                           value={createStartTime}
                                           onChange={(e) => setCreateStartTime(e.target.value)}
                                           className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-3 text-sm text-white font-black text-center focus:outline-none focus:border-red-500 transition shadow-inner [color-scheme:dark]"
                                       />
                                   </div>
                                )}
                                
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2 border border-gray-800 p-2 rounded-lg">
                                    A unique identifier like <span className="text-ff-orange">{generateRoomNamePreview()}</span> will automatically be assigned.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-xl uppercase tracking-widest text-sm transition"
                                    >Cancel</button>
                                    <button 
                                        type="submit" 
                                        className="py-4 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] font-black rounded-xl uppercase tracking-widest text-sm transition"
                                    >Confirm Drop</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Room Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-gray-900 border border-ff-orange/30 rounded-3xl p-8 relative z-10 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
                                Edit Room Details
                            </h2>
                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-2">Room ID</label>
                                        <input 
                                            type="text" 
                                            value={editForm.roomCode}
                                            onChange={(e) => setEditForm({...editForm, roomCode: e.target.value})}
                                            className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 px-4 text-white font-black focus:outline-none focus:border-ff-orange transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-2">Password</label>
                                        <input 
                                            type="text" 
                                            value={editForm.password}
                                            onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                            className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-4 text-white font-black focus:outline-none focus:border-ff-orange transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-2">Match Status</label>
                                    <select 
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 px-4 text-white font-black focus:outline-none focus:border-ff-orange transition appearance-none"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Live">Live</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>



                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-xl uppercase tracking-widest text-sm transition"
                                    >Cancel</button>
                                    <button 
                                        type="submit" 
                                        className="py-4 bg-ff-orange hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(255,107,53,0.4)] font-black rounded-xl uppercase tracking-widest text-sm transition"
                                    >Update Match</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 border-2 border-red-600/50 rounded-3xl p-8 relative z-10 w-full max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center"
                        >
                            <div className="bg-red-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                                <TrashIcon className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                                Terminate Room?
                            </h2>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                This action is permanent and cannot be undone. 
                                Type <span className="text-red-500 font-black">DELETE</span> below.
                            </p>
                            
                            <input 
                                type="text" 
                                placeholder="Type DELETE"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                className="w-full bg-black border border-gray-700 rounded-xl py-4 px-4 text-white font-black text-center focus:outline-none focus:border-red-500 transition mb-6 tracking-widest"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-xl uppercase tracking-widest text-sm transition"
                                >Cancel</button>
                                <button 
                                    onClick={confirmDelete}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                    className={`py-4 font-black rounded-xl uppercase tracking-widest text-sm transition ${
                                        deleteConfirmText === 'DELETE' 
                                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5'
                                    }`}
                                >Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

// Internal Sub-Component for Admin Match Cards
const AdminTournamentCard = ({ tournament, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isLive = tournament.status === 'Live';
  const displayPrizePool = tournament.prizePool || 0;

  return (
    <div className="bg-gray-800 border-2 border-transparent hover:border-red-500/50 rounded-xl overflow-hidden transition group shadow-lg flex flex-col h-full relative">
        <div className="p-6 pb-2 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-black mb-1">{tournament.gameMode}</span>
            <span className="text-xl font-black uppercase text-white tracking-widest">{tournament.teamSize}</span>
          </div>
          <div className="bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
            <span className="text-[10px] text-red-500 uppercase font-black tracking-widest">{tournament.status}</span>
          </div>
        </div>
        
        <div className="p-6 bg-gray-800 flex-grow">
          <div className="w-full bg-black/40 rounded-lg p-3 border border-red-500/20 flex flex-col mb-4 shadow-inner">
             <div className="flex justify-between items-center mb-1">
                 <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Match Record:</span>
                 <span className="text-ff-orange font-mono text-sm font-black drop-shadow-[0_0_5px_rgba(255,107,53,0.6)]">{tournament.roomName || 'FFT_PENDING'}</span>
             </div>
             <div className="w-full h-px bg-white/5 my-1.5"></div>
             <div className="flex justify-between items-center">
                 <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">ID / PASS:</span>
                 <span className="text-white font-mono text-sm tracking-tight truncate font-black ml-4">{tournament.roomCode} / {tournament.password}</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Max Pool</span>
              <span className="text-ff-success font-black text-lg drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">₹{displayPrizePool}</span>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Entry Fee</span>
              <span className="text-white font-black text-lg">
                {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : <span className="text-ff-orange">FREE</span>}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
              <span>{tournament.entryFee === 0 ? 'Reg. Cap' : 'Players'}</span>
              <span className="text-white">{tournament.players ? tournament.players.length : 0} / {tournament.maxPlayers}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-red-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, ((tournament.players ? tournament.players.length : 0) / tournament.maxPlayers) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300">
            <ClockIcon className="h-5 w-5 mr-3 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {new Date(tournament.startTime).toLocaleDateString('en-GB')}, {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Admin Actions */}
        <div className="grid grid-cols-3">
           <button 
              onClick={() => navigate(`/tournament/${tournament._id}`)}
              className="py-3 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest flex justify-center items-center transition"
           >
              <PlayCircleIcon className="h-4 w-4 mr-1.5" /> View
           </button>
           <button 
              onClick={onEdit}
              className="py-3 bg-gray-700 hover:bg-gray-600 border-x border-gray-800 text-white font-black text-[10px] uppercase tracking-widest flex justify-center items-center transition"
           >
              <PencilSquareIcon className="h-4 w-4 mr-1.5" /> Edit
           </button>
           <button 
              onClick={onDelete}
              className="py-3 bg-gray-700 hover:bg-red-600/20 text-gray-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest flex justify-center items-center transition"
           >
              <TrashIcon className="h-4 w-4 mr-1.5" /> Del
           </button>
        </div>
    </div>
  );
};

export default AdminDashboard;
