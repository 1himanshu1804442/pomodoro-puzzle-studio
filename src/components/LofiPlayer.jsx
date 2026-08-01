import React, { useState, useEffect, useRef } from 'react';

// Why this structural pattern: Integrated audio retention keeps study streamers engaged without external tabs.
// We use Web Audio API (for rain/hum) and a generic synth/oscillator for beats to avoid external assets failing.
// The visual equalizer gives immediate, satisfying feedback tied to the audio state.

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [track, setTrack] = useState('rain'); // 'rain', 'hum', 'beats'

  const audioCtxRef = useRef(null);
  const nodesRef = useRef({});

  // Initialize Audio Context on demand to comply with browser autoplay policies
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAll = () => {
    if (nodesRef.current.rainSource) {
      nodesRef.current.rainSource.stop();
      nodesRef.current.rainSource.disconnect();
      nodesRef.current.rainSource = null;
    }
    if (nodesRef.current.humSource) {
      nodesRef.current.humSource.stop();
      nodesRef.current.humSource.disconnect();
      nodesRef.current.humSource = null;
    }
    if (nodesRef.current.beatsInterval) {
      clearInterval(nodesRef.current.beatsInterval);
      nodesRef.current.beatsInterval = null;
    }
  };

  const playRain = (ctx, gainNode) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to make it pink/brownish noise (rain-like)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    noiseSource.start();
    nodesRef.current.rainSource = noiseSource;
  };

  const playHum = (ctx, gainNode) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 50; // Deep hum

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // Slow modulation
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.connect(gainNode);
    osc.start();
    lfo.start();
    
    nodesRef.current.humSource = osc;
    nodesRef.current.humLfo = lfo;
  };

  const playBeats = (ctx, gainNode) => {
    // Simple generative synth melody
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // C D E F G A
    
    nodesRef.current.beatsInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)] / 2; // Lower octave
      
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(noteGain);
      noteGain.connect(gainNode);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }, 600); // Trigger note every 600ms
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      const ctx = audioCtxRef.current;
      
      // Setup master gain
      if (!nodesRef.current.masterGain) {
        nodesRef.current.masterGain = ctx.createGain();
        nodesRef.current.masterGain.connect(ctx.destination);
      }
      
      nodesRef.current.masterGain.gain.value = volume;
      
      stopAll();
      
      if (track === 'rain') playRain(ctx, nodesRef.current.masterGain);
      else if (track === 'hum') playHum(ctx, nodesRef.current.masterGain);
      else if (track === 'beats') playBeats(ctx, nodesRef.current.masterGain);
      
    } else {
      stopAll();
    }
    
    return () => stopAll();
  }, [isPlaying, track]);

  useEffect(() => {
    if (nodesRef.current.masterGain) {
      nodesRef.current.masterGain.gain.value = volume;
    }
  }, [volume]);

  return (
    <div style={{
      background: 'rgba(15, 20, 35, 0.65)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      color: '#e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00f0ff', letterSpacing: '1px' }}>
          AUDIO CONSOLE
        </h3>
        
        {/* Visual Equalizer Animation */}
        <div style={{ display: 'flex', gap: '3px', height: '20px', alignItems: 'flex-end' }}>
          {[1, 2, 3, 4, 5].map((bar) => (
            <div 
              key={bar}
              style={{
                width: '6px',
                backgroundColor: isPlaying ? '#ff007f' : '#4a5568',
                borderRadius: '3px',
                height: isPlaying ? '100%' : '20%',
                animation: isPlaying ? `eqBounce ${0.5 + Math.random()}s ease-in-out infinite alternate` : 'none',
                transition: 'height 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Track Selection */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'rain', label: '🌧️ Cyberpunk Rain' },
          { id: 'hum', label: '🏎️ Highway Hum' },
          { id: 'beats', label: '🎧 Lofi Beats' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTrack(t.id)}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              background: track === t.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${track === t.id ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              color: track === t.id ? '#00f0ff' : '#a0aec0',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
              minWidth: '100px'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'linear-gradient(135deg, #ff007f, #7928ca)',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>VOLUME</div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#00f0ff',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes eqBounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
