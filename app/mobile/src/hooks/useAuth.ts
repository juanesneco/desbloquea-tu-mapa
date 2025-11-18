// Authentication hook for mobile app

import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getUserRole } from '../lib/supabase';
import { UserRole as AppUserRole } from '../types';

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppUserRole | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        role: null,
        loading: false,
      });

      // Fetch user role if authenticated
      if (session?.user) {
        getUserRole(session.user.id).then((role) => {
          setAuthState((prev) => ({
            ...prev,
            role: role || 'viewer',
          }));
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        role: null,
        loading: false,
      });

      // Fetch user role if authenticated
      if (session?.user) {
        const role = await getUserRole(session.user.id);
        setAuthState((prev) => ({
          ...prev,
          role: role || 'viewer',
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const role = await getUserRole(data.user.id);
      setAuthState((prev) => ({
        ...prev,
        user: data.user,
        session: data.session,
        role: role || 'viewer',
      }));
    }

    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // New users default to 'viewer' role (set in database)
    if (data.user) {
      setAuthState((prev) => ({
        ...prev,
        user: data.user,
        session: data.session,
        role: 'viewer',
      }));
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setAuthState({
      user: null,
      session: null,
      role: null,
      loading: false,
    });
  };

  // Calculate booleans explicitly - React Native bridge requires strict types
  // Use ternary to ensure we always get true/false, never undefined or other values
  const isAuthenticatedValue: boolean = (authState.user !== null && authState.user !== undefined) ? true : false;
  const isContributorValue: boolean = (authState.role === 'contributor') ? true : false;
  const isLoadingValue: boolean = (authState.loading === true) ? true : false;

  return {
    user: authState.user,
    session: authState.session,
    role: authState.role,
    loading: isLoadingValue,
    signIn,
    signUp,
    signOut,
    isAuthenticated: isAuthenticatedValue,
    isContributor: isContributorValue,
  };
}

