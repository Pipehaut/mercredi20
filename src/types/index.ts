export interface Session {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration: string;
  date: string;
  order: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  tobacco_type: 'cigarette' | 'rolling';
  daily_consumption: number;
  package_price: number;
  smoking_habits: string[];
  start_date: string;
  created_at: string;
  updated_at: string;
}