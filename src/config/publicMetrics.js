const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://yrlxuxpbgazqgdxwvpme.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybHh1eHBiZ2F6cWdkeHd2cG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NDkzODQsImV4cCI6MjA4ODAyNTM4NH0.VFeEQHSW1sEzOdq6w-zOyBLqX0hfxT7L0DH-1XMrRmU";

const RPC_BASE_URL = `${SUPABASE_URL}/rest/v1/rpc`;

function createHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

export async function fetchPublicSiteMetrics() {
  const response = await fetch(`${RPC_BASE_URL}/get_public_site_metrics`, {
    method: "POST",
    headers: createHeaders(),
    body: "{}",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Metrics request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const metrics = Array.isArray(payload) ? payload[0] : payload;

  return {
    appDownloads: Number(metrics?.app_downloads ?? 0),
    activeFans30d: Number(metrics?.active_fans_30d ?? 0),
    publishedSongs: Number(metrics?.published_songs ?? 0),
  };
}

export async function fetchPublicMobileReleaseInfo() {
  const response = await fetch(`${RPC_BASE_URL}/get_public_mobile_release_info`, {
    method: "POST",
    headers: createHeaders(),
    body: "{}",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Release request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const release = Array.isArray(payload) ? payload[0] : payload;

  return {
    version: release?.version ?? null,
    notes: release?.notes ?? null,
    publishedAt: release?.published_at ?? null,
    apkSizeBytes: Number(release?.apk_size_bytes ?? 0),
  };
}

export async function trackPublicDownload(source = "site") {
  const response = await fetch(`${RPC_BASE_URL}/track_public_download`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify({ p_source: source }),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Track download failed with status ${response.status}`);
  }
}
