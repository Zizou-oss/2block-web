// Configuration du telechargement APK via GitHub Releases
export const APK_CONFIG = {
  // URL directe du fichier APK publie dans GitHub Releases
  // Format: https://github.com/OWNER/REPO/releases/download/TAG/FILENAME.apk
  downloadUrl:
    'https://github.com/Zizou-oss/my_music/releases/download/V.1.3.1/2block-music-arm64-v8a.apk',
  // APKs split (optionnel) - pour réduire la taille
  downloadUrlArm64:
    'https://github.com/Zizou-oss/my_music/releases/download/V.1.3.1/2block-music-arm64-v8a.apk',
  downloadUrlArmv7:
    'https://github.com/Zizou-oss/my_music/releases/download/V.1.3.1/2block-music-armeabi-v7a.apk',
  downloadUrlX86_64: '',
  downloadUrlX86: '',
  // URL stable de la page de telechargement sur le site
  landingPath: '/telecharger/android',
  fileName: '2block-musique.apk',
  version: '1.3.1',
  size: '30.2 MB',
  releaseDate: 'Mars 2026',
  releasePage: 'https://github.com/Zizou-oss/my_music/releases/tag/V.1.3.1',
};

/**
 * Retourne l'URL de téléchargement direct depuis GitHub Releases
 */
export function getDirectDownloadUrl(abi) {
  const url = getDownloadUrlForAbi(abi);
  return url || APK_CONFIG.downloadUrl;
}

/**
 * Détection best-effort de l'architecture Android
 */
export async function detectAndroidAbi() {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('arm64') || ua.includes('aarch64') || ua.includes('armv8')) {
    return 'arm64';
  }
  if (ua.includes('armv7') || ua.includes('armeabi') || ua.includes('armv6')) {
    return 'armv7';
  }
  if (ua.includes('x86_64') || ua.includes('amd64')) {
    return 'x86_64';
  }
  if (ua.includes(' x86') || ua.includes('i686')) {
    return 'x86';
  }

  if (navigator.userAgentData?.getHighEntropyValues) {
    try {
      const hints = await navigator.userAgentData.getHighEntropyValues([
        'architecture',
        'bitness',
        'platform',
      ]);
      const platform = (hints.platform || '').toLowerCase();
      const arch = (hints.architecture || '').toLowerCase();
      const bitness = String(hints.bitness || '');

      if (platform.includes('android')) {
        if (arch.includes('arm') && bitness === '64') return 'arm64';
        if (arch.includes('arm') && bitness === '32') return 'armv7';
        if (arch.includes('x86') && bitness === '64') return 'x86_64';
        if (arch.includes('x86') && bitness === '32') return 'x86';
      }
    } catch (_) {
      // ignore
    }
  }

  return 'unknown';
}

/**
 * Retourne l'URL APK correspondant à l'ABI si configurée
 */
export function getDownloadUrlForAbi(abi, fallbackUrl) {
  const normalized = (abi || '').toLowerCase();
  const urlMap = {
    arm64: APK_CONFIG.downloadUrlArm64,
    armv7: APK_CONFIG.downloadUrlArmv7,
    x86_64: APK_CONFIG.downloadUrlX86_64,
    x86: APK_CONFIG.downloadUrlX86,
  };

  const resolved = urlMap[normalized] || '';
  return resolved || fallbackUrl || APK_CONFIG.downloadUrl;
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
export function startDirectAPKDownload(url, abi) {
  window.location.assign(url || getDirectDownloadUrl(abi));
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
  const urls = [
    APK_CONFIG.downloadUrl,
    APK_CONFIG.downloadUrlArm64,
    APK_CONFIG.downloadUrlArmv7,
    APK_CONFIG.downloadUrlX86_64,
    APK_CONFIG.downloadUrlX86,
  ].filter(Boolean);

  return urls.some((url) => 
    url.includes('github.com') && url.includes('releases/download')
  );
}
