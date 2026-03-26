import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, MoreVertical, ChevronLeft, LoaderCircle, ShieldCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi, bookingApi, userApi } from '@/lib/api';
import { Message } from '@/types';
import { io } from 'socket.io-client';

const ChatPage = () => {
  const { t } = useLanguage();
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getById(bookingId || ''),
    enabled: !!bookingId,
  });

  const otherPartyId = user?.role === 'customer' ? booking?.mechanicId : booking?.userId;

  const { data: otherParty } = useQuery({
    queryKey: ['user', otherPartyId],
    queryFn: () => userApi.getProfile(otherPartyId || ''),
    enabled: !!otherPartyId,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', bookingId],
    queryFn: () => messageApi.getByBookingId(bookingId || ''),
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (!bookingId) return;

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001');

    socket.emit('join_booking', bookingId);

    socket.on('new_message', (msg: Message) => {
      queryClient.setQueryData(['messages', bookingId], (old: Message[] | undefined) => {
        if (!old) return [msg];
        // Avoid duplicate messages if the mutation also triggers a refetch or sets data
        if (old.some(m => m.id === msg.id)) return old;
        return [...old, msg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [bookingId, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: messageApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', bookingId] });
      setNewMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && bookingId) {
      sendMessageMutation.mutate({
        bookingId,
        text: newMessage,
      });
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 flex flex-col max-h-screen overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-white/10 rounded-full text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  {user?.role === 'customer' ? '👨‍🔧' : '👤'}
                </div>
                <div>
                  <h1 className="text-lg font-black italic tracking-tighter uppercase leading-none mb-1">
                    {otherParty?.name || (user?.role === 'customer' ? 'MEKANIK' : 'PELANGGAN')}
                  </h1>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Terhubung</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-0 custom-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((msg: Message) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-3 shadow-2xl relative ${
                    isMe
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 backdrop-blur-xl text-white rounded-tl-none'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] font-black italic uppercase tracking-tighter mt-2 flex items-center ${isMe ? 'text-blue-200 justify-end' : 'text-gray-500 justify-start'}`}>
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <ShieldCheck className="h-3 w-3 ml-1" />}
                  </div>

                  {/* Bubble Tail */}
                  <div className={`absolute top-0 w-4 h-4 ${
                    isMe
                      ? '-right-1 bg-blue-600 [clip-path:polygon(0_0,0%_100%,100%_0)]'
                      : '-left-1 bg-white/5 border-l border-t border-white/10 [clip-path:polygon(0_0,100%_0,100%_100%)]'
                  }`} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
            <MessageSquare className="h-16 w-16" />
            <p className="font-black italic uppercase tracking-widest">Belum ada pesan</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-black/60 backdrop-blur-2xl p-4 md:p-6 border-t border-white/10 relative z-10">
        <form onSubmit={handleSendMessage} className="container mx-auto max-w-4xl flex items-center space-x-3">
          <div className="flex-1 relative group">
            <Input
              className="w-full h-14 bg-white/5 border-white/10 focus:border-blue-500/50 rounded-2xl px-6 text-white placeholder:text-gray-500 transition-all duration-300 backdrop-blur-sm"
              placeholder="Ketik pesan masa depan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
          </div>
          <Button
            type="submit"
            size="icon"
            className={`h-14 w-14 rounded-2xl shadow-xl transition-all duration-500 ${
              newMessage.trim()
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 rotate-0'
                : 'bg-white/5 border border-white/10 text-gray-500 rotate-12 opacity-50'
            }`}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            <Send className={`h-6 w-6 transition-transform ${newMessage.trim() ? 'scale-110' : 'scale-90'}`} />
          </Button>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
