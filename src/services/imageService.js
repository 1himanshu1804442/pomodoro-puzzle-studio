// imageService.js - Service layer for managing image assets
// Separating image management from the UI allows for easier testing and centralized data access.

export const puzzleArtworks = [
  { id: 'default_1', title: 'Forest Retreat', imagePath: '/assets/forest_retreat.png' },
  { id: 'default_2', title: 'Cyber City', imagePath: '/assets/cyber_city.png' },
];

/**
 * Saves a user-uploaded custom artwork to localStorage.
 * This allows users to personalize their experience by bringing their own wallpapers.
 * We store them as data URLs to keep everything client-side without needing a backend.
 * @param {string} dataUrl - The base64 data URL of the image.
 * @param {string} title - The title for the custom artwork.
 */
export const saveCustomArtwork = (dataUrl, title) => {
  try {
    const existing = localStorage.getItem('pomodoro_custom_artworks');
    const artworks = existing ? JSON.parse(existing) : [];
    
    const newArtwork = {
      id: `custom_${Date.now()}`,
      title: title || 'Custom Artwork',
      imagePath: dataUrl
    };
    
    artworks.push(newArtwork);
    localStorage.setItem('pomodoro_custom_artworks', JSON.stringify(artworks));
  } catch (error) {
    console.error('Failed to save custom artwork to localStorage.', error);
  }
};

/**
 * Retrieves all available artworks by merging defaults with user-uploaded ones.
 * This unified list makes it easy for the UI to display all options in a single gallery.
 * @returns {Array} Array of artwork objects containing id, title, and dataUrl.
 */
export const getLoadedArtworks = () => {
  let customArtworks = [];
  try {
    const existing = localStorage.getItem('pomodoro_custom_artworks');
    if (existing) {
      customArtworks = JSON.parse(existing);
    }
  } catch (error) {
    console.error('Failed to load custom artworks from localStorage.', error);
  }
  
  return [...puzzleArtworks, ...customArtworks];
};
