export function formatWatts(watts: number | undefined): string {
  if (watts === undefined || watts === null) return "—";
  if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
  return `${Math.round(watts)} W`;
}

export function formatBatteryLevel(level: number | undefined): string {
  if (level === undefined || level === null) return "—";
  return `${Math.round(level)}%`;
}

export function formatMinutes(minutes: number | undefined): string {
  if (minutes === undefined || minutes === null || minutes <= 0) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatTemperature(celsius: number | undefined): string {
  if (celsius === undefined || celsius === null) return "—";
  return `${Math.round(celsius)}°C`;
}
