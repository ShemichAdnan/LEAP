import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../App";
import { getCurrentUser,logout as apiLogout } from "../services/authApi";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    try{
      await apiLogout();
    }finally{
      setCurrentUser(null);
    }
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
