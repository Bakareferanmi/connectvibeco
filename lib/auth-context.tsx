"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id?: number;
  name: string;
  email: string;
  isAdmin?: boolean;
  avatarUrl?: string;
  avatarPreset?: string;
  pronouns?: string;
  orientation?: string;
  bio?: string;
  age?: number;
  city?: string;
  interests?: string[];
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

interface ProfileUpdates {
  avatarUrl?: string;
  avatarPreset?: string;
  pronouns?: string;
  orientation?: string;
  bio?: string;
  age?: number;
  city?: string;
  interests?: string[];
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdates) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Extended profile fields aren't in the DB yet — kept client-side for now,
// merged on top of the real server identity. Move these into `users` columns
// (and a PATCH /api/auth/me route) as a follow-up.
const PROFILE_KEY = "cvc_profile_extras";

function readProfileExtras(email: string): ProfileUpdates {
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY}:${email.toLowerCase()}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProfileExtras(email: string, updates: ProfileUpdates) {
  try {
    localStorage.setItem(`${PROFILE_KEY}:${email.toLowerCase()}`, JSON.stringify(updates));
  } catch {
    // storage unavailable - ignore
  }
}

async function fetchMe(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.user) return null;
    const extras = readProfileExtras(data.user.email);
    return { ...data.user, isAdmin: !!data.user.is_admin, ...extras };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function signup(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { success: false, error: data.error ?? "Could not create account." };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { success: false, error: data.error ?? "Incorrect email or password." };
      }
      const extras = readProfileExtras(data.user.email);
      setUser({ ...data.user, isAdmin: !!data.user.is_admin, ...extras });
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  // Real Google OAuth isn't wired up yet — flagging clearly rather than
  // quietly keeping the old mock. Wire this to a proper OAuth provider
  // (e.g. NextAuth with a Google provider) before relying on it.
  async function loginWithGoogle(): Promise<AuthResult> {
    return { success: false, error: "Google sign-in isn't connected yet." };
  }

  function updateProfile(updates: ProfileUpdates) {
    setUser((current) => {
      if (!current) return current;
      const updated: User = { ...current, ...updates };
      writeProfileExtras(current.email, updates);
      return updated;
    });
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
