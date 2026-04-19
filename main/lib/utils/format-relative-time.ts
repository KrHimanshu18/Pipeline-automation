/** Human-readable relative time for a past or future ISO timestamp. */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const now = Date.now();
  let diffSec = Math.round((then - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");

  let diffMin = diffSec / 60;
  if (Math.abs(diffMin) < 60) return rtf.format(Math.round(diffMin), "minute");

  let diffHr = diffMin / 60;
  if (Math.abs(diffHr) < 24) return rtf.format(Math.round(diffHr), "hour");

  let diffDay = diffHr / 24;
  if (Math.abs(diffDay) < 7) return rtf.format(Math.round(diffDay), "day");

  let diffWeek = diffDay / 7;
  if (Math.abs(diffWeek) < 5) return rtf.format(Math.round(diffWeek), "week");

  let diffMonth = diffDay / 30;
  if (Math.abs(diffMonth) < 12) return rtf.format(Math.round(diffMonth), "month");

  const diffYear = diffDay / 365;
  return rtf.format(Math.round(diffYear), "year");
}
