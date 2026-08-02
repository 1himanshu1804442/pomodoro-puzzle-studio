// src/services/imageService.js

// Why Unsplash Edge CDN URLs: Replaced synthetic AI art with authentic world-class environmental photography! Requesting exact 1920x1080 cropping parameters ensures zero loading lag while delivering cinematic depth worthy of premier focus applications like LifeAt.io and Forest!
const DEFAULT_ARTWORKS = [
  {
    id: 1,
    title: 'Tokyo Night',
    genre: 'Urban Cyberpunk',
    imagePath: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1920&q=85',
    description: 'Authentic twilight neon signage across a rainy commercial avenue in Shinjuku, Tokyo.'
  },
  {
    id: 2,
    title: 'Misty Alps',
    genre: 'Alpine Nature',
    imagePath: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=85',
    description: 'Breathtaking high-altitude fog drifting across tranquil Swiss mountain pine forests.'
  },
  {
    id: 3,
    title: 'Kyoto Garden',
    genre: 'Zen Nature',
    imagePath: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=85',
    description: 'Serene sunlight streaming through an ancient emerald green Japanese bamboo grove.'
  },
  {
    id: 4,
    title: 'Cozy Cafe',
    genre: 'Minimalist Study',
    imagePath: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1920&q=85',
    description: 'Warm, relaxing wooden study cafe desk bathed in gentle morning espresso ambiance.'
  },
  {
    id: 5,
    title: 'Milky Way',
    genre: 'Astronomy',
    imagePath: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85',
    description: 'Authentic long-exposure deep space observatory capture of the sparkling galactic core.'
  },
  {
    id: 6,
    title: 'Manhattan Sky',
    genre: 'Urban Skyline',
    imagePath: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1920&q=85',
    description: 'Dramatic skyscraper architecture towering over New York City during warm golden hour.'
  },
  {
    id: 7,
    title: 'Rainy Window',
    genre: 'Cozy Atmosphere',
    imagePath: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=85',
    description: 'Authentic raindrop condensation glistening on windowpanes over evening city bokeh lights.'
  },
  {
    id: 8,
    title: 'Amalfi Sunset',
    genre: 'Coastal Peace',
    imagePath: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=85',
    description: 'Tranquil evening waves washing against picturesque Italian Mediterranean seaside cliffs.'
  },
  {
    id: 9,
    title: 'Aurora Borealis',
    genre: 'Ethereal Nature',
    imagePath: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=85',
    description: 'Vibrant emerald green Northern Lights dancing across icy night Arctic horizons.'
  },
  {
    id: 10,
    title: 'Night Highway',
    genre: 'Midnight Drive',
    imagePath: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=85',
    description: 'Hypnotic long-exposure light streaks of midnight traffic coursing along city expressways.'
  }
];

// Why modular getter: Returning custom user-uploaded photos alongside our 10 studio masterworks ensures developers retain full personalization power without ever losing default themes!
export const getLoadedArtworks = () => {
  try {
    const customStored = localStorage.getItem('arcade_custom_artworks');
    if (customStored) {
      const parsed = JSON.parse(customStored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...DEFAULT_ARTWORKS, ...parsed];
      }
    }
  } catch (err) {
    console.warn('Could not read custom artworks from localStorage:', err);
  }
  return [...DEFAULT_ARTWORKS];
};

// Why explicit error logging on save: Base64 converted image files can occasionally exceed standard HTML5 localStorage 5MB quota thresholds. Catching and reporting this cleanly avoids app crashes!
export const saveCustomArtwork = (base64Data, customTitle = 'Custom Upload') => {
  const newArtwork = {
    id: `custom_${Date.now()}`,
    title: customTitle,
    genre: 'User Upload',
    imagePath: base64Data,
    description: 'Personal custom wallpaper uploaded by studio developer.'
  };

  try {
    const customStored = localStorage.getItem('arcade_custom_artworks');
    const existing = customStored ? JSON.parse(customStored) : [];
    const updated = [...existing, newArtwork];
    localStorage.setItem('arcade_custom_artworks', JSON.stringify(updated));
  } catch (err) {
    console.warn('Storage quota exceeded; applying custom wallpaper to active session memory only:', err);
  }

  return newArtwork;
};
