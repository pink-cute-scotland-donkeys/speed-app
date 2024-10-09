'use client';

import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    setToken(token);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setError('Failed to load profile');
      }
    } catch (err) {
      localStorage.removeItem('token');
      setError('An error occurred');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        await fetchProfile();
        router.push('/profile');
        return;
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
    toast({
      variant: 'default',
      title: 'Logged out',
      description: 'You have been logged out',
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
