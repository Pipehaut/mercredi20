import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface AudioPlayerProps {
  title: string;
  url: string | null;
  duration?: string;
  error?: string;
}

export default function AudioPlayer({ title, url, duration, error: initialError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState<string | null>(initialError || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`🎵 Initialisation du lecteur pour: ${title}`);
    
    if (!url) {
      setError('URL audio non disponible');
      setIsLoading(false);
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.oncontextmenu = (e) => {
        e.preventDefault();
        return false;
      };

      audio.preload = "metadata";
      audio.crossOrigin = "anonymous";

      setIsPlaying(false);
      setCurrentTime(0);
      setError(initialError || null);
      setIsLoading(true);

      const loadAudio = async () => {
        try {
          await audio.load();
          console.log(`✅ Audio chargé pour: ${title}`);
        } catch (err) {
          console.error(`❌ Erreur de chargement pour: ${title}`, err);
          setError('Erreur lors du chargement de l\'audio');
          setIsLoading(false);
        }
      };

      loadAudio();
    }

    return () => {
      if (audio) {
        audio.oncontextmenu = null;
        audio.pause();
        audio.src = "";
      }
    };
  }, [title, url, initialError]);

  const togglePlay = async () => {
    if (!audioRef.current || !url) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setError(null);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('❌ Erreur de lecture:', err);
      setError('Impossible de lire le fichier audio. Veuillez réessayer.');
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setTotalDuration(audioRef.current.duration);
    setIsLoading(false);
    setError(null);
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    console.error(`❌ Erreur de chargement pour: ${title}`, target.error);
    setError('Erreur lors du chargement de l\'audio. Vérifiez votre connexion.');
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 bg-card">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg text-foreground">{title}</h3>
          {duration && <span className="text-sm text-muted-foreground">{duration}</span>}
        </div>
        
        {error ? (
          <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {url && (
              <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={handleError}
                controlsList="nodownload noplaybackrate"
                preload="metadata"
                crossOrigin="anonymous"
              >
                <track kind="captions" />
              </audio>
            )}

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="hover:bg-primary/10"
                disabled={isLoading || !url}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-primary" />
                ) : (
                  <Play className="h-6 w-6 text-primary" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="hover:bg-primary/10"
                disabled={isLoading || !url}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-primary" />
                ) : (
                  <Volume2 className="h-5 w-5 text-primary" />
                )}
              </Button>

              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading || !url}
                />
              </div>

              <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}