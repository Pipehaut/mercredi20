-- Add quit date and savings fields to profiles
alter table user_profiles add column quit_date date;
alter table user_profiles add column daily_cigarettes integer;
alter table user_profiles add column pack_price numeric(10,2);