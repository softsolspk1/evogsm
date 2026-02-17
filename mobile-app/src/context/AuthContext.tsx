import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { NEON_AUTH_URL, SESSION_TOKEN_KEY } from "../constants/Config";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  is_verified?: boolean;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  pendingUser: { id: string; email: string } | null;
  setPendingUser: (user: { id: string; email: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = React.useCallback(async (token: string) => {
    try {
      const response = await axios.get(`${NEON_AUTH_URL}/get-session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (e) {
      await logout();
    }
  }, []);

  const loadSession = React.useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
      if (token) {
        await fetchUser(token);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (token: string) => {
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
    await fetchUser(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setIsLoading,
        login,
        logout,
        pendingUser,
        setPendingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
