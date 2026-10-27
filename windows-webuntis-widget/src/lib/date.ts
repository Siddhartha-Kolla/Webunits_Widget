const WEEKDAY_NAMES = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

// Turns a Date into text like "Montag, 22.06.2026" for the header.
export function formatDateForHeader(date: Date): string {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${weekday}, ${day}.${month}.${year}`;
}

// Turns a Date into "2026-06-22" so we can send it to Rust.
export function formatDateForBackend(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
