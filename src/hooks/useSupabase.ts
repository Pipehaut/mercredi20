import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '../types';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('order_num', { ascending: true });

      if (fetchError) throw fetchError;

      const sessionsWithUrls = await Promise.all(
        (data || []).map(async (session) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('audio-sessions')
            .getPublicUrl(session.audio_path);

          return {
            ...session,
            audio_url: publicUrl,
          };
        })
      );

      setSessions(sessionsWithUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, refetch: fetchSessions };
}