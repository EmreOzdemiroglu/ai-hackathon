'use client';

import { format } from 'date-fns';
import type { ChatSession } from '../services/api';

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  isOpen: boolean;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
  onClose: () => void;
  onOpen: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const ChatHistoryPanel = ({
  sessions = [],
  isOpen,
  onSessionSelect,
  onNewChat,
  currentSessionId,
  onClose,
  onOpen,
  onDeleteSession
}: ChatHistoryPanelProps) => {
  return (
    <>
      {/* Open Button - Visible when panel is closed */}
      <button
        onClick={onOpen}
        className={`fixed right-4 top-4 p-2 bg-white rounded-lg shadow-md transition-all z-50 hover:bg-gray-100 ${
          !isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
        }`}
        aria-label="Open history"
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

      <div 
        className={`w-80 fixed right-0 top-0 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        {/* Toggle Button */}
        <button
          onClick={onClose}
          className={`absolute -left-12 top-4 p-2 bg-white rounded-lg shadow-md transition-all hover:bg-gray-100 ${
            isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
          }`}
          aria-label="Close history"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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
            {(sessions || []).map((session) => (
              <div
                key={session.id}
                className={`relative group w-full p-4 rounded-lg text-left transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-purple-100 hover:bg-purple-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => onSessionSelect(session.id)}
                  className="w-full text-left"
                >
                  <div className="text-sm text-gray-500">
                    {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div className="mt-1 text-gray-800 font-medium">
                    {session.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {session.messages.length} messages
                  </div>
                </button>
                
                {/* Delete button - visible on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="absolute right-2 top-2 p-1.5 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                  aria-label="Delete chat"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {(!sessions || sessions.length === 0) && (
              <div className="text-center text-gray-500 mt-4">
                No chat history yet
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistoryPanel; 