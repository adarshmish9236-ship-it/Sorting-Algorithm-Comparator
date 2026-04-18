import { customInput } from '../ui/dom.js';

export function randomArray(n) {
  return Array.from({ length: n }, () => Math.ceil(Math.random() * 98) + 2);
}

export function nearlySortedArray(n) {
  const arr = Array.from({ length: n }, (_, i) => Math.ceil((i + 1) * 100 / n));
  const swaps = Math.max(1, Math.floor(n * 0.05));
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr;
}

export function reversedArray(n) {
  return Array.from({ length: n }, (_, i) => Math.ceil((n - i) * 100 / n));
}

export function fewUniqueArray(n) {
  const vals = [10, 25, 50, 75, 90];
  return Array.from({ length: n }, () => vals[Math.floor(Math.random() * vals.length)]);
}

export function gaussianArray(n) {
  return Array.from({ length: n }, () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let val = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    val = val / 10.0 + 0.5; // Translate to 0 -> 1
    if (val < 0) val = 0;
    if (val > 1) val = 1;
    return Math.max(2, Math.floor(val * 100));
  });
}

export function sawtoothArray(n) {
  const result = [];
  const teeth = 4;
  for (let i = 0; i < n; i++) {
    const pct = (i % (n / teeth)) / (n / teeth);
    result.push(Math.max(2, Math.floor(pct * 100)));
  }
  return result;
}

export function generateArray(n, pattern) {
  if (pattern === 'custom') {
    let vals = customInput.value.split(',').map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
    if (vals.length === 0) vals = [10, 20, 30, 40, 50]; // fallback
    if (vals.length > 200) vals = vals.slice(0, 200);
    return vals;
  }
  switch (pattern) {
    case 'nearly':   return nearlySortedArray(n);
    case 'reversed': return reversedArray(n);
    case 'few':      return fewUniqueArray(n);
    case 'gaussian': return gaussianArray(n);
    case 'sawtooth': return sawtoothArray(n);
    default:         return randomArray(n);
  }
}
