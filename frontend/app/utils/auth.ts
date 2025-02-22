import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface User {
  username: string;
  email: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axios.post<LoginResponse>(API_ENDPOINTS.LOGIN, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.data.access_token) {
    // Store the token in localStorage
    localStorage.setItem('token', response.data.access_token);
  }

  return response.data;
};

export const signup = async (credentials: SignupCredentials): Promise<User> => {
  const response = await axios.post<User>(API_ENDPOINTS.SIGNUP, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}; 