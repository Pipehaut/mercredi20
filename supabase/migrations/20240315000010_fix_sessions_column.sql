-- Mise à jour de la table sessions
ALTER TABLE sessions 
  DROP COLUMN IF EXISTS order_num CASCADE,
  DROP COLUMN IF EXISTS order CASCADE;

-- Ajout de la colonne session_order
ALTER TABLE sessions 
  ADD COLUMN session_order INTEGER NOT NULL DEFAULT 0;