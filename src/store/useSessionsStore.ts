import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  title: string;
  description: string;
  audio_path: string;
  duration: string;
  created_at: string;
}

interface SessionsState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
}

export const useSessionsStore = create<SessionsState>((set) => ({
  sessions: [],
  loading: false,
  error: null,
  fetchSessions: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

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

      set({ sessions: sessionsWithUrls, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Erreur de chargement', 
        loading: false 
      });
    }
  }
}));