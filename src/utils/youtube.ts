const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
]);

const isYouTubeId = (value: string): boolean => YOUTUBE_ID_PATTERN.test(value);

/** Extract an 11-character YouTube video ID from a trusted URL or bare ID. */
export function getYouTubeId(urlOrId?: string): string | null {
  const value = urlOrId?.trim();
  if (!value) return null;
  if (isYouTubeId(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const pathParts = url.pathname.split('/').filter(Boolean);
  const candidate = url.hostname === 'youtu.be'
    ? pathParts[0]
    : pathParts[0] === 'watch'
      ? url.searchParams.get('v')
      : ['embed', 'shorts', 'live', 'v'].includes(pathParts[0] ?? '')
        ? pathParts[1]
        : null;

  return candidate && isYouTubeId(candidate) ? candidate : null;
}
