// xpService.js - Service layer for handling Experience Points (XP)
// Separating this logic ensures our UI components remain clean and only focused on rendering.

export const XP_PER_TASK = 50;

/**
 * Loads the saved XP from localStorage.
 * We use localStorage to persist the user's progress across sessions.
 * A try-catch block is used to gracefully handle cases where localStorage is disabled or inaccessible (e.g. strict privacy modes).
 * @returns {number} The saved XP amount, or 0 if not found/error.
 */
export const loadSavedXP = () => {
  try {
    const saved = localStorage.getItem('pomodoro_xp');
    return saved ? parseInt(saved, 10) : 0;
  } catch (error) {
    console.error('Failed to load XP from localStorage. Defaulting to 0.', error);
    return 0;
  }
};

/**
 * Saves the current XP to localStorage.
 * This ensures the user doesn't lose their hard-earned progress when they close the browser.
 * @param {number} xp - The total XP to save.
 */
export const saveXP = (xp) => {
  try {
    localStorage.setItem('pomodoro_xp', xp.toString());
  } catch (error) {
    console.error('Failed to save XP to localStorage.', error);
  }
};

export const getLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

export const getRankTitle = (level) => {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 20) return 'Adept';
  return 'Master';
};

export const getXPProgressPercent = (xp) => {
  return xp % 100;
};
