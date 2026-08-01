// src/components/PuzzleBoard.jsx
import React, { useMemo } from 'react';
import PuzzleTile from './PuzzleTile';

// Why Free-Play Mode (totalTasks === 0): When users clear their checklist or start a fresh session,
// displaying an unobscured wallpaper builds visual appreciation until they deliberately add tasks to initiate lockdown!
export default function PuzzleBoard({ totalTasks, completedTasksCount, activeArtwork }) {
  const gridParams = useMemo(() => {
    const minTiles = Math.max(4, totalTasks);
    if (minTiles <= 4) return { rows: 2, cols: 2, total: 4 };
    if (minTiles <= 9) return { rows: 3, cols: 3, total: 9 };
    return { rows: 4, cols: 4, total: 16 };
  }, [totalTasks]);

  // Why this logic: Create a smart unlock sequence that avoids hiding the first unlocked tile under the top-left timer window!
  const unlockOrder = useMemo(() => {
    const total = gridParams.total;
    const indices = Array.from({ length: total }, (_, i) => i);
    
    // Specifically rotate indices so center/right tiles open before the top-left corner (index 0)
    if (total === 4) {
      return [3, 1, 2, 0]; // Bottom-right, Top-right, Bottom-left, Top-left
    }
    if (total === 9) {
      return [4, 5, 7, 8, 2, 1, 3, 6, 0]; // Center first, outwards to corners
    }
    if (total === 16) {
      return [5, 6, 9, 10, 7, 11, 15, 14, 13, 8, 4, 3, 2, 1, 12, 0]; // Core center matrix outward
    }
    return indices;
  }, [gridParams.total]);

  const isVictory = totalTasks > 0 && completedTasksCount >= totalTasks;
  const isFreePlay = totalTasks === 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundColor: '#05070d'
    }}>
      {/* Free Play Mode: Show clean wallpaper without grid lock when list is empty */}
      {isFreePlay ? (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          <img 
            src={activeArtwork} 
            alt="Free-Play Artwork Wallpaper" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1) saturate(1.15)', transition: 'all 0.5s ease' }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '0.6rem 2rem',
            borderRadius: '30px',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            color: '#00f0ff',
            fontWeight: '700',
            fontSize: '0.95rem',
            letterSpacing: '1px',
            zIndex: 100
          }}>
            ✨ FREE-PLAY MODE: Add tasks to your checklist to initiate your next puzzle lockdown! ✨
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${gridParams.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridParams.rows}, 1fr)`,
          gap: '2px',
          background: 'rgba(0, 240, 255, 0.15)'
        }}>
          {isVictory ? (
            <div className="victory-anim" style={{
              gridColumn: '1 / -1',
              gridRow: '1 / -1',
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img 
                src={activeArtwork} 
                alt="Victory Artwork Background" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95) contrast(1.1) saturate(1.15)' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                padding: '1rem 2.5rem',
                borderRadius: '40px',
                border: '2px solid #00f0ff',
                color: '#00f0ff',
                fontWeight: '900',
                fontSize: '1.3rem',
                textShadow: '0 0 15px #00f0ff',
                boxShadow: '0 0 35px rgba(0, 240, 255, 0.8)',
                letterSpacing: '2px',
                zIndex: 100,
                whiteSpace: 'nowrap'
              }}>
                ✨ MASTERPIECE COMPLETED: WORKSPACE UNLOCKED! ✨
              </div>
            </div>
          ) : (
            Array.from({ length: gridParams.total }).map((_, index) => {
              const orderRank = unlockOrder.indexOf(index);
              const isUnlocked = orderRank < completedTasksCount;
              
              return (
                <PuzzleTile 
                  key={index} 
                  imageUrl={activeArtwork}
                  isUnlocked={isUnlocked}
                  gridParams={gridParams}
                  index={index}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
