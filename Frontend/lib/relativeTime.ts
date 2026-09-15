/**
 * Calculates relative published time based strictly on the Admin's publishing timestamp (publishedAt).
 * - Under 1 min: "Just now"
 * - Under 60 mins: "X mins ago" / "1 min ago"
 * - 1 to 23 hours: "X hours ago" / "1 hour ago"
 * - 24 hours or more: "X days ago" / "1 day ago"
 */
export function getRelativeTime(publishedAt?: number | string | null, dateFallback?: string): string {
  let timeMs: number = 0;

  if (typeof publishedAt === "number" && publishedAt > 0) {
    timeMs = publishedAt;
  } else if (typeof publishedAt === "string" && !isNaN(Number(publishedAt)) && Number(publishedAt) > 0) {
    timeMs = Number(publishedAt);
  } else if (dateFallback) {
    const parsed = Date.parse(dateFallback);
    if (!isNaN(parsed)) {
      timeMs = parsed;
    }
  }

  if (!timeMs) return "Recently";

  const now = Date.now();
  const diffMs = Math.max(0, now - timeMs);
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "min ago" : "mins ago"}`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour ago" : "hours ago"}`;
  } else {
    return `${diffDays} ${diffDays === 1 ? "day ago" : "days ago"}`;
  }
}

export default getRelativeTime;
