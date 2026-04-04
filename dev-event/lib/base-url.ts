function normalizeUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export function getBaseUrlCandidates() {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  const vercel = process.env.VERCEL_URL;

  const candidates = [configured, vercel, "http://localhost:3000"]
    .filter((value): value is string => Boolean(value && value.trim()))
    .map((value) => normalizeUrl(value.trim()));

  return [...new Set(candidates)];
}

export function getBaseUrl() {
  return getBaseUrlCandidates()[0] || "http://localhost:3000";
}