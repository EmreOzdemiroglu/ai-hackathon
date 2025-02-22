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

export interface LearningProfile {
  verbal_score: number;
  non_verbal_score: number;
  self_assessment: number;
  age: number;
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

export const signup = async (credentials: SignupCredentials): Promise<LoginResponse> => {
  // First create the user
  const userResponse = await axios.post<User>(API_ENDPOINTS.SIGNUP, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Then login to get the token
  const loginResponse = await login({
    username: credentials.username,
    password: credentials.password
  });

  // Create an empty learning profile
  const emptyProfile: LearningProfile = {
    verbal_score: 0,
    non_verbal_score: 0,
    self_assessment: 0,
    age: 0
  };

  try {
    // Create learning profile with the token
    await axios.post(API_ENDPOINTS.ASSESSMENT_PROFILE, emptyProfile, {
      headers: {
        'Authorization': `Bearer ${loginResponse.access_token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to create learning profile:', error);
    // Don't throw here as the user is already created and logged in
  }

  return loginResponse;
}; 