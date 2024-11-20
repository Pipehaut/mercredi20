-- Create user_profiles table
create table user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_profiles enable row level security;

-- Create policies
create policy "Profiles are viewable by admin"
  on user_profiles for select
  to authenticated
  using (auth.email() = 'pipehaut@gmail.com');

create policy "Profiles are insertable by admin"
  on user_profiles for insert
  to authenticated
  with check (auth.email() = 'pipehaut@gmail.com');

create policy "Profiles are updatable by admin"
  on user_profiles for update
  to authenticated
  using (auth.email() = 'pipehaut@gmail.com');