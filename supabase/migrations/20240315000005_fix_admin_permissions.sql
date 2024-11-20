-- Donner les permissions d'admin à l'utilisateur admin
create or replace function is_admin()
returns boolean as $$
begin
  return auth.email() = 'pipehaut@gmail.com';
end;
$$ language plpgsql security definer;

-- Mettre à jour les politiques pour utiliser la fonction is_admin
drop policy if exists "Profiles are viewable by admin" on user_profiles;
drop policy if exists "Profiles are insertable by admin" on user_profiles;
drop policy if exists "Profiles are updatable by admin" on user_profiles;

create policy "Profiles are viewable by admin"
  on user_profiles for select
  using (is_admin());

create policy "Profiles are insertable by admin"
  on user_profiles for insert
  with check (is_admin());

create policy "Profiles are updatable by admin"
  on user_profiles for update
  using (is_admin());