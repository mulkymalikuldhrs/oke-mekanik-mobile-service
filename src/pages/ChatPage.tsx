
import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Camera, MapPin, Clock, Star, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const ChatPage = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mechanic',
      text: 'Halo! Saya Ahmad Rizki, mekanik yang akan membantu Anda hari ini. Saya sedang dalam perjalanan ke lokasi Anda.',
      timestamp: '14:30',
      type: 'text'
    },
    {
      id: 2,
      sender: 'customer',
      text: 'Terima kasih pak! Mobilnya benar-benar tidak bisa dinyalakan sama sekali.',
      timestamp: '14:32',
      type: 'text'
    },
    {
      id: 3,
      sender: 'mechanic',
      text: 'Baik, saya sudah dekat dengan lokasi Anda. Bisa tolong kirim foto kondisi mesin saat ini?',
      timestamp: '14:35',
      type: 'text'
    },
    {
      id: 4,
      sender: 'customer',
      text: '',
      timestamp: '14:36',
      type: 'image',
      image: '/placeholder.svg'
    },
    {
      id: 5,
      sender: 'mechanic',
      text: 'Saya sudah sampai di lokasi. Dimana posisi mobil Anda?',
      timestamp: '14:40',
      type: 'location'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentJob = {
    id: 'JOB001',
    mechanic: {
      name: 'Ahmad Rizki',
      rating: 4.9,
      phone: '+62 812-3456-7890',
      photo: '👨‍🔧',
      status: 'online'
    },
    customer: {
      name: 'Budi Santoso',
      vehicle: 'Toyota Avanza 2019 - B 1234 XYZ'
    },
    status: 'otw'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'customer', // In real app, this would be determined by user role
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate mechanic typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add auto-reply (in real app, this would come from the other user)
        const autoReply = {
          id: messages.length + 2,
          sender: 'mechanic',
          text: 'Baik, saya mengerti. Akan segera saya cek kondisinya.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  const handleFileUpload = (file) => {
    const message = {
      id: messages.length + 1,
      sender: 'customer',
      text: '',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'image',
      image: URL.createObjectURL(file)
    };
    
    setMessages([...messages, message]);
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.sender === 'customer';
    
    return (
      <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          {message.type === 'text' && (
            <p className="text-sm">{message.text}</p>
          )}
          
          {message.type === 'image' && (
            <div>
              <img src={message.image} alt="Shared image" className="w-full h-32 object-cover rounded mb-2" />
              {message.text && <p className="text-sm">{message.text}</p>}
            </div>
          )}
          
          {message.type === 'location' && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">{message.text || 'Lokasi dibagikan'}</p>
            </div>
          )}
          
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  };

  const renderTypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-200 px-4 py-2 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{currentJob.mechanic.photo}</div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{currentJob.mechanic.name}</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{currentJob.mechanic.status}</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs ml-1">{currentJob.mechanic.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Job Info Banner */}
      <div className="bg-blue-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Job #{currentJob.id}</p>
              <p className="text-xs text-blue-700">{currentJob.customer.vehicle}</p>
            </div>
            <Badge className="bg-blue-600">
              {currentJob.status === 'otw' ? 'Menuju Lokasi' : 'Aktif'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-2 overflow-x-auto">
            <Button size="sm" variant="outline" className="whitespace-nowrap">
              📍 Bagikan Lokasi
            </Button>
            <Button size="sm" variant="outline" className="whitespace-nowrap">
              📸 Kirim Foto
            </Button>
            <Button size="sm" variant="outline" className="whitespace-nowrap">
              ⏰ Estimasi Waktu
            </Button>
            <Button size="sm" variant="outline" className="whitespace-nowrap">
              💰 Estimasi Biaya
            </Button>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <label htmlFor="file-upload">
              <Button size="sm" variant="outline" className="p-2">
                <Paperclip className="h-4 w-4" />
              </Button>
            </label>
            
            <div className="flex-1 flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm" className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
