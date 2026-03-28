import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import socket from '../services/socket'; // Assuming socket.js exists or useAuth handles it

const SupportCenter = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchChat();

    // Socket listeners for real-time messages
    if (user) {
      socket.emit('join_user', user._id);
      
      socket.on('receive_support_message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });
    }

    return () => {
      socket.off('receive_support_message');
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async () => {
    try {
      const res = await api.get('/api/support/my-chat');
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Support chat fetch error:', err);
      toast.error('Could not load support chat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const text = inputText;
      setInputText('');
      
      // Post to backend
      await api.post('/api/support/send', { text });
      
      // Note: receive_support_message will update the UI via socket
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center max-w-sm">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-ff-orange mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Support Center</h2>
          <p className="text-gray-400 text-sm mb-6">Please login to contact our support team.</p>
          <a href="/profile" className="block w-full bg-ff-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-lg">Login Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md px-6 py-2 rounded-full border border-ff-orange/30 shadow-[0_10px_30px_rgba(255,107,53,0.1)] mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-ff-orange" />
            <span className="text-gray-100 font-bold uppercase tracking-[0.2em] text-xs">Verified Support Team</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-widest leading-none drop-shadow-2xl">
            Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-ff-orange to-orange-500">Center</span>
        </h1>
        <p className="text-gray-500 mt-4 font-bold uppercase tracking-widest text-xs">Average response time: &lt; 30 minutes</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-gray-800/20 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Messages Layout */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-400px)] lg:max-h-[600px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-ff-orange/20 border-t-ff-orange rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <ChatBubbleLeftRightIcon className="h-20 w-20 mx-auto mb-4 grayscale" />
              <p className="font-bold uppercase tracking-widest text-white">Start a conversation</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'user' ? 'bg-ff-orange' : 'bg-gray-700'}`}>
                    {msg.sender === 'user' ? <UserIcon className="h-4 w-4 text-white" /> : <ShieldCheckIcon className="h-4 w-4 text-ff-success" />}
                  </div>
                  {/* Message Bubble */}
                  <div 
                    className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-xl ${
                      msg.sender === 'user' 
                      ? 'bg-ff-orange text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-100 rounded-tl-none border border-white/5'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span 
                      className={`text-[9px] block mt-2 font-bold uppercase tracking-tighter opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Support Footer with Input */}
        <form 
          onSubmit={handleSendMessage}
          className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md flex items-center space-x-3"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-900/80 border border-gray-700 text-white px-6 py-3.5 rounded-2xl focus:outline-none focus:border-ff-orange/50 transition-colors text-sm font-bold placeholder:text-gray-600"
          />
          <button 
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-ff-orange p-3.5 rounded-2xl text-white shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
      </div>

      {/* Secondary Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-800/40 p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="w-10 h-10 bg-ff-success/20 rounded-xl flex items-center justify-center shrink-0">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-ff-success" />
          </div>
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Real-time Support</h3>
            <p className="text-gray-500 text-[10px] mt-1 font-bold">Chat directly with our administrative team for issues related to withdrawals, payments or tournament rules.</p>
          </div>
        </div>
        <div className="bg-gray-800/40 p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="w-10 h-10 bg-ff-orange/20 rounded-xl flex items-center justify-center shrink-0">
            <UserIcon className="h-5 w-5 text-ff-orange" />
          </div>
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Security Alert</h3>
            <p className="text-gray-500 text-[10px] mt-1 font-bold">FF Tourney support will NEVER ask for your password or OTP. Be careful of impersonators outside our platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
