import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FireIcon, UserGroupIcon, TrophyIcon, ShieldCheckIcon, HeartIcon, BoltIcon } from '@heroicons/react/24/solid';

const AboutUs = () => {
  const stats = [
    { label: 'Active Players', value: '10K+', icon: UserGroupIcon },
    { label: 'Tournaments Hosted', value: '500+', icon: TrophyIcon },
    { label: 'Prize Pool Distributed', value: '₹5L+', icon: BoltIcon },
    { label: 'Fair Play Score', value: '99.9%', icon: ShieldCheckIcon },
  ];

  const values = [
    {
      title: 'Fair Competition',
      description: 'Every tournament is monitored by dedicated moderators to ensure fair play. We have zero tolerance for hacks, cheats, or exploitation.',
      icon: ShieldCheckIcon,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Community First',
      description: 'FF Tourney is built by gamers, for gamers. We listen to our community and constantly evolve based on player feedback.',
      icon: HeartIcon,
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Instant Rewards',
      description: 'Win a match, get paid. Our wallet system ensures instant prize distribution with transparent transaction history.',
      icon: BoltIcon,
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      title: 'Verified Players Only',
      description: 'We verify every player\'s Free Fire account level to ensure competitive integrity. Only Level 60+ players can participate.',
      icon: TrophyIcon,
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.15)_0,transparent_60%)]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ff-orange to-orange-600 rounded-2xl border border-orange-400/30 shadow-[0_0_30px_rgba(255,107,53,0.3)] mb-8 transform -rotate-6">
              <FireIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB835]">FF Tourney</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              India's premier Free Fire tournament platform where elite players compete, prove their skills, and win real cash prizes. We bring the battleground to your fingertips.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-ff-orange/30 transition-all hover:-translate-y-1 duration-300"
            >
              <stat.icon className="h-8 w-8 text-ff-orange mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-6 border-l-4 border-ff-orange pl-6">
            Our Story
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed md:text-lg pl-6">
            <p>
              FF Tourney was born from a simple idea — giving Free Fire players a trusted, competitive platform to showcase their skills and earn real rewards. We noticed that players across India lacked a reliable, transparent, and well-moderated platform for competitive play.
            </p>
            <p>
              What started as a passion project has grown into a thriving gaming community. Our platform is designed to handle everything from matchmaking and wallet management to real-time leaderboards and prize distribution — all with a focus on fairness and transparency.
            </p>
            <p>
              Every tournament on FF Tourney is supervised by experienced moderators who ensure that the rules are followed and results are accurately recorded. We believe that competitive gaming should be accessible, rewarding, and most importantly — fair.
            </p>
            <p>
              Whether you're a casual squad player or a hardcore ranked grinder, FF Tourney has a place for you. Join us and be part of the fastest-growing Free Fire tournament community in India.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Our Values */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-12 text-center"
        >
          What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB835]">Stand For</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-gray-600/50 transition-all hover:-translate-y-1 duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${value.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <value.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-ff-orange/10 to-orange-600/10 border border-ff-orange/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight">
            Got Questions?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Reach out to us through our Support Center or connect with us on social media. We're always here to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/support"
              className="px-8 py-4 bg-gradient-to-r from-ff-orange to-orange-500 rounded-xl font-bold text-white uppercase tracking-wider hover:opacity-90 transition shadow-[0_4px_15px_rgba(255,107,53,0.3)]"
            >
              Support Center
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl font-bold text-gray-300 uppercase tracking-wider hover:bg-gray-700 hover:text-white transition"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
