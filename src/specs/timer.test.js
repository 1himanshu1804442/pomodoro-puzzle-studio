import { describe, it, expect, vi } from 'vitest';

// Simulate Pomodoro duration logic
function getDuration(type) {
  if (type === 'pomodoro') return 25 * 60;
  if (type === 'shortBreak') return 5 * 60;
  if (type === 'longBreak') return 15 * 60;
  return 0;
}

function runTimer(duration, onComplete) {
  // In a real app this uses setInterval/setTimeout
  // We just simulate completion immediately for the test logic
  onComplete();
}

describe('Pomodoro Timer Logic', () => {
  // Why this matters: The Pomodoro technique relies strictly on 
  // specific time blocks. If these calculations are off, the user's 
  // productivity cycle is broken. We test to ensure the core durations are precise.
  it('calculates the correct duration for different session types', () => {
    expect(getDuration('pomodoro')).toBe(1500); // 25 minutes * 60 seconds
    expect(getDuration('shortBreak')).toBe(300); // 5 minutes * 60 seconds
    expect(getDuration('longBreak')).toBe(900); // 15 minutes * 60 seconds
  });

  // Why this matters: When a timer finishes, we MUST trigger the completion 
  // callback so the app can play an alarm, transition to a break, or unlock a puzzle tile.
  it('triggers completion callback when timer finishes', () => {
    const onComplete = vi.fn();
    runTimer(getDuration('pomodoro'), onComplete);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
