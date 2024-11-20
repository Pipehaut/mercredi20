-- Mettre à jour les politiques de stockage pour restreindre l'accès
DROP POLICY IF EXISTS "Les fichiers audio sont accessibles publiquement" ON storage.objects;
DROP POLICY IF EXISTS "Seul l'admin peut uploader des fichiers audio" ON storage.objects;

-- Créer une nouvelle politique plus restrictive
CREATE POLICY "Accès streaming uniquement"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audio-sessions'
    AND (current_setting('request.headers')::json->>'sec-fetch-mode')::text = 'cors'
  );

CREATE POLICY "Upload admin uniquement"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio-sessions'
    AND auth.email() = 'pipehaut@gmail.com'
  );

-- Ajouter des en-têtes de sécurité pour le bucket
UPDATE storage.buckets
SET public = false,
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav'],
    avif_autodetection = false
WHERE id = 'audio-sessions';