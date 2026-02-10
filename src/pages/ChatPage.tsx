import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, MoreVertical, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi, bookingApi } from '@/lib/api';
import { Message } from '@/types';

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

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', bookingId],
    queryFn: () => messageApi.getByBookingId(bookingId || ''),
    enabled: !!bookingId,
    refetchInterval: 3000,
  });

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
        senderId: user.id,
        text: newMessage,
      });
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">Sesi chat tidak valid</p>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-blue-500 animate-pulse text-lg font-black italic">MENGHUBUNGKAN ENKRIPSI...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white rounded-xl" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
                  {user?.role === 'customer' ? 'Mitra Mekanik' : 'Klien Pelanggan'}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secure Line Connected</span>
                </div>
              </div>
            </div>
            <Button size="icon" variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-blue-400 h-12 w-12 shadow-lg hover:bg-blue-500 hover:text-white transition-all">
              <Phone className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar-hide">
        {messages && messages.length > 0 ? (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 backdrop-blur-md transition-all ${
                  msg.senderId === user?.id
                    ? 'bg-blue-600/80 text-white rounded-br-none shadow-lg shadow-blue-500/10'
                    : 'bg-white/10 text-gray-100 border border-white/10 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-2 font-mono ${msg.senderId === user?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30">
            <MessageSquare className="h-16 w-16 text-white" />
            <p className="text-white font-bold tracking-widest uppercase text-sm">Belum ada transmisi</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-black/60 backdrop-blur-3xl p-6 border-t border-white/10 relative z-50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Input
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-14 rounded-2xl px-6 focus:border-blue-500/50 focus:ring-0 transition-all shadow-inner"
              placeholder="Ketik pesan terenkripsi..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="bg-blue-600 hover:bg-blue-500 rounded-2xl h-14 w-14 shadow-lg shadow-blue-500/30 flex-shrink-0 transition-all active:scale-95"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            <Send className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
