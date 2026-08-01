import React, { useState, useEffect } from 'react';

// Why free-floating studio styling: Removing square border boxes around the timer enables majestic 7.5rem typography to float seamlessly directly over the center of the user's high-definition wallpaper, emulating Apple Design Award winning study suites like Forest!
export default function PomodoroTimer({ activeTask, onCompleteTask }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'debug'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (activeTask && mode !== 'shortBreak') {
        onCompleteTask(activeTask.id);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, activeTask, mode, onCompleteTask]);

  // Spacebar to start/pause timer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setPreset = (presetMode, seconds) => {
    setMode(presetMode);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Session Pill Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 240, 255, 0.4)', padding: '0.4rem 1.2rem', borderRadius: '30px', color: '#00f0ff', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', marginBottom: '1.2rem', boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isActive ? '#00f0ff' : '#ff007f', boxShadow: isActive ? '0 0 10px #00f0ff' : 'none' }}></span>
        {mode === 'focus' ? 'DEEP FOCUS REED' : mode === 'shortBreak' ? 'RECHARGE INTERVAL' : 'INSTANT TEST'}
      </div>
      
      {/* Active Target Banner */}
      {activeTask ? (
        <div style={{ marginBottom: '0.5rem', background: 'linear-gradient(90deg, rgba(255, 0, 127, 0.2), rgba(0, 240, 255, 0.2))', border: '1px solid #ff007f', padding: '0.5rem 1.5rem', borderRadius: '20px', color: '#ffffff', fontWeight: '800', fontSize: '1.1rem', textShadow: '0 0 10px rgba(255, 0, 127, 0.8)', boxShadow: '0 0 25px rgba(255, 0, 127, 0.4)' }}>
          🎯 ACTIVE TARGET: {activeTask.text}
        </div>
      ) : (
        <div style={{ marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.95rem', fontWeight: '600', color: '#cbd5e1', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 1rem', borderRadius: '15px' }}>
          ✨ Select an item from your study sidebar to track focus progression
        </div>
      )}

      {/* Majestic Hero Floating Time Dial */}
      <div style={{ 
        fontSize: '7.5rem', 
        fontWeight: '900', 
        margin: '0.2rem 0 1.5rem 0', 
        color: '#ffffff',
        fontFamily: "'Courier New', Courier, monospace",
        letterSpacing: '-4px',
        lineHeight: 1,
        textShadow: isActive ? '0 0 45px rgba(0, 240, 255, 0.9), 0 0 80px rgba(0, 240, 255, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.25)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Primary Control Pills */}
      <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '1rem', width: '100%' }}>
        <button 
          className="btn btn-primary" 
          onClick={toggleTimer} 
          style={{ width: '160px', padding: '0.8rem 1.5rem', fontSize: '1.1rem', borderRadius: '35px', fontWeight: '800', letterSpacing: '1px' }}
        >
          {isActive ? '⏸ PAUSE' : '▶ START'}
        </button>
        <button 
          className="btn" 
          onClick={() => {
            setIsActive(false);
            if (mode === 'focus') setTimeLeft(25 * 60);
            else if (mode === 'shortBreak') setTimeLeft(5 * 60);
            else setTimeLeft(5);
          }} 
          style={{ width: '120px', padding: '0.8rem 1.5rem', fontSize: '1.05rem', borderRadius: '35px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          ↺ RESET
        </button>
      </div>

      {/* Keyboard hints */}
      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '2rem', opacity: 0.8 }}>
        [SPACE: Start/Pause] | [ESC: Hide Studio UI]
      </div>

      {/* Minimalist Duration Selectors */}
      <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.55)', padding: '0.4rem 0.6rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <button 
          onClick={() => setPreset('focus', 25 * 60)} 
          style={{ 
            background: mode === 'focus' ? 'linear-gradient(135deg, #00f0ff, #0072ff)' : 'transparent', 
            color: mode === 'focus' ? '#000' : '#cbd5e1', 
            border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' 
          }}
        >
          25m Study
        </button>
        <button 
          onClick={() => setPreset('shortBreak', 5 * 60)} 
          style={{ 
            background: mode === 'shortBreak' ? 'linear-gradient(135deg, #00f0ff, #0072ff)' : 'transparent', 
            color: mode === 'shortBreak' ? '#000' : '#cbd5e1', 
            border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' 
          }}
        >
          5m Rest
        </button>
        <button 
          onClick={() => setPreset('debug', 5)} 
          style={{ 
            background: mode === 'debug' ? 'linear-gradient(135deg, #ff007f, #7000ff)' : 'transparent', 
            color: mode === 'debug' ? '#fff' : '#ff007f', 
            border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' 
          }}
        >
          ⚡ 5s Test
        </button>
      </div>
    </div>
  );
}
