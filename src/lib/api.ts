import { supabase } from './supabase';

export async function fetchSessions() {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sessions:', error);
    throw error;
  }
}

export async function addSession(sessionData: {
  title: string;
  description: string;
  external_url: string;
  duration: string;
  date: string;
}) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        ...sessionData,
        date: sessionData.date || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la session:', error);
    throw error;
  }
}

export async function deleteSession(id: string) {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la session:', error);
    throw error;
  }
}