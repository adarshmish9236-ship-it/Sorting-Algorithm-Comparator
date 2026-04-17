/* ═══════════════════════════════════════════════════════════
   SortLab — script.js
   Sorting Algorithm Visualizer with Compare Mode
═══════════════════════════════════════════════════════════ */

/* ── Algorithm Metadata ─────────────────────────────────── */
const ALGO_META = {
  bubble:    { name: 'Bubble Sort',    best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  selection: { name: 'Selection Sort', best: 'O(n²)',     avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  insertion: { name: 'Insertion Sort', best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  quick:     { name: 'Quick Sort',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n²)',      space: 'O(log n)'},
  merge:     { name: 'Merge Sort',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)'    },
  heap:      { name: 'Heap Sort',      best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)'    },
  shell:     { name: 'Shell Sort',     best: 'O(n log n)',avg: 'O(n(log n)²)',worst: 'O(n²)',     space: 'O(1)'    },
};

/* ── State ──────────────────────────────────────────────── */
let state = {
  mode: 'single',        // 'single' | 'compare'
  algoA: 'bubble',
  algoB: 'insertion',
  pattern: 'random',
  size: 60,
  speed: 5,
  running: false,
  stopFlag: false,
  paused: false,
  sound: false,
  arrayA: [],
  arrayB: [],
};

/* ── DOM Refs ───────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const sidebar       = document.querySelector('.sidebar');
const singleViz     = $('singleViz');
const compareViz    = $('compareViz');
const barsA         = $('barsA');
const barsB         = $('barsB');
const barsC         = $('barsC');
const sizeSlider    = $('sizeSlider');
const speedSlider   = $('speedSlider');
const sizeVal       = $('sizeVal');
const speedVal      = $('speedVal');
const generateBtn   = $('generateBtn');
const sortBtn       = $('sortBtn');
const stopBtn       = $('stopBtn');
const pauseBtn      = $('pauseBtn');
const vizLabel      = $('vizLabel');
const liveComps     = $('liveComps');
const liveSwaps     = $('liveSwaps');
const liveTime      = $('liveTime');
const vizLabelA     = $('vizLabelA');
const liveCompsA    = $('liveCompsA');
const liveSwapsA    = $('liveSwapsA');
const liveTimeA     = $('liveTimeA');
const vizLabelB     = $('vizLabelB');
const liveCompsB    = $('liveCompsB');
const liveSwapsB    = $('liveSwapsB');
const liveTimeB     = $('liveTimeB');
const perfCards     = $('perfCards');
const compareAlgoSection = $('compareAlgoSection');
const customDataSection  = $('customDataSection');
const customInput        = $('customInput');

/* ── Helpers ────────────────────────────────────────────── */
const delay = ms => new Promise(res => setTimeout(res, ms));

function getDelay() {
  // speed 1 → ~120ms, speed 10 → ~2ms (Increased speed by 30% by reducing delay)
  return Math.max(2, (130 - state.speed * 13) * 0.7);
}

async function simWait() {
  await delay(getDelay());
  while (state.paused) {
    if (state.stopFlag) return;
    await delay(50);
  }
}

let audioCtx = null;
function playTone(val, maxVal) {
  if (!state.sound) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const freq = 200 + (val / maxVal) * 800; // 200Hz to 1000Hz based on height
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function randomArray(n) {
  return Array.from({ length: n }, () => Math.ceil(Math.random() * 98) + 2);
}

function nearlySortedArray(n) {
  const arr = Array.from({ length: n }, (_, i) => Math.ceil((i + 1) * 100 / n));
  const swaps = Math.max(1, Math.floor(n * 0.05));
  for (let i = 0; i < swaps; i++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr;
}

function reversedArray(n) {
  return Array.from({ length: n }, (_, i) => Math.ceil((n - i) * 100 / n));
}

function fewUniqueArray(n) {
  const vals = [10, 25, 50, 75, 90];
  return Array.from({ length: n }, () => vals[Math.floor(Math.random() * vals.length)]);
}

function generateArray(n, pattern) {
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
    default:         return randomArray(n);
  }
}

/* ── Bar Rendering ──────────────────────────────────────── */
function renderBars(container, arr, highlights = {}) {
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

function markAllSorted(container, arr) {
  renderBars(container, arr, { sorted: Array.from({ length: arr.length }, (_, i) => i) });
}

/* ── Live Stats Update ──────────────────────────────────── */
function updateStats(compsEl, swapsEl, timeEl, comps, swaps, ms) {
  compsEl.textContent = `Comparisons: ${comps.toLocaleString()}`;
  swapsEl.textContent = `Swaps: ${swaps.toLocaleString()}`;
  timeEl.textContent  = `Time: ${ms} ms`;
}

/* ── Performance Cards ──────────────────────────────────── */
function buildPerfCards(results) {
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
      </table>`;
    perfCards.appendChild(card);
  });
}

function initPerfCards() {
  const algos = state.mode === 'single'
    ? [{ algo: state.algoA, time: null, comps: null, swaps: null, highlight: true }]
    : [
        { algo: state.algoA, time: null, comps: null, swaps: null, highlight: true },
        { algo: state.algoB, time: null, comps: null, swaps: null, highlight: false },
      ];
  buildPerfCards(algos);
}

/* ── Lock / Unlock Controls ─────────────────────────────── */
function lockControls() {
  state.running = true;
  sidebar.classList.add('locked');
  sortBtn.disabled   = true;
  generateBtn.disabled = true;
  stopBtn.disabled   = false;
  pauseBtn.disabled  = false;
  if (!state.paused) {
    pauseBtn.textContent = '⏸ Pause';
    pauseBtn.classList.remove('paused');
  }
}

function unlockControls() {
  state.running = false;
  state.stopFlag = false;
  state.paused = false;
  sidebar.classList.remove('locked');
  sortBtn.disabled   = false;
  generateBtn.disabled = false;
  stopBtn.disabled   = true;
  pauseBtn.disabled  = true;
  pauseBtn.textContent = '⏸ Pause';
  pauseBtn.classList.remove('paused');
}

/* ══════════════════════════════════════════════════════════
   SORTING ALGORITHMS
══════════════════════════════════════════════════════════ */

/* Each algorithm receives:
   arr        — working array (mutated in place)
   container  — DOM container for bars
   statsObj   — { comps, swaps, startTime }
   liveEl     — { comps, swaps, time } DOM elements
   Returns    — true if completed, false if stopped
*/

async function bubbleSort(arr, container, s, el) {
  const n = arr.length;
  const sorted = new Set();
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (state.stopFlag) return false;
      s.comps++;
      renderBars(container, arr, { active: [j, j + 1], sorted: [...sorted] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        s.swaps++;
        renderBars(container, arr, { swap: [j, j + 1], sorted: [...sorted] });
        await simWait();
      } else {
        await simWait();
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  return true;
}

async function selectionSort(arr, container, s, el) {
  const n = arr.length;
  const sorted = new Set();
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (state.stopFlag) return false;
      s.comps++;
      renderBars(container, arr, { active: [j, minIdx], sorted: [...sorted] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      s.swaps++;
      renderBars(container, arr, { swap: [i, minIdx], sorted: [...sorted] });
      await simWait();
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  return true;
}

async function insertionSort(arr, container, s, el) {
  const n = arr.length;
  const sorted = new Set([0]);
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      if (state.stopFlag) return false;
      s.comps++;
      arr[j + 1] = arr[j];
      s.swaps++;
      renderBars(container, arr, { active: [j, j + 1], sorted: [...sorted] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      j--;
    }
    s.comps++;
    arr[j + 1] = key;
    sorted.add(i);
    renderBars(container, arr, { swap: [j + 1], sorted: [...sorted] });
    await simWait();
  }
  return true;
}

async function quickSort(arr, container, s, el) {
  async function partition(low, high, sortedSet) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (state.stopFlag) return -1;
      s.comps++;
      renderBars(container, arr, { active: [j, high], sorted: [...sortedSet] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        s.swaps++;
        renderBars(container, arr, { swap: [i, j], sorted: [...sortedSet] });
        await simWait();
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    s.swaps++;
    return i + 1;
  }

  const stack = [[0, arr.length - 1]];
  const sortedSet = new Set();

  while (stack.length) {
    if (state.stopFlag) return false;
    const [low, high] = stack.pop();
    if (low >= high) {
      if (low >= 0) sortedSet.add(low);
      continue;
    }
    const pi = await partition(low, high, sortedSet);
    if (pi === -1) return false;
    sortedSet.add(pi);
    stack.push([low, pi - 1]);
    stack.push([pi + 1, high]);
  }
  return true;
}

async function mergeSort(arr, container, s, el) {
  async function merge(left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      if (state.stopFlag) return false;
      s.comps++;
      renderBars(container, arr, { active: [k, mid + 1 + j] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      if (L[i] <= R[j]) { arr[k++] = L[i++]; }
      else               { arr[k++] = R[j++]; s.swaps++; }
      renderBars(container, arr, { swap: [k - 1] });
    }
    while (i < L.length) { arr[k++] = L[i++]; }
    while (j < R.length) { arr[k++] = R[j++]; }
    return true;
  }

  async function sort(left, right) {
    if (left >= right) return true;
    if (state.stopFlag) return false;
    const mid = Math.floor((left + right) / 2);
    if (!await sort(left, mid)) return false;
    if (!await sort(mid + 1, right)) return false;
    if (!await merge(left, mid, right)) return false;
    return true;
  }

  return await sort(0, arr.length - 1);
}

async function heapSort(arr, container, s, el) {
  const n = arr.length;
  const sorted = new Set();
  
  async function heapify(n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      if (state.stopFlag) return false;
      s.comps++;
      renderBars(container, arr, { active: [largest, l], sorted: [...sorted] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      if (arr[l] > arr[largest]) largest = l;
    }
    
    if (r < n) {
      if (state.stopFlag) return false;
      s.comps++;
      renderBars(container, arr, { active: [largest, r], sorted: [...sorted] });
      updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
      await simWait();
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      s.swaps++;
      renderBars(container, arr, { swap: [i, largest], sorted: [...sorted] });
      await simWait();
      if (await heapify(n, largest) === false) return false;
    }
    return true;
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (await heapify(n, i) === false) return false;
  }

  for (let i = n - 1; i > 0; i--) {
    if (state.stopFlag) return false;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    s.swaps++;
    sorted.add(i);
    renderBars(container, arr, { swap: [0, i], sorted: [...sorted] });
    await simWait();
    if (await heapify(i, 0) === false) return false;
  }
  sorted.add(0);
  return true;
}

async function shellSort(arr, container, s, el) {
  const n = arr.length;
  const sorted = new Set();
  
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i++) {
      if (state.stopFlag) return false;
      let temp = arr[i];
      let j;
      for (j = i; j >= gap; j -= gap) {
        if (state.stopFlag) return false;
        s.comps++;
        renderBars(container, arr, { active: [j, j - gap] });
        updateStats(el.comps, el.swaps, el.time, s.comps, s.swaps, Date.now() - s.start);
        await simWait();
        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          s.swaps++;
          renderBars(container, arr, { swap: [j, j - gap] });
          await simWait();
        } else {
          break;
        }
      }
      arr[j] = temp;
    }
  }
  return true;
}

const ALGOS = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, quick: quickSort, merge: mergeSort, heap: heapSort, shell: shellSort };

/* ── Run Single Sort ────────────────────────────────────── */
async function runSort(algoKey, arr, container, compsEl, swapsEl, timeEl) {
  const s = { comps: 0, swaps: 0, start: Date.now() };
  const el = { comps: compsEl, swaps: swapsEl, time: timeEl };

  const completed = await ALGOS[algoKey](arr, container, s, el);
  const elapsed = Date.now() - s.start;
  updateStats(compsEl, swapsEl, timeEl, s.comps, s.swaps, elapsed);

  if (completed) {
    markAllSorted(container, arr);
    // flash done
    const wrapper = container.closest('.viz-wrapper, .compare-pane');
    if (wrapper) {
      wrapper.classList.add('done');
      setTimeout(() => wrapper.classList.remove('done'), 1200);
    }
  }

  return { comps: s.comps, swaps: s.swaps, time: elapsed, completed };
}

/* ── Sort Orchestration ─────────────────────────────────── */
async function startSort() {
  if (state.running) return;
  lockControls();

  if (state.mode === 'single') {
    const arr = [...state.arrayA];
    const result = await runSort(state.algoA, arr, barsA, liveComps, liveSwaps, liveTime);
    buildPerfCards([{
      algo: state.algoA,
      time: result.time,
      comps: result.comps,
      swaps: result.swaps,
      highlight: true,
    }]);
  } else {
    // Compare mode: run both concurrently
    const arrA = [...state.arrayA];
    const arrB = [...state.arrayB];
    const [resultA, resultB] = await Promise.all([
      runSort(state.algoA, arrA, barsB, liveCompsA, liveSwapsA, liveTimeA),
      runSort(state.algoB, arrB, barsC, liveCompsB, liveSwapsB, liveTimeB),
    ]);
    buildPerfCards([
      { algo: state.algoA, time: resultA.time, comps: resultA.comps, swaps: resultA.swaps, highlight: true  },
      { algo: state.algoB, time: resultB.time, comps: resultB.comps, swaps: resultB.swaps, highlight: false },
    ]);
  }

  unlockControls();
}

/* ── Generate Arrays ────────────────────────────────────── */
function doGenerate() {
  state.arrayA = generateArray(state.size, state.pattern);
  state.arrayB = [...state.arrayA]; // same data for fair compare

  // Reset stats
  updateStats(liveComps, liveSwaps, liveTime, 0, 0, 0);
  updateStats(liveCompsA, liveSwapsA, liveTimeA, 0, 0, 0);
  updateStats(liveCompsB, liveSwapsB, liveTimeB, 0, 0, 0);

  if (state.mode === 'single') {
    renderBars(barsA, state.arrayA);
  } else {
    renderBars(barsB, state.arrayA);
    renderBars(barsC, state.arrayB);
  }

  initPerfCards();
}

/* ── Mode Switch ────────────────────────────────────────── */
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

  if (mode === 'single') {
    singleViz.style.display = '';
    compareViz.style.display = 'none';
    compareAlgoSection.style.display = 'none';
    vizLabel.textContent = ALGO_META[state.algoA].name;
  } else {
    singleViz.style.display = 'none';
    compareViz.style.display = '';
    compareAlgoSection.style.display = '';
    vizLabelA.textContent = ALGO_META[state.algoA].name;
    vizLabelB.textContent = ALGO_META[state.algoB].name;
  }
  doGenerate();
}

/* ── Event Wiring ───────────────────────────────────────── */

// Mode buttons
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

// Algo buttons (single)
document.querySelectorAll('#algoGrid .algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.mode === 'compare' && btn.dataset.algo === state.algoB) {
      alert("Cannot compare the same algorithm! Please select a different one.");
      return;
    }
    document.querySelectorAll('#algoGrid .algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.algoA = btn.dataset.algo;
    vizLabel.textContent = ALGO_META[state.algoA].name;
    vizLabelA.textContent = ALGO_META[state.algoA].name;
    initPerfCards();
  });
});

// Algo buttons (compare B)
document.querySelectorAll('#algoGridB .algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.algo === state.algoA) {
      alert("Cannot compare the same algorithm! Please select a different one.");
      return;
    }
    document.querySelectorAll('#algoGridB .algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.algoB = btn.dataset.algo;
    vizLabelB.textContent = ALGO_META[state.algoB].name;
    initPerfCards();
  });
});

// Pattern buttons
document.querySelectorAll('.pattern-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.pattern = btn.dataset.pattern;
    
    // Toggle Custom Array Input Section
    if (state.pattern === 'custom') customDataSection.style.display = 'block';
    else customDataSection.style.display = 'none';

    doGenerate();
  });
});

customInput.addEventListener('change', () => {
  if (state.pattern === 'custom') doGenerate();
});

// Sound Toggle
document.querySelectorAll('#soundToggle .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#soundToggle .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.sound = (btn.dataset.sound === 'on');
    $('soundVal').textContent = state.sound ? 'On' : 'Off';
  });
});

// Sliders
sizeSlider.addEventListener('input', () => {
  if (state.pattern === 'custom') return; // Ignore slider if custom
  state.size = +sizeSlider.value;
  sizeVal.textContent = state.size;
  doGenerate();
});
speedSlider.addEventListener('input', () => {
  state.speed = +speedSlider.value;
  speedVal.textContent = state.speed;
});

// Buttons
generateBtn.addEventListener('click', doGenerate);
sortBtn.addEventListener('click', startSort);
stopBtn.addEventListener('click', () => { 
  state.stopFlag = true; 
  if (state.paused) {
    state.paused = false; // break out of simWait if paused
  }
});
pauseBtn.addEventListener('click', () => {
  state.paused = !state.paused;
  if (state.paused) {
    pauseBtn.textContent = '▶ Resume';
    pauseBtn.classList.add('paused');
  } else {
    pauseBtn.textContent = '⏸ Pause';
    pauseBtn.classList.remove('paused');
  }
});

// Re-render bars on window resize
window.addEventListener('resize', () => {
  if (state.mode === 'single') renderBars(barsA, state.arrayA);
  else {
    renderBars(barsB, state.arrayA);
    renderBars(barsC, state.arrayB);
  }
});

/* ── Init ────────────────────────────────────────────────── */
(function init() {
  sizeVal.textContent  = state.size;
  speedVal.textContent = state.speed;
  setMode('single');
  stopBtn.disabled = true;
})();
