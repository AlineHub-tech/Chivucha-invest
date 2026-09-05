export function formatCurrency(value) {
  return `RWF ${Number(value).toLocaleString('en-RW')}`;
}

export function formatDateTime(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
