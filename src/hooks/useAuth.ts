import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getRedirectUrl = () => {
    // Utiliser l'URL de StackBlitz
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}/dashboard`;
  };

  const signIn = async (email: string, password?: string) => {
    try {
      if (email === 'pipehaut@gmail.com') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'admin123',
        });

        if (error) {
          return await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: getRedirectUrl(),
            },
          });
        }

        return { data, error: null };
      } else {
        return await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: getRedirectUrl(),
          },
        });
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      return { data: null, error: err };
    }
  };

  const signOut = () => supabase.auth.signOut();

  const isAdmin = user?.email === 'pipehaut@gmail.com';

  return { user, loading, error, signIn, signOut, isAdmin };
}