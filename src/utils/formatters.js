export function getSunriseSunsetData(zone) {
  // Since real sunrise/sunset requires coordinates and complex math,
  // we mock this for a premium visual aesthetic matching the design.
  return {
    sunrise: '07:12',
    sunset: '17:17',
    dayLength: '10h 06m',
  };
}

export function formatTimezoneOffset(offset) {
  if (offset === 0) return 'UTC 0';
  const sign = offset > 0 ? '+' : '';
  // Assuming offset is in hours
  return `UTC${sign}${offset}`;
}

export function formatOffsetMinutes(mins) {
  if (mins === 0) return 'Current';
  const sign = mins > 0 ? '+' : '-';
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  
  if (h === 0) return `${sign}${m}m`;
  if (m === 0) return `${sign}${h}h`;
  return `${sign}${h}h ${m}m`;
}

export function getCityDisplayName(zone) {
  const customNames = {
    'Asia/Kolkata': 'New Delhi',
    'America/Los_Angeles': 'San Francisco'
  };
  if (customNames[zone]) return customNames[zone];
  return zone.split('/')[1]?.replace('_', ' ') || zone;
}
