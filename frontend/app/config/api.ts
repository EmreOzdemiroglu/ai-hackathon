const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  ASSESSMENT_PROFILE: `${API_BASE_URL}/assessment/profile`,
  CHAT: `${API_BASE_URL}/chat`,
  CHAT_HISTORY: `${API_BASE_URL}/chat/history`
} as const; 