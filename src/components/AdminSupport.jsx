import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { 
  ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserIcon, 
  CheckCircleIcon, ClockIcon, MagnifyingGlassIcon, FireIcon 
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import socket from '../services/socket';

const AdminSupport = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchChats();
    
    socket.on('new_support_request', (data) => {
      fetchChats(); // Refresh list to show new message/unread count
      if (selectedChat && selectedChat.user._id === data.userId) {
        fetchMessages(data.userId);
      }
    });

    socket.on('receive_support_message', (msg) => {
      // This is triggered for the current user's room. 
      // If we are admin, we might need a separate event or just poll if it's the selected chat.
      // But Since we are admin, we might be listening to multiple users.
      // Actually, the backend emits to the userId room. 
      // Admin should probably join a special 'admin_support' room or we use the new_support_request event.
    });

    return () => {
      socket.off('new_support_request');
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/api/support/admin/chats');
      setChats(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load support chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/api/support/admin/chats/${userId}`);
      setMessages(res.data.messages);
      // Mark as read in local state
      setChats(prev => prev.map(c => c.user._id === userId ? { ...c, unreadCount: { ...c.unreadCount, admin: 0 } } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.user._id);
    socket.emit('join_user', chat.user._id); // Join the user's room to receive real-time updates
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    try {
      const text = inputText;
      setInputText('');
      await api.post(`/api/support/admin/send/${selectedChat.user._id}`, { text });
      
      // Update local messages immediately for better UX
      setMessages(prev => [...prev, { sender: 'admin', text, timestamp: new Date() }]);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleResolve = async (userId) => {
    // Logic removed as per user request (no resolution needed)
  };

  const filteredChats = chats.filter(c => 
    c.user.inGameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.ffUid.includes(searchQuery)
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px]">
      
      {/* Sidebar: Chat List */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-ff-orange/50 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center"><FireIcon className="h-8 w-8 text-ff-orange mx-auto animate-spin" /></div>
          ) : filteredChats.length === 0 ? (
            <div className="p-10 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No active chats</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full p-4 flex items-center space-x-3 transition border-b border-white/5 hover:bg-white/5 ${selectedChat?._id === chat._id ? 'bg-ff-orange/10 border-r-4 border-r-ff-orange' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/10">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-black text-xs uppercase truncate pr-2">{chat.user.inGameName}</h4>
                    {chat.unreadCount.admin > 0 && (
                      <span className="bg-ff-orange text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{chat.unreadCount.admin}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-[9px] font-bold mt-1 uppercase tracking-tighter truncate">UID: {chat.user.ffUid}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-ff-orange/20 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-ff-orange" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wide">{selectedChat.user.inGameName}</h3>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-900/30">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg ${
                     msg.sender === 'admin' 
                     ? 'bg-ff-orange text-white rounded-tr-none' 
                     : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                   }`}>
                      <p>{msg.text}</p>
                      <span className="text-[8px] opacity-40 block mt-1 uppercase tracking-tighter text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/20 flex items-center space-x-3">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Reply to warrior..."
                 className="flex-1 bg-gray-900/50 border border-gray-800 text-white px-5 py-3 rounded-xl text-xs font-bold focus:outline-none focus:border-ff-orange/30 placeholder:text-gray-700"
               />
               <button 
                 type="submit"
                 disabled={!inputText.trim()}
                 className="bg-ff-orange p-3 rounded-xl text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
               >
                 <PaperAirplaneIcon className="h-5 w-5" />
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-20">
            <ChatBubbleLeftRightIcon className="h-32 w-32 text-white mb-4" />
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Select a Ticket</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Ready to assist our players</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
