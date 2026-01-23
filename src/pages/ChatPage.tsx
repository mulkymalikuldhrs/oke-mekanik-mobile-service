
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Phone, MapPin, Star, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';

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
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error.message} />}
          {data?.messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="p-2"><Paperclip className="h-4 w-4" /></Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" className="px-4" disabled={mutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
