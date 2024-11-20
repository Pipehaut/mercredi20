import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration: string;
  created_at: string;
}

interface SessionsContextType {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const sessionsWithUrls = await Promise.all(
        (data || []).map(async (session) => {
          const { data: { publicUrl } } = supabase.storage
            .from('audio-sessions')
            .getPublicUrl(session.audio_path);
          
          return {
            ...session,
            audio_url: publicUrl
          };
        })
      );

      setSessions(sessionsWithUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <SessionsContext.Provider value={{ sessions, loading, error, refetch: fetchSessions }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
}