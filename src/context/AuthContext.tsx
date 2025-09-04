import React, { createContext, useState, useEffect, useContext } from "react";
import * as Haptics from "expo-haptics";
import { User } from "@/types";
import * as authStorage from "@/services/authStorage";

// --- Context Type ---
interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
}

// --- Context ---
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// --- Provider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session on mount
  useEffect(() => {
    const loadSession = async () => {
      const sessionUser = await authStorage.getSession();
      if (sessionUser) setUser(sessionUser);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // Register new user
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);

    const users = (await authStorage.getRegisteredUsers()) || [];
    const exists = users.some(
      u =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoading(false);
      return { success: false, message: "Username or email already exists." };
    }

    const newUser: User = { username, email, password };
    await authStorage.saveRegisteredUsers([...users, newUser]);
    await authStorage.saveSession(newUser);

    setUser(newUser);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsLoading(false);
    return { success: true, message: "Registration successful!" };
  };

  // Login existing user
  const login = async (identifier: string, password: string) => {
    setIsLoading(true);

    const users = (await authStorage.getRegisteredUsers()) || [];
    const found = users.find(
      u =>
        (u.username.toLowerCase() === identifier.toLowerCase() ||
          u.email.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    );

    if (found) {
      await authStorage.saveSession(found);
      setUser(found);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsLoading(false);
      return true;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setIsLoading(false);
    return false;
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    await authStorage.clearSession();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom hook ---
export const useAuth = () => useContext(AuthContext);
