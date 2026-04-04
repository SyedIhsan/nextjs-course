export function getBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;

  if (!configuredUrl) {
    return "http://localhost:3000";
  }

  if (configuredUrl.startsWith("http://") || configuredUrl.startsWith("https://")) {
    return configuredUrl;
  }

  return `https://${configuredUrl}`;
}