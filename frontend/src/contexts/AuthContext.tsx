import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService, User } from "../lib/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const hasToken = AuthService.isAuthenticated();

        if (hasToken) {
          const isValid = await AuthService.validateToken();

          if (isValid) {
            const userData = AuthService.getUser();
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            await AuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
        await AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Listen for storage changes (when token is added/removed from localStorage or sessionStorage)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "authToken" ||
        e.key === "authUser" ||
        e.key === "authRememberMe"
      ) {
        // Re-check authentication status when storage changes
        const checkAuth = async () => {
          if (AuthService.isAuthenticated()) {
            const isValid = await AuthService.validateToken();
            if (isValid) {
              const userData = AuthService.getUser();
              setIsAuthenticated(true);
              setUser(userData);
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        };
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    try {
      const response = await AuthService.login(
        { username, password },
        rememberMe,
      );
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
