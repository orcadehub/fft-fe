import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TournamentCard from '../components/TournamentCard';
import { FireIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import ffHeroBg1 from '../assets/fflogo1.jpg';
import ffHeroBg2 from '../assets/fflogo2.jpg';
import ffHeroBg3 from '../assets/fflogo3.jpg';

const backgrounds = [ffHeroBg3, ffHeroBg1, ffHeroBg2];

const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/api/tournaments/live');
        setTournaments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div className="w-full">
      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center border-b border-gray-800">
        {/* Free Fire Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
        ></div>
        {/* Overlays for contrast and neon glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/95 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.15)_0,transparent_70%)] z-0 mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              Dominate The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB835]">
                Battleground
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-medium mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Join elite Free Fire tournaments, prove your skills, and win epic real cash prizes. Verified high-level players only.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="#live-tournaments" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-ff-orange to-orange-500 rounded-xl font-black text-xl text-white uppercase tracking-wider hover:opacity-90 transition transform hover:-translate-y-1 drop-shadow-[0_4px_10px_rgba(255,107,53,0.4)]">
                Join A Match
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Animated scrolling indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
           <span className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Scroll To Play</span>
           <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1">
             <div className="w-1 h-2 bg-ff-orange rounded-full"></div>
           </div>
        </motion.div>
      </section>

      {/* Live Tournaments */}
      <section id="live-tournaments" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-widest border-l-8 border-ff-orange pl-6 mb-2">
              Live Drops
            </h2>
            <p className="text-gray-400 text-lg ml-6">Join an active match before slots fill up.</p>
          </div>
          <Link to="/tournaments" className="mt-6 md:mt-0 text-ff-orange font-bold uppercase tracking-wider hover:text-orange-400 flex items-center gap-2 group transition">
            View All Matches
            <span className="group-hover:translate-x-2 transition inline-block">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t, idx) => (
            <motion.div 
              key={t._id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group"
            >
              <div className="transition transform group-hover:-translate-y-2 group-hover:scale-[1.02] duration-300">
                <TournamentCard tournament={t} />
              </div>
            </motion.div>
          ))}
          {tournaments.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-32 bg-gray-800/30 rounded-3xl border border-gray-800 backdrop-blur-sm">
              <FireIcon className="h-20 w-20 mx-auto mb-6 opacity-20 text-white" />
              <p className="text-3xl font-bold text-gray-400 mb-2">No active drops right now</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
