-- Modify appointment columns to include time
ALTER TABLE user_profiles 
  DROP COLUMN first_appointment_date,
  DROP COLUMN second_appointment_date,
  ADD COLUMN first_appointment timestamp with time zone,
  ADD COLUMN second_appointment timestamp with time zone;