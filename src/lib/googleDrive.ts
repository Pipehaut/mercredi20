import { GOOGLE_API_KEY, CORS_PROXY } from './config';

export async function getAudioUrl(driveUrl: string) {
  try {
    // Extraire l'ID du fichier
    const fileId = driveUrl.match(/[-\w]{25,}/)?.[0];
    if (!fileId) throw new Error('ID de fichier invalide');

    // Construire l'URL de streaming
    const streamUrl = `${CORS_PROXY}https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_API_KEY}`;
    
    // Vérifier que le fichier est accessible
    const response = await fetch(streamUrl, { method: 'HEAD' });
    if (!response.ok) throw new Error('Fichier inaccessible');

    return streamUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL:', error);
    throw error;
  }
}