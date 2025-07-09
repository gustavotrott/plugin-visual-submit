/**
 * Formats a date into a human-readable relative time string
 * @param date - The date to format
 * @returns A string representing the relative time (e.g., "Just now", "5 min ago", "2 hours ago")
 */
export const formatUploadTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};
