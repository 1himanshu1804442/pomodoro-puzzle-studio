// src/services/imageService.js - Service layer for managing image assets
// Why extract asset data: Separating image catalogs and local storage access from UI components promotes strict modularity and simplified unit test mocking per Rule 2 & 3.

export const puzzleArtworks = [
  { id: 'art_cyberpunk', title: 'Cyberpunk City', imagePath: '/assets/cyberpunk_city.jpg', description: 'Neo-Tokyo cityscape under luminous glowing neon rain.' },
  { id: 'art_supercar', title: 'Neon Supercar', imagePath: '/assets/neon_supercar.jpg', description: 'Futuristic supercar racing down dark rainy night highways.' },
  { id: 'art_anime', title: 'Anime Landscape', imagePath: '/assets/anime_landscape.jpg', description: 'Vibrant cherry blossom dreamscape under starry galaxy skies.' },
];

/**
 * Saves a user-uploaded custom artwork to localStorage with quota error fallback.
 * Why this fallback: HTML5 localStorage has a strict 5MB storage ceiling. Catching QuotaExceeded errors ensures the application never crashes when high-resolution photographs are selected!
 * @param {string} dataUrl - The base64 data URL of the image.
 * @param {string} title - The title for the custom artwork.
 * @returns {object} The created artwork object so UI state can always display it!
 */
export const saveCustomArtwork = (dataUrl, title) => {
  const newArtwork = {
    id: `custom_${Date.now()}`,
    title: title || 'Custom Photo',
    imagePath: dataUrl
  };

  try {
    const existing = localStorage.getItem('pomodoro_custom_artworks');
    const artworks = existing ? JSON.parse(existing) : [];
    artworks.push(newArtwork);
    localStorage.setItem('pomodoro_custom_artworks', JSON.stringify(artworks));
  } catch (error) {
    // If QuotaExceededError triggers due to large 4K image file sizes, log gracefully without crashing React render loop!
    console.warn('Custom wallpaper exceeded browser offline storage limits, retaining in active studio session memory:', error);
  }

  return newArtwork;
};

/**
 * Retrieves all available artworks by merging defaults with user-uploaded ones.
 * Why this design: This unified gallery array enables smooth 1-click rotation across built-in and user-provided wallpapers.
 * @returns {Array} Array of artwork objects containing id, title, and imagePath.
 */
export const getLoadedArtworks = () => {
  let customArtworks = [];
  try {
    const existing = localStorage.getItem('pomodoro_custom_artworks');
    if (existing) {
      customArtworks = JSON.parse(existing);
    }
  } catch (error) {
    console.error('Failed to parse custom artworks from localStorage.', error);
  }
  
  return [...puzzleArtworks, ...customArtworks];
};
