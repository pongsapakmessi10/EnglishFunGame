"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedToken = localStorage.getItem("retroToken");
      if (storedToken) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser({ id: userData._id, username: userData.username });
            setToken(storedToken);
          } else {
            localStorage.removeItem("retroToken");
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("retroToken", newToken);
    document.cookie = `token=${newToken}; path=/; max-age=2592000; SameSite=Lax`;
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("retroToken");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    setToken(null);
    setUser(null);
    router.push("/?error=loggedout");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
