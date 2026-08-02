import React, { useState, useEffect, useRef } from 'react';
import TaskList from '../components/TaskList';
import PomodoroTimer from '../components/PomodoroTimer';
import PuzzleBoard from '../components/PuzzleBoard';
import { getLoadedArtworks, saveCustomArtwork } from '../services/imageService';
import LofiPlayer from '../components/LofiPlayer';
import VictoryTrophy from '../components/VictoryTrophy';
import { loadSavedXP, saveXP, XP_PER_TASK, getLevel, getRankTitle, getXPProgressPercent } from '../services/xpService';

// Why this Forest App inspired architecture: Anchoring the focus countdown in the exact screen center above the wallpaper while isolating all todo controls inside a collapsible right-hand drawer projects serious, professional elegance!
export default function ArcadeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(0);
  const [artworks, setArtworks] = useState([]);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalXp, setTotalXp] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const initialArtworks = getLoadedArtworks();
    setArtworks(initialArtworks);
    setTotalXp(loadSavedXP());
  }, []);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const completedCount = tasks.filter(t => t.completed).length;
  
  const currentLevel = getLevel(totalXp);
  const currentRank = getRankTitle(currentLevel);
  const xpProgress = getXPProgressPercent(totalXp);
  
  const isVictory = tasks.length > 0 && completedCount === tasks.length;

  // Why fullscreen synchronization: Listening to native browser fullscreenchange events ensures our React UI state remains 100% aligned even if the user exits fullscreen using F11 or browser menus.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
      setIsFullscreen(isFull);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Why universal cross-browser fullscreen handling: Supporting standard HTML5 along with WebKit and Microsoft proprietary extensions ensures edge-to-edge window expansion never stalls across varying desktop browsers!
  const toggleFullscreen = () => {
    const doc = document.documentElement;
    const isFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (!isFull) {
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(err => console.warn('Full-screen request aborted:', err));
      } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) {
        doc.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Why useEffect: Keyboard shortcuts allow users to easily toggle wallpaper inspect mode (ESC) and full-screen immersion (F key).
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      
      if (e.key === 'Escape') {
        // If we are currently hiding UI, restore controls when pressing ESC!
        if (isUiHidden) {
          setIsUiHidden(false);
        } else if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          setIsUiHidden(prev => !prev);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUiHidden]);

  // Why this logic: Clicking continue transitions the user to the next arcade level and automatically rotates the background artwork!
  const handleContinue = () => {
    setTasks([]);
    if (artworks.length > 0) {
      setActiveArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length);
    }
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));
    if (activeTaskId === id) setActiveTaskId(null);
    
    // Add XP and persist to local storage
    const newXp = totalXp + XP_PER_TASK;
    setTotalXp(newXp);
    saveXP(newXp);
  };

  // Why fail-safe memory state injection: Ensuring the uploaded wallpaper is added to React state before checking offline disk storage guarantees 100% reliable rendering even for multi-megabyte photo uploads!
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const cleanTitle = file.name ? file.name.split('.')[0] : 'Custom Photo';
        const newArt = saveCustomArtwork(dataUrl, cleanTitle.substring(0, 15));
        
        setArtworks(prev => {
          const alreadyExists = prev.some(a => a.id === newArt.id);
          const updatedList = alreadyExists ? prev : [...prev, newArt];
          setActiveArtworkIndex(updatedList.length - 1);
          return updatedList;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeArtwork = artworks[activeArtworkIndex]?.imagePath || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1920&q=85';

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {isVictory && !isUiHidden && (
        <VictoryTrophy 
          totalTasks={completedCount} 
          totalXp={totalXp} 
          activeArtwork={activeArtwork} 
          onContinue={handleContinue} 
        />
      )}

      {/* Immersive Wall-to-Wall Background Puzzle Matrix */}
      <PuzzleBoard 
        totalTasks={tasks.length}
        completedTasksCount={completedCount}
        activeArtwork={activeArtwork}
      />

      {/* Floating UI Hidden Mode Hint Badge */}
      {isUiHidden && (
        <div 
          onClick={() => setIsUiHidden(false)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 14, 25, 0.9)',
            border: '1px solid #00f0ff',
            padding: '0.6rem 1.5rem',
            borderRadius: '30px',
            color: '#00f0ff',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
            letterSpacing: '1px'
          }}
        >
          👁️ UI HIDDEN (WALLPAPER MODE) — Click here or press ESC to restore studio controls
        </div>
      )}

      {/* Studio Workspace Layout */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'none',
        opacity: isUiHidden ? 0 : 1,
        transition: 'opacity 0.4s ease',
        visibility: isUiHidden ? 'hidden' : 'visible'
      }}>
        {/* Minimalist Top Studio Navbar */}
        <header style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.8rem 2rem',
          pointerEvents: 'auto',
          background: 'rgba(8, 10, 18, 0.5)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
          zIndex: 50
        }}>
          {/* Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🌳</span>
            <h1 style={{ 
              margin: 0, 
              fontSize: '1.35rem', 
              background: 'linear-gradient(90deg, #00f0ff, #ff007f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900',
              letterSpacing: '1.5px',
              whiteSpace: 'nowrap'
            }}>
              POMODORO STUDIO
            </h1>
          </div>

          {/* Compact Inline XP Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem', 
            background: 'rgba(0,0,0,0.5)', padding: '0.4rem 1.2rem', borderRadius: '25px', 
            border: '1px solid rgba(0, 240, 255, 0.25)', minWidth: '260px', flex: 1, maxWidth: '380px'
          }}>
            <div style={{ color: '#00f0ff', fontWeight: '800', fontSize: '0.82rem' }}>
              LVL {currentLevel}
            </div>
            <div style={{ flex: 1, height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${xpProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00f0ff, #ff007f)', transition: 'width 0.5s ease-out' }}></div>
            </div>
            <div style={{ color: '#ff007f', fontWeight: '800', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {totalXp} XP ({currentRank})
            </div>
          </div>

          {/* Controls: Theme Picker, Full-Screen & Hide UI Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            
            {/* Why minimalist dropdown picker: Replacing 10 wrapping buttons with an intuitive selector and cycling arrows keeps the navbar spotless while enabling rapid browsing of high-definition photography! */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0, 0, 0, 0.65)', padding: '0.3rem 0.7rem', borderRadius: '30px', border: '1px solid rgba(0, 240, 255, 0.35)' }}>
              <button 
                onClick={() => setActiveArtworkIndex((prev) => (prev - 1 + artworks.length) % artworks.length)}
                style={{ background: 'transparent', border: 'none', color: '#00f0ff', cursor: 'pointer', fontSize: '1.05rem', fontWeight: '900', padding: '0 0.2rem' }}
                title="Previous Wallpaper Theme"
              >
                ◀
              </button>
              
              <select 
                value={activeArtworkIndex}
                onChange={(e) => setActiveArtworkIndex(Number(e.target.value))}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: '0 0.2rem',
                  maxWidth: '190px'
                }}
              >
                {artworks.map((art, idx) => (
                  <option key={art.id || idx} value={idx} style={{ background: '#0a0e19', color: '#ffffff', fontWeight: '700' }}>
                    🎨 {art.title} ({art.genre || 'Theme'})
                  </option>
                ))}
              </select>

              <button 
                onClick={() => setActiveArtworkIndex((prev) => (prev + 1) % artworks.length)}
                style={{ background: 'transparent', border: 'none', color: '#00f0ff', cursor: 'pointer', fontSize: '1.05rem', fontWeight: '900', padding: '0 0.2rem' }}
                title="Next Wallpaper Theme"
              >
                ▶
              </button>
              
              <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 0.2rem' }}></div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(0, 240, 255, 0.18)',
                  color: '#00f0ff',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}
              >
                📤 UPLOAD YOUR OWN
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            {/* FULL SCREEN TOGGLE BUTTON */}
            <button 
              className="btn" 
              onClick={toggleFullscreen}
              title="Toggle edge-to-edge full-screen studio immersion (Key F)"
              style={{ 
                background: isFullscreen ? 'linear-gradient(135deg, #ff007f, #00f0ff)' : 'rgba(255, 0, 127, 0.15)', 
                borderColor: '#ff007f', 
                color: isFullscreen ? '#000000' : '#ff007f', 
                padding: '0.45rem 0.9rem', 
                fontSize: '0.82rem',
                fontWeight: '800',
                boxShadow: isFullscreen ? '0 0 15px rgba(255,0,127,0.5)' : 'none',
                cursor: 'pointer'
              }}
            >
              {isFullscreen ? '🗗 EXIT FULL SCREEN' : '⛶ FULL SCREEN'}
            </button>

            <button 
              className="btn" 
              onClick={() => setIsUiHidden(true)}
              title="Hide UI controls to inspect your full background puzzle artwork (Press ESC)"
              style={{ background: 'rgba(0, 240, 255, 0.12)', borderColor: '#00f0ff', color: '#00f0ff', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
            >
              👁️ Inspect Art
            </button>
          </div>
        </header>

        {/* Primary Screen Layout: Hero Centerpiece + Docked Studio Drawer */}
        <div style={{ display: 'flex', flex: 1, position: 'relative', width: '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
          
          {/* DEAD-CENTER HERO TIMER WORKSPACE */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            pointerEvents: 'auto',
            paddingRight: isSidebarOpen ? '400px' : '0', 
            transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <PomodoroTimer 
              activeTask={activeTask}
              onCompleteTask={handleCompleteTask}
            />
          </div>

          {/* SIDEBAR TOGGLE TAB BUTTON */}
          <div style={{
            position: 'absolute',
            top: '25px',
            right: isSidebarOpen ? '400px' : '20px',
            zIndex: 100,
            pointerEvents: 'auto',
            transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'rgba(8, 12, 22, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                padding: '0.6rem 1.2rem',
                borderRadius: isSidebarOpen ? '30px 0 0 30px' : '30px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '-4px 4px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.5px'
              }}
            >
              {isSidebarOpen ? '▶ HIDE SIDEBAR' : '◀ 📁 STUDY STUDIO (TASKS & RADIO)'}
            </button>
          </div>

          {/* DOCKED RIGHT-HAND STUDIO SIDEBAR DRAWER (Forest App Vibe!) */}
          <aside style={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            background: 'rgba(8, 11, 20, 0.4)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem 1.5rem',
            overflowY: 'auto',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '-10px 0 35px rgba(0,0,0,0.6)',
            zIndex: 40
          }}>
            {/* Lofi Radio Synthesizer Console */}
            <LofiPlayer />

            {/* Todo Checklist Module */}
            <TaskList 
              tasks={tasks}
              setTasks={setTasks}
              activeTaskId={activeTaskId}
              setActiveTaskId={setActiveTaskId}
            />
          </aside>

        </div>
      </div>
    </div>
  );
}
