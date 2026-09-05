export function getStockStatus(quantity, minStock) {
  if (quantity <= 0) return 'Critical';
  if (quantity <= Math.max(1, Math.floor(minStock / 2))) return 'Critical';
  if (quantity <= minStock) return 'Low stock';
  return 'Healthy';
}

export function formatCurrency(value) {
  return `RWF ${Number(value).toLocaleString('en-US')}`;
}
