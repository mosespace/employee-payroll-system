export function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function calculateHoursDifference(
  startTime: Date | null,
  endTime: Date | null,
): string {
  if (!startTime || !endTime) return '--';

  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const hours = Math.floor(diffHours);
  const minutes = Math.floor((diffHours - hours) * 60);

  return `${hours} h ${minutes} m`;
}
