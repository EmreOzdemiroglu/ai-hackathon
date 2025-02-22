const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LearningProfile {
  verbal_score: number;
  non_verbal_score: number;
  self_assessment: number;
  age: number;
}

export const createLearningProfile = async (profile: LearningProfile): Promise<LearningProfile> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/assessment/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profile)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to create learning profile' }));
    throw new Error(error.detail || 'Failed to create learning profile');
  }

  return response.json();
};

export const getLearningProfile = async (): Promise<LearningProfile> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/assessment/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Learning profile not found');
    }
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch learning profile' }));
    throw new Error(error.detail || 'Failed to fetch learning profile');
  }

  return response.json();
}; 