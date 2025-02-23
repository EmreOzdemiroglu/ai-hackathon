import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LearningProfile {
  verbal_score: number;
  non_verbal_score: number;
  self_assessment: number;
  age: number;
}

export const createLearningProfile = async (profile: LearningProfile): Promise<LearningProfile> => {
  const response = await api.put<LearningProfile>('/assessment/profile', profile);
  return response.data;
};

export const getLearningProfile = async (): Promise<LearningProfile> => {
  const response = await api.get<LearningProfile>('/assessment/profile');
  return response.data;
};

export interface Message {
  content: string;
  role: string;
  timestamp: string;
  image_url?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  sessions: ChatSession[];
  user_id: string;
}

export interface ChatResponse {
  session: ChatSession;
  planning_analysis: string;
  final_analysis: string;
}

export const chatService = {
  createSession: async (title?: string): Promise<ChatSession> => {
    const response = await api.post<ChatSession>('/chat/sessions', { title });
    return response.data;
  },
  
  getChatHistory: async (): Promise<ChatHistory> => {
    const response = await api.get<ChatHistory>('/chat/history');
    return response.data;
  },
  
  sendMessage: async (sessionId: string, content: string): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('content', content);
    
    const response = await api.post<ChatResponse>(
      `/chat/${sessionId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  
  sendMessageWithImage: async (sessionId: string, content: string, image: File): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);
    
    const response = await api.post<ChatResponse>(
      `/chat/${sessionId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  
  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/chat/sessions/${sessionId}`);
  }
};

export default api; 