// Configuration du téléchargement APK via GitHub Releases
export const APK_CONFIG = {
  // ⚠️ IMPORTANT : Remplacez cette URL par celle que vous avez copiée depuis GitHub
  // Format : https://github.com/USERNAME/REPO/releases/download/TAG/FILENAME.apk
  downloadUrl: 'https://github.com/Zizou-oss/2block-web/releases/download/v1.2.0/2block-musique.apk',
  
  fileName: '2block-musique.apk',
  version: '1.2.0',
  size: '165.12 MB',
  releaseDate: 'Février 2025',
  
  // Lien vers la page de release (pour voir les notes de version)
  releasePage: 'https://github.com/Zizou-oss/2block-web/releases/tag/v1.2.0'
};

/**
 * Retourne l'URL de téléchargement direct depuis GitHub Releases
 */
export function getDirectDownloadUrl() {
  return APK_CONFIG.downloadUrl;
}

/**
 * Gère le téléchargement de l'APK
 * Utilise window.location.href pour forcer le téléchargement immédiat
 */
export function handleAPKDownload() {
  // Méthode 1 : Téléchargement direct (recommandé)
  window.location.href = getDirectDownloadUrl();
  
  // Alternative : Ouvrir dans un nouvel onglet
  // window.open(getDirectDownloadUrl(), '_blank');
}

/**
 * Vérifie si l'URL de téléchargement est valide
 */
export function isDownloadConfigured() {
  return APK_CONFIG.downloadUrl && 
         APK_CONFIG.downloadUrl.includes('github.com') &&
         APK_CONFIG.downloadUrl.includes('releases/download');
}