const API_BASE_URL = 'http://localhost:8000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  error?: string;
}

export class AuthService {
  private static TOKEN_KEY = 'authToken';
  private static USER_KEY = 'authUser';
  private static REMEMBER_ME_KEY = 'authRememberMe';

  // Login user and store token
  static async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      if (data.success) {
        // Store remember me preference
        localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());

        if (rememberMe) {
          // Persistent storage - use localStorage
          localStorage.setItem(this.TOKEN_KEY, data.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
        } else {
          // Session storage - use sessionStorage (cleared when browser closes)
          sessionStorage.setItem(this.TOKEN_KEY, data.token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
        }

        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user and clear stored data
  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear both storage types
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }
  }

  // Get stored token
  static getToken(): string | null {
    // Check if remember me is enabled
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';

    if (rememberMe) {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
  }

  // Get stored user data
  static getUser(): User | null {
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';

    if (rememberMe) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } else {
      const userStr = sessionStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get authentication headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Check if token is valid by making a request to auth endpoint
  static async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

  console.debug('DEBUG: validateToken - token presence:', !!token);
  console.debug('DEBUG: validateToken - auth headers present:', !!this.getAuthHeaders());

      const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
        headers: this.getAuthHeaders(),
      });

  console.debug('DEBUG: validateToken - Response status:', response.status);
  console.debug('DEBUG: validateToken - Response headers present:', !!response.headers);

      if (!response.ok) {
        const errorText = await response.text();
  console.debug('DEBUG: validateToken - Error response (trimmed):', errorText?.slice?.(0, 200));
      }

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Check if remember me is enabled
  static isRememberMeEnabled(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }
}

export default AuthService;
