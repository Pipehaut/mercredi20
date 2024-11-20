-- Enable RLS
alter table sessions enable row level security;
alter table user_profiles enable row level security;

-- Create user_profiles table
create table user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  tobacco_type text not null check (tobacco_type in ('cigarette', 'rolling')),
  daily_consumption integer not null check (daily_consumption > 0),
  package_price numeric(10,2) not null check (package_price > 0),
  smoking_habits text[] not null,
  start_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create sessions table
create table sessions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  audio_path text not null,
  duration text not null,
  date date not null,
  order_num integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create policies for user_profiles
create policy "Users can view their own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- Create policies for sessions
create policy "Anyone can view sessions"
  on sessions for select
  to authenticated
  using (true);

create policy "Only admins can insert sessions"
  on sessions for insert
  to authenticated
  using (auth.email() = 'pipehaut@gmail.com');

create policy "Only admins can update sessions"
  on sessions for update
  to authenticated
  using (auth.email() = 'pipehaut@gmail.com');

create policy "Only admins can delete sessions"
  on sessions for delete
  to authenticated
  using (auth.email() = 'pipehaut@gmail.com');

-- Storage policies for audio-sessions bucket
create policy "Anyone can read audio files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'audio-sessions');

create policy "Only admins can upload audio files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'audio-sessions' 
    and auth.email() = 'pipehaut@gmail.com'
  );

create policy "Only admins can update audio files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'audio-sessions'
    and auth.email() = 'pipehaut@gmail.com'
  );

create policy "Only admins can delete audio files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'audio-sessions'
    and auth.email() = 'pipehaut@gmail.com'
  );

-- Create function to handle profile updates
create or replace function handle_profile_updated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for profile updates
create trigger on_profile_updated
  before update on user_profiles
  for each row
  execute procedure handle_profile_updated();