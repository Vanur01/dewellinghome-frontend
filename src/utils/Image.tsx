export const getImageUrl = (path: string) => {
  if (!path) return ""; // fallback

  // If it's already a full URL (e.g., from Unsplash or S3), return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise, prepend the base URL
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return `${baseUrl}${path}`;
};
