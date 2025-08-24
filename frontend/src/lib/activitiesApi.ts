import { Activity } from '../components/activities/ActivitiesContext';
import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API Response types
// Backend API Response types (matches actual backend response structure)
interface BackendApiResponse<T> {
  success: boolean;
  activities?: T[];
  count?: number;
  message?: string;
  error?: string;
}

// Backend API Response for single activity actions (start, pause, complete)
interface BackendActivityActionResponse {
  success: boolean;
  activity: any;
  message: string;
  error?: string;
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
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🔍 ActivitiesApi - Making request to:', url);

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
    console.log('🔍 ActivitiesApi - Token exists:', !!token);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔍 ActivitiesApi - Authorization header set');
    } else {
      console.log('🔍 ActivitiesApi - No token available');
    }

    console.log('🔍 ActivitiesApi - Request headers:', headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('🔍 ActivitiesApi - Response status:', response.status);
      console.log('🔍 ActivitiesApi - Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 ActivitiesApi - Response data:', data);
      return data;
    } catch (error) {
      console.error('ActivitiesApi - Request failed:', error);
      throw error;
    }
  }

  // Activities API
  async getActivities(): Promise<BackendApiResponse<Activity>> {
    return this.request<BackendApiResponse<Activity>>('/activities/');
  }

  async getActivity(id: string): Promise<Activity> {
    return this.request<Activity>(`/activities/${id}/`);
  }

  async createActivity(activityData: Partial<Activity>): Promise<Activity> {
    return this.request<Activity>('/activities/', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity> {
    return this.request<Activity>(`/activities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivity(id: string): Promise<{ success: boolean; message?: string }> {
    return this.request<{ success: boolean; message?: string }>(`/activities/${id}/`, {
      method: 'DELETE',
    });
  }

  async startActivity(id: string): Promise<BackendActivityActionResponse> {
    return this.request<BackendActivityActionResponse>(`/activities/${id}/start/`, {
      method: 'POST',
    });
  }

  async pauseActivity(id: string): Promise<BackendActivityActionResponse> {
    return this.request<BackendActivityActionResponse>(`/activities/${id}/pause/`, {
      method: 'POST',
    });
  }

  async completeActivity(id: string): Promise<BackendActivityActionResponse> {
    return this.request<BackendActivityActionResponse>(`/activities/${id}/complete/`, {
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
export type { BackendApiResponse, BackendActivityActionResponse };
