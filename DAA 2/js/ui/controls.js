import { state } from '../core/state.js';
import { sidebar, sortBtn, generateBtn, stopBtn, pauseBtn } from './dom.js';

export function lockControls() {
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

export function unlockControls() {
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
