import React, { useState, useEffect, useRef } from 'react';

// Why free-floating studio styling: Removing square border boxes around the timer enables majestic 8.5rem typography to float seamlessly directly over the center of the user's high-definition wallpaper, emulating Apple Design Award winning study suites like Forest!
export default function PomodoroTimer({ activeTask, onCompleteTask }) {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'

  // Why useRef for AudioContext: We store a single AudioContext reference to avoid creating a new one every time the timer completes. Browsers limit the number of simultaneous AudioContext instances.
  const audioCtxRef = useRef(null);

  // Why useEffect: React hooks safely manage setInterval lifecycles without causing memory leaks or UI re-render lags during active focus sprints.
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);

      // Play a short completion chime to alert the user, even if they switched tabs
      playCompletionChime();

      // Fire a browser notification so the user knows their session finished
      fireCompletionNotification();

      // Automatically complete the linked task if active during pomodoro mode!
      if (mode === 'pomodoro' && activeTask && onCompleteTask) {
        onCompleteTask(activeTask.id);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, activeTask, mode, onCompleteTask]);

  // Why Web Audio API synthesis for the chime: Unlike ambient soundscapes which need recorded MP3s for warmth, a brief 0.3-second bell tone is perfectly clean when synthesized. This avoids needing an extra audio file download for a simple notification ding.
  const playCompletionChime = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Create a pleasant two-tone bell chime (C5 + E5 harmonics)
      const now = ctx.currentTime;
      const frequencies = [523.25, 659.25]; // C5 and E5 for a pleasant major third interval

      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // Gentle fade-in and fade-out envelope for a clean bell sound
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + (i * 0.15));

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(now + (i * 0.15));
        oscillator.stop(now + 1.0 + (i * 0.15));
      });
    } catch (error) {
      console.warn('Could not play completion chime:', error);
    }
  };

  // Why browser Notification API: If the user has switched to another browser tab while their timer runs, a native OS notification popup will alert them that their focus session is complete. Without this, completions are silently missed.
  const fireCompletionNotification = () => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🌳 Pomodoro Studio', {
          body: `Your ${mode === 'pomodoro' ? '25-minute focus' : 'break'} session is complete! ${activeTask ? `Task: ${activeTask.text}` : 'Great work!'}`,
          icon: '/favicon.svg'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        // Request permission for future notifications
        Notification.requestPermission();
      }
    } catch (error) {
      console.warn('Browser notification unavailable:', error);
    }
  };

  // Why global spacebar listener: Enabling developers and students to start/pause their timer via Spacebar avoids breaking typing focus to touch a mouse!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space' || e.key === ' ') {
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
    // Request notification permission on first interaction (browsers require user gesture)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'pomodoro') setTimeLeft(1500);
    if (mode === 'shortBreak') setTimeLeft(300);
    if (mode === 'longBreak') setTimeLeft(900);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 20 }}>
      
      {/* Active Task Floating Pill */}
      {activeTask ? (
        <div style={{ 
          background: 'rgba(255, 0, 127, 0.25)', 
          border: '1px solid #ff007f', 
          padding: '0.45rem 1.2rem', 
          borderRadius: '30px', 
          marginBottom: '1rem',
          color: '#ff007f',
          fontWeight: '800',
          fontSize: '0.9rem',
          letterSpacing: '1px',
          boxShadow: '0 0 20px rgba(255, 0, 127, 0.4)',
          textTransform: 'uppercase'
        }}>
          🔥 FOCUSING ON: {activeTask.text}
        </div>
      ) : (
        <div style={{ 
          background: 'rgba(0, 240, 255, 0.15)', 
          border: '1px solid rgba(0, 240, 255, 0.3)', 
          padding: '0.45rem 1.2rem', 
          borderRadius: '30px', 
          marginBottom: '1rem',
          color: '#00f0ff',
          fontWeight: '700',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          opacity: 0.85
        }}>
          🌿 FREE FOCUS SESSION — Select a task from your studio sidebar to unlock puzzle tiles!
        </div>
      )}

      {/* Majestic Hero Typography Time Display */}
      {/* Why explicit color and textShadow instead of background-clip: Using standard font coloring prevents Chromium GPU rendering bugs that turned gradient timers into solid cyan block boxes when transitions fired! */}
      <div style={{
        fontSize: '8.5rem',
        fontWeight: '900',
        lineHeight: 1,
        letterSpacing: '5px',
        marginBottom: '1.2rem',
        color: '#ffffff',
        textShadow: isActive ? '0 0 35px #00f0ff, 0 0 70px rgba(0, 240, 255, 0.5)' : '0 0 15px rgba(255, 255, 255, 0.2)',
        fontFamily: 'monospace',
        transition: 'color 0.3s ease, text-shadow 0.3s ease'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Primary Control Pills */}
      <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '1.2rem', width: '100%' }}>
        <button 
          className="btn btn-primary" 
          onClick={toggleTimer} 
          style={{ 
            minWidth: '160px', 
            padding: '0.8rem 2rem', 
            fontSize: '1.1rem',
            background: isActive ? 'linear-gradient(135deg, #ff007f, #ff416c)' : 'linear-gradient(135deg, #00f0ff, #0072ff)',
            boxShadow: isActive ? '0 0 25px rgba(255, 0, 127, 0.6)' : '0 0 25px rgba(0, 240, 255, 0.6)'
          }}
        >
          {isActive ? '⏸ PAUSE' : '▶ START'}
        </button>
        <button 
          className="btn" 
          onClick={resetTimer} 
          style={{ 
            minWidth: '120px', 
            padding: '0.8rem 1.8rem', 
            fontSize: '1.1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1'
          }}
        >
          🔄 RESET
        </button>
      </div>

      {/* Keyboard hints */}
      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '2rem', background: 'rgba(0,0,0,0.5)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600' }}>
        [SPACE: Start/Pause] | [KEY F: Full-Screen] | [KEY M: Mute Radio] | [ESC: Hide UI]
      </div>

      {/* Minimalist Duration Selectors */}
      <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.55)', padding: '0.4rem 0.6rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <button 
          className={`btn ${mode === 'pomodoro' ? 'btn-primary' : ''}`} 
          onClick={() => setPreset('pomodoro', 1500)}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', border: 'none', background: mode === 'pomodoro' ? '#00f0ff' : 'transparent', color: mode === 'pomodoro' ? '#000000' : '#cbd5e1' }}
        >
          ⏱️ 25M FOCUS
        </button>
        <button 
          className={`btn ${mode === 'shortBreak' ? 'btn-primary' : ''}`} 
          onClick={() => setPreset('shortBreak', 300)}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', border: 'none', background: mode === 'shortBreak' ? '#00f0ff' : 'transparent', color: mode === 'shortBreak' ? '#000000' : '#cbd5e1' }}
        >
          ☕ 5M REST
        </button>
        <button 
          className={`btn ${mode === 'longBreak' ? 'btn-primary' : ''}`} 
          onClick={() => setPreset('longBreak', 900)}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', border: 'none', background: mode === 'longBreak' ? '#00f0ff' : 'transparent', color: mode === 'longBreak' ? '#000000' : '#cbd5e1' }}
        >
          🌴 15M BREAK
        </button>
      </div>

    </div>
  );
}
