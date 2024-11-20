-- Modifier la table sessions pour supporter les URLs externes
ALTER TABLE sessions
  ADD COLUMN external_url text,
  ALTER COLUMN audio_path DROP NOT NULL;

-- Mettre à jour la contrainte pour s'assurer qu'au moins audio_path OU external_url est renseigné
ALTER TABLE sessions
  ADD CONSTRAINT audio_source_check 
  CHECK (
    (audio_path IS NOT NULL) OR (external_url IS NOT NULL)
  );