import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ShieldCheckIcon, 
  CurrencyRupeeIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const JoinConfirmationModal = ({ isOpen, onClose, onConfirm, entryFee, walletBalance }) => {
  const [agreed, setAgreed] = useState(false);

  const newBalance = walletBalance - entryFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
             <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-ff-success/20 p-3 rounded-2xl border border-ff-success/20">
              <ShieldCheckIcon className="h-8 w-8 text-ff-success" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest italic">Confirm Join</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 space-y-4 shadow-inner">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Current Wallet Balance</span>
                <span className="text-white font-black flex items-center">
                  <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {walletBalance}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tournament Entry Fee</span>
                <span className="text-red-400 font-black flex items-center">
                  -<CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                  {entryFee}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-300 text-sm font-black uppercase tracking-wider">Balance After Join</span>
                <span className="text-ff-success font-black text-xl flex items-center">
                  <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
                  {newBalance}
                </span>
              </div>
            </div>

            {/* Terms and Conditions Box */}
            <div className="bg-gray-950/80 rounded-xl p-4 pt-5 border border-red-500/20 shadow-inner relative">
              <h3 className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Critical Terms & Conditions</h3>
              <ul className="space-y-3 text-xs text-gray-400 font-medium">
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">1.</span>
                  <span>Minimum Required Level: You must be <strong className="text-white">Level 55</strong> or above in Free Fire to participate.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">2.</span>
                  <span><strong className="text-red-400">Zero Tolerance for Hacks:</strong> Any use of hacks, scripts, or game misconduct will result in an immediate ban of your Free Fire account.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">3.</span>
                  <span><strong className="text-white">Penalty Fine:</strong> You will be permanently banned and fined <strong className="text-red-400">100 times</strong> the total earnings accumulated in your account.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">4.</span>
                  <span><strong className="text-white">Legal Action:</strong> Your identity is verified securely via your <strong className="text-ff-orange">Digilocker Data</strong>. If you fail to pay the assigned penalty, an official legal case will be filed against you without warning.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">5.</span>
                  <span>Entry fees are firmly non-refundable once match details are revealed.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-ff-orange mr-2">6.</span>
                  <span><strong className="text-white">Term Modifications:</strong> T&amp;Cs may be updated or changed at any time by the admin. The latest rules will always apply retroactively to all previous and ongoing enrollments.</span>
                </li>
              </ul>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition mt-2">
              <div className="flex-shrink-0 relative pt-0.5">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="w-5 h-5 bg-gray-800 border-2 border-gray-600 rounded transition peer-checked:bg-ff-orange peer-checked:border-ff-orange flex items-center justify-center">
                  <CheckCircleIcon className={`h-4 w-4 text-white transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                I have read and agree to the <span className="text-ff-orange">Critical Terms & Conditions</span> stated above.
              </div>
            </label>

            <div className="flex space-x-4 pt-4">
              <button 
                onClick={onClose}
                className="w-1/3 py-4 bg-gray-800 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (agreed) onConfirm();
                }}
                disabled={!agreed}
                className={`w-2/3 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition shadow-lg flex items-center justify-center ${
                  agreed 
                    ? 'bg-ff-gradient text-white hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-95' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                }`}
              >
                Confirm Join
              </button>
            </div>
            
            <p className="text-[9px] text-gray-600 font-bold text-center uppercase tracking-[0.2em] px-4">Ensure your Free Fire UID is correct. Room ID and password will be displayed here.</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JoinConfirmationModal;
