import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Project API functions
export const projectAPI = {
  // Get all projects
  getProjects: () => api.get('/projects'),
  
  // Get project by ID
  getProject: (id) => api.get(`/projects/${id}`),
  
  // Create new project
  createProject: (projectData) => api.post('/projects', projectData),
  
  // Update project
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  
  // Delete project
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Task API functions
export const taskAPI = {
  // Get tasks for a project
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  
  // Get task by ID
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  
  // Create new task
  createTask: (projectId, taskData) => api.post(`/projects/${projectId}/tasks`, taskData),
  
  // Update task
  updateTask: (taskId, taskData) => api.patch(`/tasks/${taskId}`, taskData),
  
  // Delete task
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

// User API functions
export const userAPI = {
  // Get current user
  getCurrentUser: () => api.get('/user/me'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/user/profile', userData),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default api;
