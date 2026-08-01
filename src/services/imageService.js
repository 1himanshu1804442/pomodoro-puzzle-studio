// src/services/imageService.js

/**
 * Image Service
 * 
 * WHY EXTRACT ASSET METADATA INTO A DEDICATED SERVICE FILE?
 * 1. Simplifies React testing: UI components can easily mock this service to test layout and logic
 *    without relying on external or static files, preventing flaky tests.
 * 2. Improves debugging: If an image fails to load, it's easier to verify the metadata in one place
 *    rather than hunting down hardcoded strings across multiple UI components.
 * 3. Separation of Concerns: Keeps data access (metadata structure, file paths) separate from 
 *    UI components, following best practices for scalable architecture.
 */

export const puzzleArtworks = [
    {
        id: "art_001",
        title: "Cyberpunk City",
        genre: "Sci-Fi",
        imagePath: "/assets/cyberpunk_city.jpg",
        description: "A dynamic, neo-Tokyo cyberpunk cityscape at night with glowing pink and cyan neon signs."
    },
    {
        id: "art_002",
        title: "Neon Supercar",
        genre: "Sci-Fi Racing",
        imagePath: "/assets/neon_supercar.jpg",
        description: "A sleek futuristic supercar racing down an open highway under dark rainy city night lights."
    },
    {
        id: "art_003",
        title: "Anime Landscape",
        genre: "Fantasy",
        imagePath: "/assets/anime_landscape.jpg",
        description: "A breathtaking vibrant anime fantasy landscape featuring mystical glowing trees and cherry blossoms under a starry galaxy sky."
    }
];
