'use client';

import { useState } from 'react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';

interface ChatMessage {
  text: string;
  isUser: boolean;
  image?: string;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Mock chat sessions - in a real app, this would come from your backend
  const chatSessions: ChatSession[] = [
    {
      id: '1',
      title: 'Previous Chat 1',
      date: '2024-02-23',
      preview: 'Last message from the conversation...'
    },
    {
      id: '2',
      title: 'Previous Chat 2',
      date: '2024-02-22',
      preview: 'Another conversation preview...'
    },
    // Add more mock sessions as needed
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setChatHistory([...chatHistory, { text: message || 'Sent an image', isUser: true, image: imageUrl }]);
      setSelectedImage(null);
    } else {
      setChatHistory([...chatHistory, { text: message, isUser: true }]);
    }
    
    // Here you would typically make an API call to your chatbot backend
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        text: `You said: ${message}`, 
        isUser: false 
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 p-6 relative">
        <div className="max-w-6xl w-full mx-auto flex flex-col">
          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-hidden flex flex-col">
            {/* Header with Hamburger and History Toggle */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-4xl font-bold" style={{ color: '#8A2BE2' }}>Learning Buddy ✨</h1>
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 ${
                          chat.isUser
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {chat.image && (
                          <div className="mb-2">
                            <img 
                              src={chat.image} 
                              alt="Uploaded content"
                              className="max-w-full rounded-lg"
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        )}
                        {chat.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:border-purple-500"
                  />
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-3 flex items-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white rounded-full px-8 py-3 hover:bg-purple-700 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History Sidebar - Moved outside the chat container */}
        <div 
          className={`w-72 border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
          } fixed right-0 top-0 h-screen bg-white overflow-y-auto shadow-lg z-10`}
        >
          <div className="p-4 pt-[88px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Chat History</h2>
            <div className="space-y-3">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-gray-800">{session.title}</h3>
                  <p className="text-sm text-gray-500">{session.date}</p>
                  <p className="text-sm text-gray-600 truncate">{session.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 