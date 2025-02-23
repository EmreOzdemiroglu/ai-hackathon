'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import ChatHistoryPanel, { ChatSession } from '../components/ChatHistoryPanel';
import { chatService, type ChatResponse } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface ChatMessage {
  text: string;
  isUser: boolean;
  image?: string;
}

// Convert backend message format to frontend format
const convertToFrontendMessage = (backendMessage: ChatResponse): ChatMessage[] => {
  return [
    // User message
    {
      text: backendMessage.content,
      isUser: true
    },
    // Bot response
    {
      text: backendMessage.response,
      isUser: false
    }
  ];
};

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatService.getChatHistory();
        
        // Group messages into sessions by date
        const sessions: ChatSession[] = [];
        history.forEach(message => {
          const messageDate = new Date(message.created_at).toDateString();
          let session = sessions.find(s => new Date(s.createdAt).toDateString() === messageDate);
          
          if (!session) {
            session = {
              id: messageDate,
              messages: [],
              createdAt: message.created_at
            };
            sessions.push(session);
          }
          
          session.messages.push(message);
        });

        // Sort sessions by date (newest first)
        sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setChatSessions(sessions);
        
        // If there are sessions, load the most recent one
        if (sessions.length > 0) {
          const latestSession = sessions[0];
          setCurrentSessionId(latestSession.id);
          setChatHistory(latestSession.messages.flatMap(convertToFrontendMessage));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const handleSessionSelect = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setChatHistory(session.messages.flatMap(convertToFrontendMessage));
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setChatHistory([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage && !selectedImage) return;

    // Clear input immediately
    setMessage('');
    setSelectedImage(null);

    // Add user's message to chat history immediately
    const userMessage = { text: currentMessage, isUser: true };
    if (selectedImage) {
      userMessage.image = URL.createObjectURL(selectedImage);
    }
    setChatHistory(prev => [...prev, userMessage]);

    // Show thinking animation
    setIsThinking(true);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(currentMessage);
      
      // Add bot's response to chat history
      setChatHistory(prev => [...prev, { 
        text: response.response,
        isUser: false 
      }]);

      // Update sessions with the new message
      const today = new Date().toDateString();
      const updatedSessions = [...chatSessions];
      let todaySession = updatedSessions.find(s => new Date(s.createdAt).toDateString() === today);

      if (!todaySession) {
        todaySession = {
          id: today,
          messages: [],
          createdAt: new Date().toISOString()
        };
        updatedSessions.unshift(todaySession);
      }

      todaySession.messages.push(response);
      setChatSessions(updatedSessions);
      setCurrentSessionId(todaySession.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatHistory(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
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
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
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
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  // Override default link styling
                                  a: ({children, ...props}) => (
                                    <a 
                                      {...props} 
                                      className={`${chat.isUser ? 'text-white' : 'text-blue-600'} underline`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {children}
                                    </a>
                                  ),
                                  // Override default code block styling
                                  code: ({children, className, ...props}) => (
                                    <code
                                      {...props}
                                      className={`${
                                        !className
                                          ? `${chat.isUser ? 'bg-purple-700' : 'bg-gray-200'} rounded px-1`
                                          : `${chat.isUser ? 'bg-purple-700' : 'bg-gray-200'} block p-2 rounded`
                                      }`}
                                    >
                                      {children}
                                    </code>
                                  ),
                                  // Override default list styling
                                  ul: ({children, ...props}) => (
                                    <ul {...props} className="list-disc list-inside">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({children, ...props}) => (
                                    <ol {...props} className="list-decimal list-inside">
                                      {children}
                                    </ol>
                                  ),
                                }}
                              >
                                {chat.text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Thinking Animation */}
                      {isThinking && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-2xl p-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:border-purple-500"
                    disabled={isLoading} // Disable input while loading
                  />
                  <label className={`cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-3 flex items-center transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white rounded-full px-8 py-3 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || isThinking}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <ChatHistoryPanel
          sessions={chatSessions}
          isOpen={isHistoryOpen}
          onSessionSelect={handleSessionSelect}
          onNewChat={startNewChat}
          currentSessionId={currentSessionId}
        />
      </div>
    </div>
  );
} 