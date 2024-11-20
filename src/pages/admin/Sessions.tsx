import React, { useState } from 'react';
import { Plus, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { addSession, deleteSession } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export default function Sessions() {
  const { data: sessions, refetch } = useSessions();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    external_url: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addSession(formData);
      setFormData({
        title: '',
        description: '',
        external_url: '',
        duration: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteSession(id);
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la séance');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gestion des séances audio</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setError(null);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle séance
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Titre"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea
                required
                className="w-full rounded-md border border-input bg-background text-foreground p-2 focus:ring-2 focus:ring-primary"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Input
              label="URL Google Drive"
              required
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={formData.external_url}
              onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
            />

            <Input
              label="Durée (ex: 23:45)"
              required
              pattern="^\d{1,2}:\d{2}$"
              placeholder="MM:SS"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />

            <Input
              label="Date de publication"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit" loading={loading}>
                Ajouter la séance
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {sessions?.map((session) => (
          <Card key={session.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{session.title}</h3>
                <p className="text-sm text-muted-foreground">{session.description}</p>
                <p className="text-sm text-muted-foreground">Durée: {session.duration}</p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={session.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                  Vérifier l'audio
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  onClick={() => handleDelete(session.id)}
                  loading={deletingId === session.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}