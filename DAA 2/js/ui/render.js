import { state } from '../core/state.js';
import { ALGO_META } from '../core/config.js';
import { playTone } from '../core/audio.js';
import { perfCards } from './dom.js';

export function renderBars(container, arr, highlights = {}) {
  const maxVal = Math.max(...arr, 1);
  const containerH = container.clientHeight || 200;

  // Create or reuse bars
  while (container.children.length < arr.length) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    container.appendChild(bar);
  }
  while (container.children.length > arr.length) {
    container.removeChild(container.lastChild);
  }

  for (let i = 0; i < arr.length; i++) {
    const bar = container.children[i];
    const pct = arr[i] / maxVal;
    bar.style.height = Math.max(2, Math.floor(pct * (containerH - 4))) + 'px';

    // Clear classes
    bar.className = 'bar';
    if (highlights.active && highlights.active.includes(i))  bar.classList.add('active');
    else if (highlights.swap && highlights.swap.includes(i)) bar.classList.add('swap');
    else if (highlights.sorted && highlights.sorted.includes(i)) bar.classList.add('sorted');
  }

  // Handle Sonification (throttle to prevent audio clutter on many highlights)
  if (state.sound) {
    if (highlights.swap && highlights.swap.length > 0) playTone(arr[highlights.swap[0]], maxVal);
    else if (highlights.active && highlights.active.length > 0) playTone(arr[highlights.active[0]], maxVal);
  }
}

export function markAllSorted(container, arr) {
  renderBars(container, arr, { sorted: Array.from({ length: arr.length }, (_, i) => i) });
}

export function updateStats(compsEl, swapsEl, timeEl, stackEl, comps, swaps, ms, stack) {
  compsEl.textContent = `Comparisons: ${comps.toLocaleString()}`;
  swapsEl.textContent = `Swaps: ${swaps.toLocaleString()}`;
  timeEl.textContent  = `Time: ${ms} ms`;
  if (stackEl) stackEl.textContent = `Stack Max: ${stack}`;
}

export function buildPerfCards(results) {
  perfCards.innerHTML = '';
  results.forEach(r => {
    const m = ALGO_META[r.algo];
    const card = document.createElement('div');
    card.className = 'perf-card' + (r.highlight ? ' highlight' : '');
    card.innerHTML = `
      <div class="perf-card-name">${m.name}</div>
      <table class="perf-table">
        <tr><td>Best</td>    <td class="val-best">${m.best}</td></tr>
        <tr><td>Average</td> <td class="val-avg">${m.avg}</td></tr>
        <tr><td>Worst</td>   <td class="val-worst">${m.worst}</td></tr>
        <tr><td>Space</td>   <td>${m.space}</td></tr>
        <tr><td>Time</td>    <td class="val-live">${r.time !== null ? r.time + ' ms' : '—'}</td></tr>
        <tr><td>Comparisons</td><td class="val-live">${r.comps !== null ? r.comps.toLocaleString() : '—'}</td></tr>
        <tr><td>Swaps</td>   <td class="val-live">${r.swaps !== null ? r.swaps.toLocaleString() : '—'}</td></tr>
        <tr><td>Max Stack</td><td class="val-live">${r.stack !== null ? r.stack : '—'}</td></tr>
      </table>`;
    perfCards.appendChild(card);
  });
}

export function initPerfCards() {
  const algos = state.mode === 'single'
    ? [{ algo: state.algoA, time: null, comps: null, swaps: null, stack: null, highlight: true }]
    : [
        { algo: state.algoA, time: null, comps: null, swaps: null, stack: null, highlight: true },
        { algo: state.algoB, time: null, comps: null, swaps: null, stack: null, highlight: false },
      ];
  buildPerfCards(algos);
}
