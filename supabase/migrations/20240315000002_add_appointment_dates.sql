-- Add appointment dates to user_profiles table
alter table user_profiles add column first_appointment_date date;
alter table user_profiles add column second_appointment_date date;