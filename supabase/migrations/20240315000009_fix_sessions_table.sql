-- Drop and recreate sessions table with correct structure
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  audio_path text NOT NULL,
  duration text NOT NULL,
  date date NOT NULL,
  session_order integer NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'pipehaut@gmail.com');

CREATE POLICY "Only admins can update sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.email() = 'pipehaut@gmail.com');

CREATE POLICY "Only admins can delete sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (auth.email() = 'pipehaut@gmail.com');