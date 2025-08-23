import { Activity } from '../components/activities/ActivitiesContext';
import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API Response types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Client class
class ActivitiesApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Handle different header types
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else if (typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }
    }

    const token = AuthService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Activities API
  async getActivities(): Promise<ApiResponse<Activity[]>> {
    return this.request<Activity[]>('/activities/');
  }

  async getActivity(id: string): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/activities/${id}/`);
  }

  async createActivity(activityData: Partial<Activity>): Promise<ApiResponse<Activity>> {
    return this.request<Activity>('/activities/', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async updateActivity(id: string, activityData: Partial<Activity>): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/activities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivity(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/activities/${id}/`, {
      method: 'DELETE',
    });
  }

  async startActivity(id: string): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/activities/${id}/start/`, {
      method: 'POST',
    });
  }

  async pauseActivity(id: string): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/activities/${id}/pause/`, {
      method: 'POST',
    });
  }

  async completeActivity(id: string): Promise<ApiResponse<Activity>> {
    return this.request<Activity>(`/activities/${id}/complete/`, {
      method: 'POST',
    });
  }

  // Utility methods
  setAuthToken(token: string) {
    // Store token using AuthService
    const rememberMe = AuthService.isRememberMeEnabled();
    if (rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  }

  clearAuthToken() {
    // Clear token from both storage types
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return AuthService.isAuthenticated();
  }
}

// Create and export singleton instance
export const activitiesApi = new ActivitiesApiClient(API_BASE_URL);

// Export types for use in components
export type { ApiResponse };
