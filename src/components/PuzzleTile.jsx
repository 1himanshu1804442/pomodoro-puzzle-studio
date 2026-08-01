// src/components/PuzzleTile.jsx
import React from 'react';

// Why this styling: Removing darkening filters and adding vivid cyan laser illumination ensures that whenever a background piece is uncovered, it stands out cleanly and unmistakably against the surrounding frosted matrix fog!
export default function PuzzleTile({ imageUrl, isUnlocked, gridParams, index }) {
  const { rows, cols } = gridParams;
  
  // Calculate spatial row and column coordinates for the matrix slice
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  const bgPosX = (col / (cols - 1 || 1)) * 100;
  const bgPosY = (row / (rows - 1 || 1)) * 100;

  return (
    <div 
      className={isUnlocked ? 'tile-reveal' : ''}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {isUnlocked ? (
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            filter: 'brightness(1.05) contrast(1.1) saturate(1.15)',
            boxShadow: 'inset 0 0 25px rgba(0, 240, 255, 0.7), 0 0 15px rgba(0, 240, 255, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            zIndex: 2
          }}
        />
      ) : (
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(10, 12, 22, 0.94)',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'rgba(255, 255, 255, 0.3)',
            border: '1px dashed rgba(255, 255, 255, 0.08)'
          }}
        >
          <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 0 10px rgba(255, 0, 127, 0.4))' }}>🔒</span>
          <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace', fontWeight: '800', color: '#ff007f', letterSpacing: '2px', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255, 0, 127, 0.3)' }}>
            LOCKED [{col},{row}]
          </span>
        </div>
      )}
    </div>
  );
}
