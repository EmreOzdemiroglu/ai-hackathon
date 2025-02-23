'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import ChatHistoryPanel from '../components/ChatHistoryPanel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import styles from './chatbot.module.css';
import { API_ENDPOINTS } from '../config/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;  // Made timestamp required
}

interface ChatResponse {
  response: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock chat history data for UI demonstration
  const mockChatSessions: ChatSession[] = [
    {
      id: '1',
      title: 'Understanding React Hooks',
      messages: [
        { role: 'user', content: 'Can you explain React hooks?', timestamp: '2024-03-20T10:00:00Z' },
        { role: 'assistant', content: 'React Hooks are functions that allow you to use state and other React features in functional components...', timestamp: '2024-03-20T10:00:05Z' }
      ],
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:05:00Z'
    },
    {
      id: '2',
      title: 'Python Data Structures',
      messages: [
        { role: 'user', content: 'What are the main Python data structures?', timestamp: '2024-03-19T15:00:00Z' },
        { role: 'assistant', content: 'Python has several built-in data structures including lists, tuples, dictionaries, and sets...', timestamp: '2024-03-19T15:00:05Z' }
      ],
      created_at: '2024-03-19T15:00:00Z',
      updated_at: '2024-03-19T15:10:00Z'
    }
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
        // Add user message to UI immediately
        const newMessage: ChatMessage = {
            content: input,
            role: 'user',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsThinking(true);

        // Send message to backend
        const formData = new FormData();
        formData.append('message', input);
        
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const response = await fetch(API_ENDPOINTS.CHAT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        
        // Add assistant's response to messages
        const assistantMessage: ChatMessage = {
            content: data.response,
            role: 'assistant',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Clear image preview and file after sending
        setSelectedImage(null);
        setImagePreview(null);
        
    } catch (error) {
        console.error('Error sending message:', error);
        // Add error message to chat
        const errorMessage: ChatMessage = {
            content: 'Sorry, there was an error processing your message. Please try again.',
            role: 'assistant',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
        setIsThinking(false);
    }
};

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Mock functions for chat history UI
  const handleSessionSelect = (sessionId: string) => {
    // This is just for show, no real functionality needed
    console.log('Selected session:', sessionId);
  };

  const startNewChat = () => {
    setMessages([]);
  };

  const handleDeleteSession = (sessionId: string) => {
    // This is just for show, no real functionality needed
    console.log('Delete session:', sessionId);
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Hamburger Menu Button - Absolute Positioned */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-all z-50 ${
          isSidebarOpen 
            ? 'bg-purple-100 text-purple-600 shadow-lg translate-x-1' 
            : 'bg-white text-gray-600 shadow-md'
        }`}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col h-[90vh] translate-y-[-2rem] translate-x-8">
          {/* Chat Container */}
          <div className={styles.chatbox}>
            <div className={styles.header}>
              <h1>Learning Buddy ✨</h1>
            </div>

            <div className={styles.messageContainer} ref={chatContainerRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.messageWrapper} ${
                    message.role === 'user' ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <div className={styles.message}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Override default link behavior to open in new tab
                        a: (props) => (
                          <a target="_blank" rel="noopener noreferrer" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                  <div className={styles.thinking}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.inputContainer}>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputWithPreview}>
                    {imagePreview && (
                      <div className={styles.imageAddedLabel}>
                        Image added
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading}
                    />
                  </div>
                  <label className={styles.imageButton}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
                </div>
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={!input.trim() || isLoading}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        <ChatHistoryPanel
          sessions={mockChatSessions}
          isOpen={isHistoryOpen}
          onSessionSelect={handleSessionSelect}
          onNewChat={startNewChat}
          currentSessionId="1"
          onClose={() => setIsHistoryOpen(false)}
          onOpen={() => setIsHistoryOpen(true)}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </div>
  );
}