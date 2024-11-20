import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { Card } from './ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SessionsContainer() {
  const { data: sessions, isLoading, error } = useSessions();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-destructive bg-destructive/10">
        Une erreur est survenue lors du chargement des séances
      </Card>
    );
  }

  if (!sessions?.length) {
    return (
      <Card className="p-4 text-foreground bg-background">
        Aucune séance audio n'est disponible pour le moment
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="p-4 hover:shadow-lg transition-shadow bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-lg text-foreground">{session.title}</h3>
              <p className="text-sm text-muted-foreground">{session.description}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Durée: {session.duration}</span>
                <span>•</span>
                <span>
                  {format(new Date(session.date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
            <a
              href={session.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <span>Accéder à ma séance</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}