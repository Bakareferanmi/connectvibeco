"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  avatarPreset?: string;
  pronouns?: string;
  orientation?: string;
  bio?: string;
}

interface StoredUser extends User {
  password: string | null;
  provider: "password" | "google";
}

interface ProfileUpdates {
  avatarUrl?: string;
  avatarPreset?: string;
  pronouns?: string;
  orientation?: string;
  bio?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  loginWithGoogle: () => { success: boolean };
  logout: () => void;
  updateProfile: (updates: ProfileUpdates) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "cvc_users";
const SESSION_KEY = "cvc_session";

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  function signup(name: string, email: string, password: string) {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "An account with that email already exists." };
    }
    const newUser: StoredUser = { name, email, password, provider: "password" };
    saveUsers([...users, newUser]);
    const publicUser: User = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return { success: true };
  }

  function login(email: string, password: string) {
    const users = getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.provider === "password" && u.password === password
    );
    if (!match) {
      return { success: false, error: "Incorrect email or password." };
    }
    const publicUser: User = {
      name: match.name,
      email: match.email,
      avatarUrl: match.avatarUrl,
      avatarPreset: match.avatarPreset,
      pronouns: match.pronouns,
      orientation: match.orientation,
      bio: match.bio,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return { success: true };
  }

  function loginWithGoogle() {
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === "alex.rivera@gmail.com");
    if (existing) {
      const publicUser: User = {
        name: existing.name,
        email: existing.email,
        avatarUrl: existing.avatarUrl,
        avatarPreset: existing.avatarPreset,
        pronouns: existing.pronouns,
        orientation: existing.orientation,
        bio: existing.bio,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);
      return { success: true };
    }
    const demoUser: StoredUser = {
      name: "Alex Rivera",
      email: "alex.rivera@gmail.com",
      password: null,
      provider: "google",
    };
    saveUsers([...users, demoUser]);
    const publicUser: User = { name: demoUser.name, email: demoUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return { success: true };
  }

  function updateProfile(updates: ProfileUpdates) {
    setUser((current) => {
      if (!current) return current;
      const updated: User = {
        ...current,
        avatarUrl: updates.avatarUrl,
        avatarPreset: updates.avatarPreset,
        pronouns: updates.pronouns,
        orientation: updates.orientation,
        bio: updates.bio,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

      const users = getUsers();
      const nextUsers = users.map((u) =>
        u.email.toLowerCase() === current.email.toLowerCase()
          ? {
              ...u,
              avatarUrl: updates.avatarUrl,
              avatarPreset: updates.avatarPreset,
              pronouns: updates.pronouns,
              orientation: updates.orientation,
              bio: updates.bio,
            }
          : u
      );
      saveUsers(nextUsers);

      return updated;
    });
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
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
