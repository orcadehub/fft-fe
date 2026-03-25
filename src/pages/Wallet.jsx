import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon, 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon, 
  ClockIcon, 
  WalletIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import WalletModal from '../components/WalletModal';

const Wallet = () => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:4400/api/payments/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

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

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'All') return true;
    if (filter === 'Topup') return tx.type === 'CREDIT' && !tx.description.toLowerCase().includes('refund') && !tx.description.toLowerCase().includes('win');
    if (filter === 'Winnings') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('win');
    if (filter === 'Refunded') return tx.type === 'CREDIT' && tx.description.toLowerCase().includes('refund');
    if (filter === 'Spent') return tx.type === 'DEBIT';
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const totalTopup = transactions.reduce((acc, tx) => {
    if (tx.type === 'CREDIT' && !tx.description.toLowerCase().includes('refund') && !tx.description.toLowerCase().includes('win')) {
      return acc + tx.amount;
    }
    return acc;
  }, 0);

  const totalWinnings = transactions.reduce((acc, tx) => {
    if (tx.type === 'CREDIT' && tx.description.toLowerCase().includes('win')) {
      return acc + tx.amount;
    }
    return acc;
  }, 0);

  const totalSpent = transactions.reduce((acc, tx) => {
    if (tx.type === 'DEBIT') {
      return acc + tx.amount;
    }
    return acc;
  }, 0);

  if (!user) return <div className="p-20 text-center text-gray-500 font-black uppercase tracking-widest">Please Login</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Wallet Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-white/5 rounded-[30px] overflow-hidden shadow-2xl relative mb-12 max-w-2xl mx-auto"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-ff-orange/10 rounded-full blur-[100px] -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-10 -mb-10"></div>
        <div className="p-8 text-center relative z-10">
          <div className="bg-ff-orange/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-ff-orange/20 shadow-[0_0_20px_rgba(255,107,53,0.3)]">
             <WalletIcon className="h-6 w-6 text-ff-orange" />
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Total Available Balance</p>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter mb-6 flex items-center justify-center drop-shadow-lg">
             <CurrencyRupeeIcon className="h-10 w-10 md:h-12 md:w-12 text-ff-orange mr-2" />
             {user.walletBalance}
          </h1>
          
           <div className="flex justify-center space-x-4">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-ff-gradient text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:shadow-[0_0_50px_rgba(255,107,53,0.6)] transform hover:-translate-y-1 transition-all flex items-center"
             >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Add Money
             </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
             <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center hover:bg-black/40 transition">
                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5">Total Topup</span>
                <span className="text-white font-black text-xl flex items-center">
                   <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-gray-500" />{totalTopup}
                </span>
             </div>
             <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden hover:bg-black/40 transition">
                <div className="absolute top-0 right-0 w-8 h-8 bg-ff-success/10 rounded-full blur-md"></div>
                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-90 text-ff-success">Total Winnings</span>
                <span className="text-ff-success font-black text-xl flex items-center drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                   <CurrencyRupeeIcon className="h-4 w-4 mr-1" />{totalWinnings}
                </span>
             </div>
             <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center hover:bg-black/40 transition">
                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5">Total Spent</span>
                <span className="text-white font-black text-xl flex items-center">
                   <span className="text-red-500 mr-0.5">-</span><CurrencyRupeeIcon className="h-4 w-4 mr-1 text-red-500" />{totalSpent}
                </span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Transactions Section */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 gap-6">
            <h2 className="text-2xl font-black uppercase text-white tracking-widest flex items-center">
               <ClockIcon className="h-6 w-6 text-ff-orange mr-3 drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
               Transactions
            </h2>
            
            <div className="flex flex-wrap bg-gray-900 border border-white/5 rounded-2xl md:rounded-full p-1.5 shadow-inner gap-1">
              {['All', 'Topup', 'Winnings', 'Spent', 'Refunded'].map(f => {
                const count = getFilterCount(f);
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center ${
                      filter === f 
                        ? 'bg-ff-orange text-white shadow-[0_0_15px_rgba(255,107,53,0.4)]' 
                        : 'text-gray-500 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {f} {filter === f && <span className="opacity-90 ml-1.5 font-black">({count})</span>}
                  </button>
                );
              })}
            </div>
         </div>

         <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                  [1,2,3].map(i => (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        key={i} 
                        className="bg-gray-800/20 h-24 rounded-3xl border border-white/5 animate-pulse"
                      ></motion.div>
                  ))
              ) : currentTransactions.length > 0 ? (
                  currentTransactions.map((tx) => (
                      <motion.div 
                          layout
                          key={tx._id}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="bg-gray-900 border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-gray-850 hover:border-white/10 transition-all group shadow-lg"
                      >
                          <div className="flex items-center space-x-4 md:space-x-6">
                              <div className={`p-4 rounded-2xl border flex-shrink-0 ${tx.type === 'CREDIT' ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                                  {tx.type === 'CREDIT' ? <ArrowUpCircleIcon className="h-8 w-8" /> : <ArrowDownCircleIcon className="h-8 w-8" />}
                              </div>
                              <div className="min-w-0 pr-4">
                                  <h3 className="text-white font-black text-sm md:text-lg tracking-tight uppercase group-hover:text-ff-orange transition-colors truncate">{tx.description}</h3>
                                  <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1 hidden md:block">
                                      {new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1 md:hidden">
                                      {new Date(tx.createdAt).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                              <p className={`text-xl md:text-2xl font-black italic tracking-tighter ${tx.type === 'CREDIT' ? 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]' : 'text-white'}`}>
                                  {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                              </p>
                              <p className="text-[8px] md:text-[9px] text-gray-400 font-extrabold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full mt-2 inline-block border border-white/5">
                                  {tx.status}
                              </p>
                          </div>
                      </motion.div>
                  ))
              ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="bg-gray-900 border border-white/5 rounded-[40px] p-20 text-center shadow-xl"
                  >
                      <div className="bg-gray-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ClockIcon className="h-12 w-12 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">No Transactions Found</h3>
                      <p className="text-gray-500 text-sm font-medium">Your payment activities for the selected filter will appear here.</p>
                  </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Pagination Controls */}
         {!loading && filteredTransactions.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 border border-white/5 p-4 rounded-3xl gap-4 shadow-lg">
               <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Rows per page:</span>
                  <div className="relative">
                    <select 
                       value={itemsPerPage} 
                       onChange={(e) => setItemsPerPage(Number(e.target.value))}
                       className="bg-black/50 border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-2 outline-none appearance-none cursor-pointer hover:border-ff-orange focus:border-ff-orange transition custom-scrollbar"
                    >
                       {[5, 10, 15, 20, 30, 50].map(size => (
                          <option className="bg-gray-900" key={size} value={size}>{size}</option>
                       ))}
                    </select>
                    <ChevronRightIcon className="h-3 w-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                  </div>
               </div>
               
               <div className="flex items-center space-x-6">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-xl">
                     Page <span className="text-white">{currentPage}</span> of {Math.max(1, totalPages)}
                  </span>
                  <div className="flex space-x-2">
                     <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 active:scale-95 transition"
                     >
                        <ChevronRightIcon className="h-4 w-4 rotate-180" />
                     </button>
                     <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl bg-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 active:scale-95 transition"
                     >
                        <ChevronRightIcon className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>
         )}
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

