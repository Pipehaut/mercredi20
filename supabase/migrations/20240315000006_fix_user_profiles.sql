-- Modifier la table user_profiles pour permettre l'insertion sans auth.users
ALTER TABLE user_profiles 
  DROP CONSTRAINT user_profiles_id_fkey,
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Mettre à jour les politiques
DROP POLICY IF EXISTS "Profiles are insertable by admin" ON user_profiles;
CREATE POLICY "Profiles are insertable by admin"
  ON user_profiles FOR INSERT
  WITH CHECK (is_admin());

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'first_appointment') THEN
    ALTER TABLE user_profiles ADD COLUMN first_appointment timestamp with time zone;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'second_appointment') THEN
    ALTER TABLE user_profiles ADD COLUMN second_appointment timestamp with time zone;
  END IF;
END $$;