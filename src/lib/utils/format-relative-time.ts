const units = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
] as const;

export function formatRelativeTime(date: Date | string | number, now = new Date()) {
  const target = new Date(date);
  const diffInSeconds = Math.round((target.getTime() - now.getTime()) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    if (absoluteSeconds >= seconds || unit === "second") {
      return formatter.format(Math.round(diffInSeconds / seconds), unit);
    }
  }
}
