import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUserWallet } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const merchantTransactionId = searchParams.get('id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!merchantTransactionId) {
                setStatus('failed');
                return;
            }

            try {
                // Poll for status or check once
                const res = await api.post('/api/ff/payments/verify', { merchantTransactionId });
                if (res.data.success) {
                    setStatus('success');
                    if (updateUserWallet) updateUserWallet(res.data.walletBalance);
                    setTimeout(() => navigate('/wallet'), 3000);
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [merchantTransactionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 border border-white/5 p-12 rounded-[40px] shadow-2xl max-w-md w-full text-center"
            >
                {status === 'verifying' && (
                    <>
                        <ArrowPathIcon className="h-20 w-20 text-ff-orange mx-auto mb-6 animate-spin" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Verifying Payment</h2>
                        <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">Please do not refresh or close the window</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircleIcon className="h-20 w-20 text-ff-success mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Payment Successful</h2>
                        <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">Your wallet balance has been updated</p>
                        <p className="text-ff-orange mt-2 text-xs font-black">Redirecting to wallet...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Payment Failed</h2>
                        <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-[10px]">There was an error processing your transaction</p>
                        <button 
                            onClick={() => navigate('/wallet')}
                            className="mt-8 bg-white text-black px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-ff-orange hover:text-white transition"
                        >
                            Back to Wallet
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentStatus;
