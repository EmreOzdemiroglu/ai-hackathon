import { API_ENDPOINTS } from '../config/api';

export interface ChatMessage {
  id: number;
  content: string;
  response: string;
  planning_analysis: string;
  final_analysis: string;
  created_at: string;
  user_id: number;
}

export const sendChatMessage = async (content: string): Promise<ChatMessage> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(API_ENDPOINTS.CHAT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to send message' }));
    throw new Error(error.detail || 'Failed to send message');
  }

  return response.json();
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(API_ENDPOINTS.CHAT_HISTORY, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch chat history' }));
    throw new Error(error.detail || 'Failed to fetch chat history');
  }

  return response.json();
}; 