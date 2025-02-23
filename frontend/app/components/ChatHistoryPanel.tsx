'use client';

import { format } from 'date-fns';
import type { ChatResponse } from '../services/api';

export interface ChatSession {
  id: string;
  messages: ChatResponse[];
  createdAt: string;
}

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  isOpen: boolean;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
}

const ChatHistoryPanel = ({
  sessions,
  isOpen,
  onSessionSelect,
  onNewChat,
  currentSessionId
}: ChatHistoryPanelProps) => {
  // Get preview from the first message of the session
  const getSessionPreview = (messages: ChatResponse[]) => {
    if (messages.length === 0) return 'Empty session';
    const firstMessage = messages[0];
    return firstMessage.content.length > 50 
      ? `${firstMessage.content.substring(0, 50)}...`
      : firstMessage.content;
  };

  return (
    <div 
      className={`w-80 fixed right-0 top-0 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={onNewChat}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                currentSessionId === session.id
                  ? 'bg-purple-100 hover:bg-purple-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="text-sm text-gray-500">
                {format(new Date(session.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
              <div className="mt-1 text-gray-800 font-medium">
                {getSessionPreview(session.messages)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {session.messages.length} messages
              </div>
            </button>
          ))}

          {sessions.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No chat history yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPanel; 