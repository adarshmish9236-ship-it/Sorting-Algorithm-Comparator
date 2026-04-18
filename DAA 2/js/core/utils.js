import { state } from './state.js';

export const delay = ms => new Promise(res => setTimeout(res, ms));

export function getDelay() {
  return Math.max(2, (130 - state.speed * 13) * 0.7);
}

export async function simWait() {
  await delay(getDelay());
  while (state.paused) {
    if (state.stopFlag) return;
    await delay(50);
  }
}
