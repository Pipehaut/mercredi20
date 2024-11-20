import { useState, useEffect } from 'react';
import { getAudioUrl } from '../lib/googleDrive';

export function useGoogleDriveAudio(driveUrl: string) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudioUrl() {
      try {
        setLoading(true);
        setError(null);
        const url = await getAudioUrl(driveUrl);
        setAudioUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        setAudioUrl(null);
      } finally {
        setLoading(false);
      }
    }

    if (driveUrl) {
      fetchAudioUrl();
    }
  }, [driveUrl]);

  return { audioUrl, loading, error };
}