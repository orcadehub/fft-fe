import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CreditCardIcon, XMarkIcon, CurrencyRupeeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // fixed: using outline for consistency or match existing style
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const WalletModal = ({ isOpen, onClose, requiredAmount, onRechargeSuccess }) => {
  const { user, token, updateUserWallet } = useAuth();
  const [amount, setAmount] = useState(requiredAmount ? Math.ceil(requiredAmount / 100) * 100 : 100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRecharge = async () => {
    if (amount % 100 !== 0) {
      toast.error('Amount must be a multiple of 100');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const orderRes = await api.post('/api/ff/payments/recharge', {
        amount: parseInt(amount)
      });

      if (orderRes.data.success && orderRes.data.redirectUrl) {
        // Redirect to PhonePe
        window.location.href = orderRes.data.redirectUrl;
      } else {
        toast.error('Failed to initiate PhonePe recharge');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initialize recharge');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
           <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-ff-orange/20 p-3 rounded-2xl border border-ff-orange/20">
            <CreditCardIcon className="h-8 w-8 text-ff-orange" />
          </div>
          <h2 className="text-3xl font-black uppercase text-white tracking-widest italic">Recharge Wallet</h2>
        </div>

        {requiredAmount > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl mb-6">
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Insufficient Balance</p>
            <p className="text-white text-sm font-medium mt-1">You need ₹{requiredAmount} more to join this match.</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 ml-1">Enter Amount (Min. ₹100)</label>
            <div className="relative">
              <CurrencyRupeeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
              <input 
                type="number" 
                min="100"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-ff-orange transition text-2xl font-black text-white italic"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[100, 200, 500].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-xl font-black text-sm uppercase transition border ${amount == val ? 'bg-ff-orange border-ff-orange text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRecharge}
            disabled={loading}
            className="w-full py-5 bg-ff-gradient text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-95 transition disabled:opacity-50"
          >
            {loading ? 'Initializing...' : `Proceed to Pay ₹${amount}`}
          </button>
          
          <div className="flex items-center justify-center space-x-2 pt-2">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Secure payment via</p>
            <span className="text-white font-black italic text-xs">PhonePe</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default WalletModal;
