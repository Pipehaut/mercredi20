-- Mise à jour de la table sessions
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS audio_source_check;

-- Recréer la table avec la bonne structure
CREATE TABLE IF NOT EXISTS sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  audio_path text,
  external_url text,
  duration text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT audio_source_check CHECK (
    (audio_path IS NOT NULL) OR (external_url IS NOT NULL)
  )
);

-- Mettre à jour les politiques
DROP POLICY IF EXISTS "Tout le monde peut lire les sessions" ON sessions;
DROP POLICY IF EXISTS "Seul l'admin peut modifier les sessions" ON sessions;
DROP POLICY IF EXISTS "Seul l'admin peut mettre à jour les sessions" ON sessions;

CREATE POLICY "Lecture des sessions autorisée"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Modification des sessions par admin"
  ON sessions FOR ALL
  TO authenticated
  USING (auth.email() = 'pipehaut@gmail.com')
  WITH CHECK (auth.email() = 'pipehaut@gmail.com');