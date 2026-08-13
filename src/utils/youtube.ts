/** Extracts an 11-character YouTube video ID from a URL or bare ID string. */
export function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return urlOrId.length === 11 ? urlOrId : null;
}
