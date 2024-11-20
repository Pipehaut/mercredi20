-- Simplifier la structure de la table sessions
ALTER TABLE sessions 
  DROP COLUMN IF EXISTS session_order CASCADE,
  DROP COLUMN IF EXISTS order_num CASCADE,
  DROP COLUMN IF EXISTS order CASCADE;

-- S'assurer que les colonnes essentielles existent
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sessions' AND column_name = 'audio_path') THEN
    ALTER TABLE sessions ADD COLUMN audio_path text NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sessions' AND column_name = 'duration') THEN
    ALTER TABLE sessions ADD COLUMN duration text NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sessions' AND column_name = 'description') THEN
    ALTER TABLE sessions ADD COLUMN description text NOT NULL;
  END IF;
END $$;