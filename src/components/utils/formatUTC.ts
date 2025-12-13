export function toUTCDateString (dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return utcDate.toISOString();
};
