const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const authService = {
  // Register a new user account
  async signup(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create account.');
    }
    
    // Save JWT token in localStorage on success
    if (result.token) {
      localStorage.setItem('tadka_token', result.token);
    }
    return result.data.user;
  },

  // Log in to an existing account
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Invalid email or password.');
    }

    // Save JWT token in localStorage on success
    if (result.token) {
      localStorage.setItem('tadka_token', result.token);
    }
    return result.data.user;
  },

  // Check current session from JWT token storage
  async getMe() {
    const token = localStorage.getItem('tadka_token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) {
        localStorage.removeItem('tadka_token');
        return null;
      }
      return result.data.user;
    } catch (e) {
      localStorage.removeItem('tadka_token');
      return null;
    }
  },

  // Log out and destroy session
  logout() {
    localStorage.removeItem('tadka_token');
  }
};

export default authService;
