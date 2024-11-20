import React from 'react';
import { useGoogleDriveAudio } from '../hooks/useGoogleDriveAudio';
import AudioPlayer from './AudioPlayer';

interface Props {
  title: string;
  driveUrl: string;
  duration: string;
}

export default function GoogleDriveAudio({ title, driveUrl, duration }: Props) {
  const { audioUrl, loading, error } = useGoogleDriveAudio(driveUrl);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <AudioPlayer
      title={title}
      url={audioUrl}
      duration={duration}
      error={error}
    />
  );
}