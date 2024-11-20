-- Supprimer la table existante et la recréer avec la bonne structure
DROP TABLE IF EXISTS user_profiles;

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
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recréer les politiques
DROP POLICY IF EXISTS "Profiles are viewable by admin" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are insertable by admin" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are updatable by admin" ON user_profiles;

CREATE POLICY "Profiles are viewable by admin"
  ON user_profiles FOR SELECT
  USING (auth.email() = 'pipehaut@gmail.com');

CREATE POLICY "Profiles are insertable by admin"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.email() = 'pipehaut@gmail.com');

CREATE POLICY "Profiles are updatable by admin"
  ON user_profiles FOR UPDATE
  USING (auth.email() = 'pipehaut@gmail.com');

-- Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;