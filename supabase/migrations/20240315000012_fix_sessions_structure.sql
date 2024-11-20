-- Supprimer la table sessions si elle existe
DROP TABLE IF EXISTS sessions CASCADE;

-- Créer la table sessions avec la bonne structure
CREATE TABLE sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  audio_path text NOT NULL,
  duration text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activer RLS (Row Level Security)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Créer les politiques d'accès
CREATE POLICY "Tout le monde peut lire les sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seul l'admin peut modifier les sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'pipehaut@gmail.com');

CREATE POLICY "Seul l'admin peut mettre à jour les sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.email() = 'pipehaut@gmail.com');

-- Insérer les données initiales
INSERT INTO sessions (title, description, audio_path, duration, date) VALUES
  (
    'Apaiser les pensées et dormir',
    'Séance de relaxation pour le soir',
    'Apaiser les pensees et dormir.mp3',
    '23:36',
    CURRENT_DATE
  ),
  (
    'Hypnose 4',
    'Séance d''hypnose guidée',
    'Hypnose 4.mp3',
    '18:45',
    CURRENT_DATE
  );

-- Créer les politiques de stockage pour le bucket audio-sessions
INSERT INTO storage.buckets (id, name)
VALUES ('audio-sessions', 'audio-sessions')
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Les fichiers audio sont accessibles publiquement"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'audio-sessions');

CREATE POLICY "Seul l'admin peut uploader des fichiers audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio-sessions' 
    AND auth.email() = 'pipehaut@gmail.com'
  );