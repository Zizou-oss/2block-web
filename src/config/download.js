// Configuration du telechargement APK via GitHub Releases
export const APK_CONFIG = {
  // URL directe du fichier APK publie dans GitHub Releases
  // Format: https://github.com/OWNER/REPO/releases/download/TAG/FILENAME.apk
  downloadUrl:
    'https://github.com/Zizou-oss/my_music/releases/download/V.1.3.1/2block-music-1.3.1_4.apk',
  // URL stable de la page de telechargement sur le site
  landingPath: '/telecharger/android',
  fileName: '2block-music-1.3.1_4.apk',
  version: '1.3.1',
  size: '65.4 MB',
  releaseDate: 'Mars 2026',
  releasePage: 'https://github.com/Zizou-oss/my_music/releases/tag/V.1.3.1',
};

/**
 * Retourne l'URL de téléchargement direct depuis GitHub Releases
 */
export function getDirectDownloadUrl() {
  return APK_CONFIG.downloadUrl;
}

/**
 * Retourne l'URL stable de telechargement sur le site web
 */
export function getLandingUrl() {
  if (typeof window === 'undefined') {
    return APK_CONFIG.landingPath;
  }

  return new URL(APK_CONFIG.landingPath, window.location.origin).toString();
}

/**
 * Retourne l'URL de la page de release GitHub
 */
export function getReleasePageUrl() {
  return APK_CONFIG.releasePage;
}

/**
 * Lance le telechargement direct du fichier APK
 */
export function startDirectAPKDownload(url) {
  window.location.assign(url || getDirectDownloadUrl());
}

/**
 * Redirige vers la page stable du site dediee au telechargement Android
 */
export function handleAPKDownload() {
  if (window.location.pathname === APK_CONFIG.landingPath) {
    startDirectAPKDownload();
    return;
  }

  window.location.assign(getLandingUrl());
}

/**
 * Vérifie si l'URL de téléchargement est valide
 */
export function isDownloadConfigured() {
  return (
    APK_CONFIG.downloadUrl &&
    APK_CONFIG.downloadUrl.includes('github.com') &&
    APK_CONFIG.downloadUrl.includes('releases/download')
  );
}
