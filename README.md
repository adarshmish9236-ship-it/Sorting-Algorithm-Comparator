<div align="center">

# ⬡ SortLab

### **Sorting Algorithm Visualizer & Comparator**

> *Watch algorithms think. Hear them sort. Race them head-to-head.*

[![Made with](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-00c896?style=for-the-badge)]()
[![Open in Browser](https://img.shields.io/badge/Open%20in-Browser-4285f4?style=for-the-badge&logo=googlechrome&logoColor=white)]()

</div>

---

## ✨ What is SortLab?

**SortLab** is a sleek, browser-based sorting algorithm visualizer. No installs, no frameworks, no fuss — just open `index.html` and watch algorithms race to sort your data in real time, complete with live stats, sound, and side-by-side comparisons.

---

## 🚀 Features

| | Feature | Description |
|---|---|---|
| 🧠 | **9 Algorithms** | Bubble, Selection, Insertion, Quick, Merge, Heap, Shell, Counting, Radix |
| ⚔️ | **Compare Mode** | Race two algorithms side-by-side on the same dataset |
| 📊 | **Live Stats** | Comparisons, swaps, time elapsed, and max stack depth — updated in real time |
| 🎨 | **6 Data Patterns** | Random, Nearly Sorted, Reversed, Few Unique, Gaussian, Sawtooth |
| ✏️ | **Custom Input** | Paste your own comma-separated array (up to 200 items) |
| 🎚️ | **Speed & Size Sliders** | Array size 10–200 · Animation speed 1–10 |
| 🔊 | **Audio Mode** | Tones pitch-shift based on bar height via Web Audio API |
| 📈 | **Performance Table** | Post-sort Big-O breakdown cards for every algorithm |
| 💾 | **Export CSV** | Download your performance results |

---

## 🗂️ Project Structure

```
📦 Sorting-Algorithm-Comparator/
└── 📁 DAA 2/
    ├── 📄 index.html          ← App shell & sidebar UI
    ├── 📄 script.js           ← Core logic (algorithms + animation)
    ├── 🎨 style.css           ← All styles (Space Mono + DM Sans)
    └── 📁 js/
        ├── 📁 core/
        │   ├── audio.js       ← Web Audio API tone engine
        │   ├── config.js      ← Algorithm metadata & Big-O tables
        │   ├── generators.js  ← Array pattern generators
        │   ├── state.js       ← Global app state
        │   └── utils.js       ← Shared utility helpers
        └── 📁 ui/
            ├── controls.js    ← Sidebar event handlers
            ├── dom.js         ← DOM element references
            └── render.js      ← Bar rendering & color states
```

---

## ⚡ Getting Started

> No installs. No build step. Just open and go.

```bash
# 1. Clone the repo
git clone https://github.com/your-username/Sorting-Algorithm-Comparator.git

# 2. Open in browser
open "DAA 2/index.html"
```

Or just **double-click** `index.html`. That's it. ✅

---

## 🧮 Algorithm Complexity Reference

| Algorithm | 🟢 Best | 🟡 Average | 🔴 Worst | 💾 Space |
|---|---|---|---|---|
| Bubble Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Selection Sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` |
| Insertion Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Quick Sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` |
| Merge Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Heap Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` |
| Shell Sort | `O(n log n)` | `O(n(log n)²)` | `O(n²)` | `O(1)` |
| Counting Sort | `O(n+k)` | `O(n+k)` | `O(n+k)` | `O(k)` |
| Radix Sort | `O(nk)` | `O(nk)` | `O(nk)` | `O(n+k)` |

---

## 🎮 How to Use

```
1. 🔘 Pick a mode        →  Single  or  Compare
2. 🧠 Select algorithm   →  (pick two in Compare mode)
3. 🎲 Choose a pattern   →  Random, Reversed, Gaussian...
4. 📏 Set array size     →  drag the slider (10 – 200)
5. ▶️  Hit Generate      →  then Sort ▶
6. ⏸️  Pause / Stop      →  control playback anytime
7. 📊 Check the stats    →  Performance Analysis section below
8. 💾 Export results     →  click Export CSV
```

---

## 🎨 Color Legend

| Color | Meaning |
|---|---|
| 🔵 Default | Unsorted element |
| 🟡 Active | Currently being compared |
| 🔴 Swap | Elements being swapped |
| 🟢 Sorted | Final sorted position |

---

## 🛠️ Tech Stack

```
🌐 HTML5          →  App structure & layout
🎨 CSS3           →  Custom properties, Flexbox, Grid
⚙️  Vanilla JS    →  ES6+, async/await, generator-style animations
🔊 Web Audio API  →  Real-time pitch-mapped tones
🔤 Google Fonts   →  Space Mono + DM Sans
```

---

<div align="center">

Made with ❤️ for **Design & Analysis of Algorithms**

⭐ Star this repo if SortLab helped you understand sorting!

</div>
