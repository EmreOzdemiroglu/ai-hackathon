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

export interface ChatResponse {
  id: number;
  user_id: number;
  content: string;
  response: string;
  planning_analysis: string;
  final_analysis: string;
  created_at: string;
}

export const chatService = {
  sendMessage: async (content: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', { content });
    return response.data;
  },
  
  getChatHistory: async (): Promise<ChatResponse[]> => {
    const response = await api.get<ChatResponse[]>('/chat/history');
    return response.data;
  }
};

export default api; 