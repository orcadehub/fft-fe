import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CreditCardIcon, XMarkIcon, CurrencyRupeeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // fixed: using outline for consistency or match existing style
import { motion, AnimatePresence } from 'framer-motion';

const WalletModal = ({ isOpen, onClose, requiredAmount, onRechargeSuccess }) => {
  const { user, token, updateUserWallet } = useAuth();
  const [amount, setAmount] = useState(requiredAmount ? Math.ceil(requiredAmount / 100) * 100 : 100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRecharge = async () => {
    if (amount % 100 !== 0) {
      setError('Amount must be a multiple of 100 (e.g., 100, 200, 300...)');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const orderRes = await api.post('/api/payments/recharge', {
        amount: parseInt(amount)
      });

      const { order, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FF Tournament Wallet",
        description: `Add ₹${amount} to Wallet`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/api/payments/verify', {
              ...response
            });

            if (verifyRes.data.status === 'Recharge Successful') {
              setSuccess(true);
              // Update local user state if useAuth supports it
              if (updateUserWallet) {
                updateUserWallet(verifyRes.data.walletBalance);
              }
              setTimeout(() => {
                setSuccess(false);
                onRechargeSuccess(verifyRes.data.walletBalance);
                onClose();
              }, 2000);
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.inGameName,
        },
        theme: {
          color: "#FF6B35"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize recharge');
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

        {success ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Recharge Success</h2>
            <p className="text-gray-400 mt-2">Your wallet has been updated.</p>
          </div>
        ) : (
          <>
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
                <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 ml-1">Enter Amount (Multiples of 100)</label>
                <div className="relative">
                  <CurrencyRupeeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                  <input 
                    type="number" 
                    step="100"
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

              {error && <p className="text-red-500 text-xs font-bold text-center uppercase tracking-wide bg-red-500/5 py-3 rounded-lg border border-red-500/10">{error}</p>}

              <button 
                onClick={handleRecharge}
                disabled={loading}
                className="w-full py-5 bg-ff-gradient text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-95 transition disabled:opacity-50"
              >
                {loading ? 'Opening Razorpay...' : `Recharge ₹${amount}`}
              </button>
              
              <p className="text-[10px] text-gray-600 font-bold text-center uppercase tracking-[0.2em] px-4">Secure payment powered by Razorpay. Funds are instantly added to your FF Arena wallet.</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default WalletModal;
