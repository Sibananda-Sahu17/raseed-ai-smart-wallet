import React, { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { appGoogleLogin, appLogin, appSignup } from "@/api/auth";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Email/password login that creates user if not exists or checks password
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      
      const resp = await appLogin(email, password);

      if (resp.status === 200) {
        const data = resp.data;
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        console.error("Login error:", error.response.data.detail);
      } else {
        console.error("Login error:", error);
      }
      setIsLoading(false);
      return false;
    }
  };

  // Email/password signup
  const signup = async (email: string, name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const resp = await appSignup(email, name, password);

      if (resp.status === 201) {
        const data = resp.data;
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false };
      }
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.response?.status === 409) {
        return { success: false, error: "An account with this email already exists. Please sign in instead." };
      } else if (error.response?.data?.detail) {
        console.error("Signup error:", error.response.data.detail);
        return { success: false, error: error.response.data.detail };
      } else {
        console.error("Signup error:", error);
        return { success: false, error: "Failed to create account. Please try again." };
      }
    }
  };

  // Google OAuth login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const resp = await appGoogleLogin(tokenResponse.access_token);

        setUser(resp.data.user);
        localStorage.setItem("user", JSON.stringify(resp.data.user));
        localStorage.setItem("token", resp.data.token);
      } catch (error) {
        alert("Backend login error");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      alert("Google login failed");
      setIsLoading(false);
    },
    scope: "openid email profile",
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    googleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
