// src/services/xpService.js

// Rule 3: Strict separation of business logic from components.
// We keep XP and rank calculation pure and highly testable here.

export const XP_PER_TASK = 250;

const RANKS = [
  { maxLevel: 5, title: 'Novice Scrapper' },
  { maxLevel: 10, title: 'Cyber Junkie' },
  { maxLevel: 20, title: 'Neon Hacker' },
  { maxLevel: 30, title: 'Grid Runner' },
  { maxLevel: 50, title: 'Cyberpunk Legend' },
  { maxLevel: Infinity, title: 'Ascendant AI' }
];

export function getLevel(totalXp) {
  return Math.floor(totalXp / 1000) + 1;
}

export function getRankTitle(level) {
  const rank = RANKS.find(r => level <= r.maxLevel);
  return rank ? rank.title : 'Ascendant AI';
}

export function getXPProgressPercent(totalXp) {
  const currentLevelXP = totalXp % 1000;
  return (currentLevelXP / 1000) * 100;
}
