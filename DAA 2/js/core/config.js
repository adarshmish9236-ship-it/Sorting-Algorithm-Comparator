export const ALGO_META = {
  bubble:    { name: 'Bubble Sort',    best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  selection: { name: 'Selection Sort', best: 'O(n²)',     avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  insertion: { name: 'Insertion Sort', best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
  quick:     { name: 'Quick Sort',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n²)',      space: 'O(log n)'},
  merge:     { name: 'Merge Sort',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)'    },
  heap:      { name: 'Heap Sort',      best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)'    },
  shell:     { name: 'Shell Sort',     best: 'O(n log n)',avg: 'O(n(log n)²)',worst: 'O(n²)',     space: 'O(1)'    },
  counting:  { name: 'Counting Sort',  best: 'O(n+k)',    avg: 'O(n+k)',     worst: 'O(n+k)',     space: 'O(k)'    },
  radix:     { name: 'Radix Sort',     best: 'O(nk)',     avg: 'O(nk)',      worst: 'O(nk)',      space: 'O(n+k)'  },
};
