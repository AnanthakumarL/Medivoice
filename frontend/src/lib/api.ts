// API configuration for Medi-Hub frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('auth.token');
  
  const defaultHeaders = {
    ...apiConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Generic API calls
export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: any) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint: string, data: any) => apiCall(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor' | 'staff' | 'laboratory' | 'admin';
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Demo login (matches backend demo-login endpoint)
  demoLogin: async (role: 'patient' | 'doctor' | 'staff' | 'laboratory' | 'admin') => {
    return apiCall('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  // Get current user profile
  me: async () => {
    return apiCall('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// Demo data API calls
export const demoAPI = {
  // Get demo doctors
  getDoctors: async () => {
    return apiCall('/demo/doctors');
  },

  // Get demo patients
  getPatients: async () => {
    return apiCall('/demo/patients');
  },

  // Get demo laboratories
  getLaboratories: async () => {
    return apiCall('/demo/laboratories');
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
  },
  
  test: async () => {
    return apiCall('/test');
  },
};

// Helper functions for token management
export const tokenHelper = {
  setToken: (token: string) => {
    localStorage.setItem('auth.token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('auth.token');
  },
  
  removeToken: () => {
    localStorage.removeItem('auth.token');
  },
  
  isValidToken: () => {
    const token = tokenHelper.getToken();
    if (!token) return false;
    
    try {
      // Basic JWT validation (check if it's expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};