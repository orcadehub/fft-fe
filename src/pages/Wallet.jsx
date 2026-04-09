import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon, 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon, 
  ClockIcon, 
  WalletIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import WalletModal from '../components/WalletModal';
import { toast } from 'react-toastify';

const Wallet = () => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/api/ff/payments/transactions');
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'All') return true;
    if (filter === 'Topup') return tx.type === 'CREDIT' && !tx.description.toLowerCase().includes('refund') && !tx.description.toLowerCase().includes('win');
    if (filter === 'Winnings') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('win');
    if (filter === 'Refunded') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('refund');
    if (filter === 'Spent') return tx.type === 'DEBIT';
    return true;
  });

  const getFilterCount = (filterName) => {
    return transactions.filter(tx => {
      if (filterName === 'All') return true;
      if (filterName === 'Topup') return tx.type === 'CREDIT' && !tx.description.toLowerCase().includes('refund') && !tx.description.toLowerCase().includes('win');
      if (filterName === 'Winnings') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('win');
      if (filterName === 'Refunded') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('refund');
      if (filterName === 'Spent') return tx.type === 'DEBIT';
      return true;
    }).length;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const stats = {
    topup: transactions.filter(tx => tx.type === 'CREDIT' && !tx.description.toLowerCase().includes('refund') && !tx.description.toLowerCase().includes('win')).reduce((a, b) => a + b.amount, 0),
    winnings: transactions.filter(tx => tx.type === 'CREDIT' && tx.description.toLowerCase().includes('win')).reduce((a, b) => a + b.amount, 0),
    spent: transactions.filter(tx => tx.type === 'DEBIT').reduce((a, b) => a + b.amount, 0)
  };

  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="bg-white/5 p-6 rounded-full animate-bounce">
        <WalletIcon className="h-12 w-12 text-gray-600" />
      </div>
      <p className="text-gray-500 font-bold uppercase tracking-[0.3em] italic">Authentication Required</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Balance & Info */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group overflow-hidden"
          >
            {/* Holographic Card Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-ff-orange/30 to-purple-600/30 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-[#0a0c10] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <WalletIcon className="h-32 w-32 -rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-2 w-2 rounded-full bg-ff-orange animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 italic">Vault Balance</span>
                </div>

                <div className="flex items-baseline space-x-2 mb-10">
                  <span className="text-4xl md:text-5xl font-black text-ff-orange italic">₹</span>
                  <motion.h1 
                    key={user.walletBalance}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl md:text-8xl font-black text-white italic tracking-tighter"
                  >
                    {user.walletBalance.toLocaleString()}
                  </motion.h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-ff-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_20px_rgba(255,107,53,0.3)] hover:shadow-[0_15px_30px_rgba(255,107,53,0.5)] transform hover:-translate-y-1 transition-all flex items-center justify-center group"
                  >
                    <CreditCardIcon className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Deposit
                  </button>
                  <button 
                    className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center group"
                    onClick={() => toast.info('Withdrawal feature coming soon!')}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 p-6 rounded-[30px] relative overflow-hidden group hover:border-ff-success/30 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <SparklesIcon className="h-12 w-12" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Earnings</p>
              <div className="flex items-center text-ff-success font-black text-2xl italic">
                <span>₹</span>
                <span className="ml-1 tracking-tighter">{stats.winnings.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-[30px] relative overflow-hidden group hover:border-red-500/30 transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ArrowDownCircleIcon className="h-12 w-12" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Spent</p>
              <div className="flex items-center text-white font-black text-2xl italic">
                <span className="text-red-500 mr-1">-</span>
                <span>₹</span>
                <span className="ml-1 tracking-tighter">{stats.spent.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Transactions */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-ff-orange/20 rounded-2xl">
                <ClockIcon className="h-6 w-6 text-ff-orange" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Activity log</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['All', 'Topup', 'Winnings', 'Spent'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    filter === f 
                      ? 'bg-ff-orange border-ff-orange text-white shadow-lg shadow-ff-orange/20' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                  }`}
                >
                  {f} {filter === f && `(${getFilterCount(f)})`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="bg-white/5 h-20 rounded-3xl border border-white/5 animate-pulse"></div>
                ))
              ) : currentTransactions.length > 0 ? (
                currentTransactions.map((tx, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ delay: idx * 0.03 }}
                    key={tx._id}
                    className="group bg-[#0d0f14] border border-white/5 rounded-3xl p-5 md:p-6 flex items-center justify-between hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-default"
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${
                        tx.type === 'CREDIT' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}>
                        {tx.type === 'CREDIT' ? <ArrowUpCircleIcon className="h-7 w-7" /> : <ArrowDownCircleIcon className="h-7 w-7" />}
                      </div>
                      <div>
                        <h3 className="text-white font-black text-sm md:text-base tracking-tight uppercase group-hover:text-ff-orange transition-colors">{tx.description}</h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                          {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl md:text-2xl font-black italic tracking-tighter ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-white'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border mt-2 inline-block ${
                        tx.status === 'Success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                  <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClockIcon className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="text-gray-500 font-black uppercase tracking-[0.2em] italic">No activity recorded</h3>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* New Interactive Pagination */}
          {!loading && filteredTransactions.length > itemsPerPage && (
            <div className="flex items-center justify-center space-x-3 pt-6">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition"
              >
                <ChevronRightIcon className="h-5 w-5 rotate-180" />
              </button>
              <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      currentPage === i + 1 ? 'bg-ff-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        requiredAmount={0}
        onRechargeSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Wallet;


