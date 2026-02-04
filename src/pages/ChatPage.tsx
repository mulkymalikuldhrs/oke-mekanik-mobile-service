
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Phone, MoreVertical, Image as ImageIcon, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}
=======
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Phone, MapPin, Star, Paperclip } from 'lucide-react';
=======
import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Camera, MapPin, Clock, Star, Paperclip, ArrowLeft } from 'lucide-react';
>>>>>>> origin/jules-9588893365322302084-daabd2d3
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
import { useLanguage } from '@/hooks/useLanguage';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

/**
 * Fetches the chat messages for a specific job from the API.
 * @param {string | undefined} id The ID of the job to fetch chat messages for.
 * @returns {Promise<any>} A promise that resolves to the chat messages.
 */
const fetchChatMessages = async (id: string | undefined) => {
  if (!id) throw new Error("No chat ID provided");
  const response = await fetch(`http://localhost:3001/chats/${id}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

/**
 * Posts a new chat message to the API.
 * @param {object} params The parameters for posting a chat message.
 * @param {string | undefined} params.id The ID of the job to post the chat message to.
 * @param {string} params.text The text of the chat message.
 * @returns {Promise<any>} A promise that resolves to the response from the API.
 */
const postChatMessage = async ({ id, text }: { id: string | undefined; text: string }) => {
  if (!id) throw new Error("No chat ID provided");

  const chatResponse = await fetch(`http://localhost:3001/chats/${id}`);
  const chat = await chatResponse.json();

  const newMessage = {
    id: chat.messages.length + 1,
    sender: 'customer',
    text,
  };

  const response = await fetch(`http://localhost:3001/chats/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [...chat.messages, newMessage] }),
  });

  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

/**
 * Renders the chat page, allowing customers and mechanics to communicate with each other.
 */
const ChatPage = () => {
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      text: 'Halo, saya mekanik Ahmad. Saya sudah dalam perjalanan menuju lokasi Anda.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      senderId: 'other',
      text: 'Bisa tolong share lokasi tepatnya di mana? Patokannya apa ya?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
=======
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.getBookingById(bookingId!),
    enabled: !!bookingId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', bookingId],
    queryFn: () => api.getMessagesByBookingId(bookingId!),
    enabled: !!bookingId,
    refetchInterval: 2000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', bookingId] });
      setNewMessage('');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
>>>>>>> origin/jules-9588893365322302084-daabd2d3

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, msg]);
    setNewMessage('');

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: 'Baik, saya mengerti. Saya segera sampai.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2 text-white hover:bg-blue-700">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">👨‍🔧</div>
            <div>
              <h1 className="font-bold">Ahmad Rizki (Mekanik)</h1>
              <p className="text-xs text-blue-100">Aktif Sekarang</p>
=======
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => fetchChatMessages(id),
  });

  const mutation = useMutation({
    mutationFn: postChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
      setNewMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data]);

  const handleSendMessage = () => {
<<<<<<< HEAD
    if (newMessage.trim()) {
      mutation.mutate({ id, text: newMessage });
    }
  };

  const renderMessage = (message: { id: number; sender: string; text: string }) => {
    const isOwnMessage = message.sender === 'customer'; // Assuming current user is customer
    return (
      <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Chat with Mechanic</h1>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline"><Phone className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline"><MapPin className="h-4 w-4" /></Button>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
    if (newMessage.trim() && user && bookingId) {
      sendMessageMutation.mutate({
        bookingId,
        senderId: user.id,
        text: newMessage,
      });
    }
  };

  if (!bookingId) return <div className="p-8 text-center">Invalid chat session.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {user?.role === 'customer' ? `Mekanik ID: ${booking?.mechanicId}` : `Pelanggan ID: ${booking?.customerId}`}
                </h1>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Online</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" className="rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.senderId === 'me'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
=======
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error.message} />}
          {data?.messages.map(renderMessage)}
=======
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-2xl">
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  isOwn ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
          <div ref={messagesEndRef} />
        </div>
      </div>

<<<<<<< HEAD
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="p-2"><Paperclip className="h-4 w-4" /></Button>
=======
      {/* Message Input */}
      <div className="bg-white border-t p-4 sticky bottom-0">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="text-gray-400">
              <Paperclip className="h-5 w-5" />
            </Button>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
<<<<<<< HEAD
            <Button onClick={handleSendMessage} size="sm" className="px-4" disabled={mutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
            <Button onClick={handleSendMessage} size="icon" className="bg-blue-600">
              <Send className="h-5 w-5" />
            </Button>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t shadow-lg">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="icon" className="text-gray-400">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="text-gray-400">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            className="flex-1 bg-gray-100 border-none focus-visible:ring-1 focus-visible:ring-blue-600"
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 rounded-full h-10 w-10 flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
