// API utility functions
const API_BASE_URL = 'http://localhost:3000';

export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your token or log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const sendCampaignWithMedia = async (formData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Note: Don't set Content-Type for FormData, let browser set it
    },
    body: formData
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your token or log in again.');
    }
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send campaign');
  }

  return await response.json();
};