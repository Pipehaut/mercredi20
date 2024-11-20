import { supabase } from './supabase';

export async function initDatabase() {
  try {
    console.log('🔄 Initialisation des sessions...');
    
    // Vérifier si des sessions existent déjà
    const { data: existingSessions, error: checkError } = await supabase
      .from('sessions')
      .select('*');

    if (checkError) {
      throw new Error(`Erreur de vérification: ${checkError.message}`);
    }

    // Ne rien faire si des sessions existent déjà
    if (existingSessions && existingSessions.length > 0) {
      console.log('✅ Les sessions existent déjà');
      return;
    }

    // Insérer les sessions initiales
    const { error: insertError } = await supabase
      .from('sessions')
      .insert([
        {
          title: 'Apaiser les pensées et dormir',
          description: 'Séance de relaxation pour le soir',
          audio_path: 'Apaiser les pensees et dormir.mp3',
          duration: '23:36',
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: 'Hypnose 4',
          description: 'Séance d\'hypnose guidée',
          audio_path: 'Hypnose 4.mp3',
          duration: '18:45',
          date: new Date().toISOString().split('T')[0]
        }
      ]);

    if (insertError) {
      throw new Error(`Erreur d'insertion: ${insertError.message}`);
    }

    console.log('✅ Sessions initialisées avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}