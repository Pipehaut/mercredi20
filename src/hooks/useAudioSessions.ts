import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AudioSession {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  date: string;
}

export function useAudioSessions() {
  const [sessions, setSessions] = useState<AudioSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      console.log('🔄 Début du chargement des sessions...');
      setLoading(true);
      setError(null);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: true });

      if (sessionsError) {
        console.error('❌ Erreur lors de la récupération des sessions:', sessionsError);
        throw sessionsError;
      }

      console.log('✅ Sessions récupérées:', sessionsData);

      // Traiter chaque session
      const processedSessions = (sessionsData || []).map((session) => {
        // Si une URL externe (Google Drive) existe, l'utiliser directement
        if (session.external_url) {
          console.log(`📎 Utilisation de l'URL externe pour ${session.title}:`, session.external_url);
          return {
            id: session.id,
            title: session.title,
            description: session.description,
            url: session.external_url,
            duration: session.duration,
            date: session.date
          };
        }

        // Sinon, générer l'URL Supabase Storage
        const { data } = supabase.storage
          .from('audio-sessions')
          .getPublicUrl(session.audio_path);

        console.log(`🎵 URL générée pour ${session.title}:`, data.publicUrl);
        
        return {
          id: session.id,
          title: session.title,
          description: session.description,
          url: data.publicUrl,
          duration: session.duration,
          date: session.date
        };
      });

      console.log('✅ Sessions traitées:', processedSessions);
      setSessions(processedSessions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue';
      console.error('❌ Erreur:', message);
      setError(message);
    } finally {
      setLoading(false);
      console.log('✅ Chargement terminé');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, loading, error, refetch: fetchSessions };
}