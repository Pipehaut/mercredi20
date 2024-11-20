import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Loader2, Link } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface SessionFormProps {
  session?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SessionForm({ session, onClose, onSuccess }: SessionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: session?.title || '',
    description: session?.description || '',
    date: session?.date || '',
    duration: session?.duration || '',
    audioFile: null as File | null,
    externalUrl: session?.external_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let audio_path = session?.audio_path;
      let external_url = formData.externalUrl;

      // Si un fichier est fourni, uploader dans Supabase et ignorer l'URL externe
      if (formData.audioFile) {
        const fileExt = formData.audioFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `sessions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('audio-sessions')
          .upload(filePath, formData.audioFile);

        if (uploadError) throw uploadError;
        audio_path = filePath;
        external_url = null;
      }
      // Si une URL externe est fournie et pas de fichier, utiliser l'URL
      else if (formData.externalUrl && !formData.audioFile) {
        audio_path = null;
        external_url = formData.externalUrl;
      }

      const sessionData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        duration: formData.duration,
        audio_path,
        external_url
      };

      if (session?.id) {
        const { error } = await supabase
          .from('sessions')
          .update(sessionData)
          .match({ id: session.id });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sessions')
          .insert([sessionData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {session ? 'Modifier la séance' : 'Nouvelle séance'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Titre"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            required
            className="w-full rounded-md border border-gray-300 p-2"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Input
          type="date"
          label="Date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <Input
          label="Durée (ex: 23:45)"
          required
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Source audio</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">URL Google Drive</label>
            <Input
              type="url"
              placeholder="https://drive.google.com/..."
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
            />
            <p className="text-sm text-gray-500">
              OU
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Fichier audio local</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] || null })}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  );
}