import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { CreditCardIcon, XMarkIcon, CurrencyRupeeIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'; 
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const WalletModal = ({ isOpen, onClose, requiredAmount, onRechargeSuccess }) => {
  const { user, token } = useAuth();
  const [amount, setAmount] = useState(requiredAmount ? Math.ceil(requiredAmount / 100) * 100 : 100);
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (amount % 100 !== 0) {
      toast.error('Amount must be a multiple of 100');
      return;
    }
    setLoading(true);

    try {
      const orderRes = await api.post('/api/ff/payments/recharge', {
        amount: parseInt(amount)
      });

      if (orderRes.data.success && orderRes.data.redirectUrl) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl" 
            onClick={onClose}
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative bg-[#0d0f14] border border-white/10 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-ff-orange/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="p-8 md:p-10">
              <button 
                onClick={onClose} 
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-xl"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-4 mb-10">
                <div className="bg-ff-orange/20 p-4 rounded-[20px] border border-ff-orange/20">
                  <CreditCardIcon className="h-8 w-8 text-ff-orange" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-white tracking-widest italic">Add Funds</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Instant Wallet Recharge</p>
                </div>
              </div>

              {requiredAmount > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl mb-8 flex items-start space-x-3">
                  <div className="mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                  </div>
                  <div>
                    <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">Insufficient Balance</p>
                    <p className="text-white text-sm font-medium">Add ₹{requiredAmount} more to participate in the match.</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4 ml-1 italic">Select or Enter Amount</label>
                  
                  <div className="relative group mb-6">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-ff-orange flex items-center justify-center bg-ff-orange/10 rounded-lg font-black italic">
                      ₹
                    </div>
                    <input 
                      type="number" 
                      min="100"
                      className="w-full bg-black/40 border-2 border-white/5 hover:border-white/10 focus:border-ff-orange rounded-[25px] py-7 pl-16 pr-6 outline-none transition-all text-4xl font-black text-white italic tracking-tighter"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[100, 200, 500, 1000].map(val => (
                      <button 
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-4 rounded-2xl font-black text-xs uppercase transition-all border ${
                          amount == val 
                          ? 'bg-ff-orange border-ff-orange text-white shadow-lg shadow-ff-orange/20 translate-y-[-2px]' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleRecharge}
                    disabled={loading || !amount || amount < 100}
                    className="w-full py-6 bg-ff-gradient text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-lg shadow-[0_15px_30px_rgba(255,107,53,0.3)] hover:shadow-[0_20px_40px_rgba(255,107,53,0.5)] active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                         <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                         <span>Processing...</span>
                      </div>
                    ) : (
                      <span>Deposit ₹{parseInt(amount || 0).toLocaleString()}</span>
                    )}
                  </button>
                  
                  <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                       <ShieldCheckIcon className="h-4 w-4 text-ff-success" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                     <div className="flex items-center space-x-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-3 grayscale opacity-30 invert" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
