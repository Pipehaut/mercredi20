import React, { useEffect } from 'react';
import { useSessionsStore } from '../store/useSessionsStore';
import AudioPlayer from './AudioPlayer';
import { Card } from './ui/Card';

export default function SessionsView() {
  const { sessions, loading, error, fetchSessions } = useSessionsStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-red-600">
        Une erreur est survenue: {error}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <AudioPlayer
          key={session.id}
          title={session.title}
          url={session.audio_url}
          duration={session.duration}
        />
      ))}
    </div>
  );
}