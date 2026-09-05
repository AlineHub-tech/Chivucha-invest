import test from 'node:test';
import assert from 'node:assert/strict';
import { getStockStatus, formatCurrency } from './inventory.js';

test('classifies low and critical stock correctly', () => {
  assert.equal(getStockStatus(5, 10), 'Critical');
  assert.equal(getStockStatus(8, 10), 'Low stock');
  assert.equal(getStockStatus(20, 10), 'Healthy');
});

test('formats currency in RWF format', () => {
  assert.equal(formatCurrency(1200000), 'RWF 1,200,000');
});
