export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function getKegiatanYears(items) {
  return [...new Set(
    items
      .map((item) => isValidISODate(item.date) ? Number(item.date.slice(0, 4)) : null)
      .filter(Boolean)
  )].sort((a, b) => b - a);
}

export function filterKegiatanByYear(items, selectedYear) {
  if (selectedYear === 'Semua') return items;
  return items.filter(
    (item) => isValidISODate(item.date) && Number(item.date.slice(0, 4)) === selectedYear
  );
}

export function formatKegiatanDate(value) {
  if (!isValidISODate(value)) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T00:00:00Z`));
}
