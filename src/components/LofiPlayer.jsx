// src/components/LofiPlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Why HTML5 Audio instead of pure synthesis: While algorithmic Web Audio math saves file bandwidth, it inherently produces robotic, fizzy noise. Playing real studio-recorded field acoustic loop MP3s guarantees warm, relaxing fidelity identical to Lofi Girl and Noisli!
export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState('rain'); 
  const [volume, setVolume] = useState(0.6);
  
  const audioRef = useRef(null);

  // Why useCallback: Wrapping togglePlay in useCallback with an empty dependency array prevents stale closures. The functional updater pattern (prev => !prev) already reads the latest state without needing isPlaying in the dependency array.
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Why empty dependency for keyboard effect: Since togglePlay is memoized and uses functional updater, we don't need isPlaying or activeChannel as dependencies. This prevents the listener from being torn down and re-registered on every play/pause toggle.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Why separate effect for audio sync: Keeping playback state synchronization in its own effect with explicit dependencies ensures volume changes, channel switches, and play/pause all respond correctly.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.warn('Browser autoplay policy prevented audio execution:', error));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [activeChannel, isPlaying, volume]);

  const switchChannel = (ch) => {
    setActiveChannel(ch);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const channels = [
    { id: 'rain', label: '🌧️ City Rain' },
    { id: 'highway', label: '🏎️ Night Traffic' },
    { id: 'lofi', label: '🎧 Lofi Beats' },
    { id: 'fire', label: '🔥 Campfire' },
    { id: 'storm', label: '⛈️ Thunder Storm' },
    { id: 'zen', label: '🌊 Ocean Waves' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      {/* Hidden Native HTML5 Audio Player with automatic looping */}
      <audio 
        ref={audioRef}
        loop
        src={`/assets/audio/${activeChannel}.mp3`}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00f0ff', letterSpacing: '1px', fontWeight: '800' }}>
          📻 LOFI STUDIO RADIO
        </h3>
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#a0aec0', fontWeight: '600' }}>
          [Key M: Mute]
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1.2rem' }}>
        {channels.map((ch) => {
          const isSelected = activeChannel === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => switchChannel(ch.id)}
              style={{
                background: isSelected && isPlaying ? 'linear-gradient(135deg, #00f0ff, #ff007f)' : isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isSelected && isPlaying ? '#000000' : isSelected ? '#00f0ff' : '#cbd5e1',
                border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                fontWeight: isSelected ? '800' : '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: isSelected && isPlaying ? '0 0 15px rgba(0,240,255,0.5)' : 'none'
              }}
            >
              {ch.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          className="btn"
          onClick={togglePlay}
          style={{
            background: isPlaying ? '#ff007f' : '#00f0ff',
            color: isPlaying ? '#ffffff' : '#000000',
            borderColor: isPlaying ? '#ff007f' : '#00f0ff',
            padding: '0.4rem 1.2rem',
            fontWeight: '900',
            fontSize: '0.9rem',
            boxShadow: isPlaying ? '0 0 15px rgba(255,0,127,0.6)' : '0 0 15px rgba(0,240,255,0.6)'
          }}
        >
          {isPlaying ? '⏸ MUTE' : '▶ LISTEN'}
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            style={{ flex: 1, accentColor: '#00f0ff', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
