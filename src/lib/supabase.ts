import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://iymjmcjeslmsxilwgwsu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bWptY2plc2xtc3hpbHdnd3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NTc1MjgsImV4cCI6MjA0NzMzMzUyOH0.3S3I00c2Ewx2fmhvmDQGOLMm99Bcm_ujF8nFze3KTPI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

let isInitialized = false;

async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

export async function initializeSupabase() {
  if (isInitialized) return true;
  
  try {
    await retry(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        await supabase.auth.signInWithPassword({
          email: 'pipehaut@gmail.com',
          password: 'admin123'
        });
      }
    });

    await retry(async () => {
      const { error: pingError } = await supabase
        .from('sessions')
        .select('count')
        .limit(1)
        .single();

      if (pingError && pingError.code !== 'PGRST116') {
        throw new Error(`Erreur de connexion à la base de données: ${pingError.message}`);
      }
    });

    isInitialized = true;
    return true;
  } catch (error) {
    isInitialized = false;
    throw error;
  }
}