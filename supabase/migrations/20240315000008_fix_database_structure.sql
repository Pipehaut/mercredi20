-- Supprimer les anciennes tables et fonctions si elles existent
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS handle_profile_updated CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;

-- Créer la fonction is_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN auth.email() = 'pipehaut@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer la table user_profiles avec la structure complète
CREATE TABLE user_profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  first_appointment timestamptz,
  second_appointment timestamptz,
  quit_date timestamptz,
  daily_cigarettes integer,
  pack_price numeric(10,2),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
CREATE POLICY "Profiles are viewable by admin"
  ON user_profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Profiles are insertable by admin"
  ON user_profiles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Profiles are updatable by admin"
  ON user_profiles FOR UPDATE
  USING (is_admin());

-- Créer la fonction de mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION handle_profile_updated()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour la mise à jour automatique
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_updated();

-- Créer un utilisateur admin si nécessaire
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM auth.users WHERE email = 'pipehaut@gmail.com'
  ) THEN
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      role
    ) VALUES (
      'pipehaut@gmail.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      'authenticated'
    );
  END IF;
END $$;