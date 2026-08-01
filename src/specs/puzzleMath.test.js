import { describe, it, expect } from 'vitest';

// We'll simulate the logic for grid sizing and puzzle tile unlocks
function calculateGridSize(taskCount) {
  if (taskCount <= 4) return { rows: 2, cols: 2, totalTiles: 4 };
  if (taskCount <= 9) return { rows: 3, cols: 3, totalTiles: 9 };
  return { rows: 4, cols: 4, totalTiles: 16 };
}

function updatePuzzleTiles(tiles, completedTaskIndex) {
  return tiles.map((tile, index) => {
    if (index === completedTaskIndex) {
      return { ...tile, isRevealed: true };
    }
    return tile;
  });
}

describe('Dynamic grid sizing logic', () => {
  // Why this matters: As a user adds more tasks for their Pomodoro sessions, 
  // the visual puzzle needs to scale properly so that they have enough tiles 
  // to reveal without running out or having too many small tiles for a short list.
  it('should return a 2x2 grid (4 tiles) for 1-4 tasks', () => {
    expect(calculateGridSize(1)).toEqual({ rows: 2, cols: 2, totalTiles: 4 });
    expect(calculateGridSize(4)).toEqual({ rows: 2, cols: 2, totalTiles: 4 });
  });

  it('should return a 3x3 grid (9 tiles) for 5-9 tasks', () => {
    expect(calculateGridSize(5)).toEqual({ rows: 3, cols: 3, totalTiles: 9 });
    expect(calculateGridSize(9)).toEqual({ rows: 3, cols: 3, totalTiles: 9 });
  });

  it('should return a 4x4 grid (16 tiles) for 10-16 tasks', () => {
    expect(calculateGridSize(10)).toEqual({ rows: 4, cols: 4, totalTiles: 16 });
    expect(calculateGridSize(16)).toEqual({ rows: 4, cols: 4, totalTiles: 16 });
  });
});

describe('Puzzle tile unlock progression', () => {
  // Why this matters: Unlocking tiles is the core gamification loop. 
  // We must ensure that when a task is completed, precisely the correct 
  // tile flips to `isRevealed: true` to provide that immediate dopamine hit.
  it('transitions corresponding puzzle tile index from locked to unlocked', () => {
    const initialTiles = [
      { id: 1, isRevealed: false },
      { id: 2, isRevealed: false },
      { id: 3, isRevealed: false },
      { id: 4, isRevealed: false }
    ];

    const updatedTiles = updatePuzzleTiles(initialTiles, 1);
    
    expect(updatedTiles[0].isRevealed).toBe(false);
    expect(updatedTiles[1].isRevealed).toBe(true);
    expect(updatedTiles[2].isRevealed).toBe(false);
    expect(updatedTiles[3].isRevealed).toBe(false);
  });
});
