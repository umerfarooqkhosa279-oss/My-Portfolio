import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (usernameOrEmail: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured. Add .env values first.');
    let email = usernameOrEmail.trim();
    if (!email.includes('@')) {
      const { data, error } = await supabase.rpc('admin_email_for_username', { username_text: email });
      if (error || !data) throw new Error('Admin username was not found.');
      email = data as string;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: admin } = await supabase
      .from('admin_users')
      .select('auth_user_id')
      .eq('email', data.user.email)
      .maybeSingle();
   const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

if (adminError || isAdmin !== true) {
  await supabase.auth.signOut();
  throw new Error('This account is not listed as an admin.');
}

setUser(data.user ?? null);
  };

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); };

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
