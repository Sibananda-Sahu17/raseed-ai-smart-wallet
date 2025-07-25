import React, { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

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
      const resp = await axios.post("http://localhost:8000/api/v1/auth/email-login", {
        email,
        password,
      });

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
      const resp = await axios.post("http://localhost:8000/api/v1/auth/email-signup", {
        email,
        name,
        password,
      });

      if (resp.status === 200) {
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
        const resp = await axios.post("http://localhost:8000/api/v1/auth/google-login", {
          access_token: tokenResponse.access_token,
        });

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
































// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useGoogleLogin, googleLogout } from "@react-oauth/google";
// import axios from "axios";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
//   token?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   googleLogin: () => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     if (email && password.length >= 6) {
//       const loggedUser: User = {
//         id: "1",
//         email,
//         name: email.split("@")[0],
//       };
//       setUser(loggedUser);
//       localStorage.setItem("user", JSON.stringify(loggedUser));
//       setIsLoading(false);
//       return true;
//     }
//     setIsLoading(false);
//     return false;
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setIsLoading(true);
//       try {
//         // Send access_token to backend for verification
//         const resp = await axios.post("http://localhost:8000/api/v1/auth/google-login", {
//           access_token: tokenResponse.access_token,
//         });

//         setUser(resp.data.user);
//         localStorage.setItem("user", JSON.stringify(resp.data.user));
//         localStorage.setItem("token", resp.data.token);
//       } catch (error) {
//         alert("Backend login error");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     onError: () => {
//       alert("Google login failed");
//       setIsLoading(false);
//     },
//     scope: "openid email profile",
//   });

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     googleLogout();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



































// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useGoogleLogin, googleLogout } from "@react-oauth/google";
// import axios from "axios";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
//   token?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   googleLogin: () => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     if (email && password.length >= 6) {
//       const loggedUser: User = {
//         id: "1",
//         email,
//         name: email.split("@")[0],
//       };
//       setUser(loggedUser);
//       localStorage.setItem("user", JSON.stringify(loggedUser));
//       setIsLoading(false);
//       return true;
//     }
//     setIsLoading(false);
//     return false;
//   };

//   // Google login hook from @react-oauth/google
//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setIsLoading(true);
//       try {
//         // Send access_token to backend (important: field named access_token)
//         console.log(tokenResponse);
//         const resp = await axios.post("http://localhost:8000/api/v1/auth/google-login", {
//           access_token: tokenResponse.access_token,
//         });

//         setUser(resp.data.user);
//         localStorage.setItem("user", JSON.stringify(resp.data.user));
//         localStorage.setItem("token", resp.data.token);
//       } catch (error) {
//         alert("Backend login error");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     onError: () => {
//       alert("Google login failed");
//       setIsLoading(false);
//     },
//     scope: "openid email profile",
//   });

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     googleLogout();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



























// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useGoogleLogin, googleLogout } from '@react-oauth/google';
// import axios from 'axios';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
//   token?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   googleLogin: () => void; // Note: returns void because useGoogleLogin returns a function
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
//     // Replace this with real backend call if using classic email/password
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     if (email && password.length >= 6) {
//       const loggedUser: User = {
//         id: '1',
//         email,
//         name: email.split('@')[0],
//       };
//       setUser(loggedUser);
//       localStorage.setItem('user', JSON.stringify(loggedUser));
//       setIsLoading(false);
//       return true;
//     }
//     setIsLoading(false);
//     return false;
//   };

//   // Google login hook from @react-oauth/google
//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setIsLoading(true);
//       try {
//         // Fetch user profile from Google
//         const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//         });
//         const profile = await res.json();

//         // const response = await fetch("http://localhost:8000/api/v1/storage/generate-upload-url"
//         // Send token to your backend for verification and user session creation
//         const resp = await axios.post('http://localhost:8000/api/v1/auth/google-login', {
//           id_token: tokenResponse.access_token, // Or id_token if you have it
//         });

//         setUser(resp.data.user);
//         localStorage.setItem('user', JSON.stringify(resp.data.user));
//         localStorage.setItem('token', resp.data.token);
//       } catch (error) {
//         alert('Backend login error');
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     onError: () => {
//       alert('Google login failed');
//       setIsLoading(false);
//     },
//     scope: 'openid email profile',
//   });

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     googleLogout();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
