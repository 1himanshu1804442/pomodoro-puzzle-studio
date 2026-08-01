import React, { useState, useEffect, useRef } from 'react';

// Why this structural pattern: Integrated audio retention keeps study streamers engaged without external tabs.
// We use Web Audio API (for rain/hum) and a generic synth/oscillator for beats to avoid external assets failing.
// The visual equalizer gives immediate, satisfying feedback tied to the audio state.

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [track, setTrack] = useState('rain'); 

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
    ['rainSource', 'humSource', 'fireSource', 'stormSource'].forEach(src => {
      if (nodesRef.current[src]) {
        try { nodesRef.current[src].stop(); } catch(e){}
        nodesRef.current[src].disconnect();
        nodesRef.current[src] = null;
      }
    });
    ['beatsInterval', 'stormInterval', 'zenInterval'].forEach(interval => {
      if (nodesRef.current[interval]) {
        clearInterval(nodesRef.current[interval]);
        nodesRef.current[interval] = null;
      }
    });
  };

  const playRain = (ctx, gainNode) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; 
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

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
    osc.frequency.value = 50; 

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; 
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
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; 
    
    nodesRef.current.beatsInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)] / 2; 
      
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(noteGain);
      noteGain.connect(gainNode);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }, 600);
  };

  const playFire = (ctx, gainNode) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Crackling fire: white noise with random amplitude spikes
      const noise = Math.random() * 2 - 1;
      data[i] = noise * (Math.random() < 0.05 ? 1.5 : 0.5); 
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    noiseSource.start();
    nodesRef.current.fireSource = noiseSource;
  };

  const playStorm = (ctx, gainNode) => {
    // Pink noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // compensate gain
        b6 = white * 0.115926;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    noiseSource.connect(gainNode);
    noiseSource.start();
    nodesRef.current.stormSource = noiseSource;

    // Occasional low-freq rumbling oscillator pulses
    nodesRef.current.stormInterval = setInterval(() => {
        if(Math.random() > 0.3) return; // sometimes skip
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 60 + Math.random() * 40; 
        
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
        
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        
        osc.start();
        osc.stop(ctx.currentTime + 4);
    }, 5000);
  };

  const playZen = (ctx, gainNode) => {
    // Periodic decaying sine wave harmonic tones
    const notes = [329.63, 440.00, 523.25, 659.25, 880.00]; // E4, A4, C5, E5, A5
    nodesRef.current.zenInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
      
      osc.connect(noteGain);
      noteGain.connect(gainNode);
      
      osc.start();
      osc.stop(ctx.currentTime + 3);
    }, 3500);
  };

  useEffect(() => {
    // Mute toggle on M press
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key.toLowerCase() === 'm') {
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      const ctx = audioCtxRef.current;
      
      if (!nodesRef.current.masterGain) {
        nodesRef.current.masterGain = ctx.createGain();
        nodesRef.current.masterGain.connect(ctx.destination);
      }
      
      nodesRef.current.masterGain.gain.value = volume;
      
      stopAll();
      
      if (track === 'rain') playRain(ctx, nodesRef.current.masterGain);
      else if (track === 'hum') playHum(ctx, nodesRef.current.masterGain);
      else if (track === 'beats') playBeats(ctx, nodesRef.current.masterGain);
      else if (track === 'fire') playFire(ctx, nodesRef.current.masterGain);
      else if (track === 'storm') playStorm(ctx, nodesRef.current.masterGain);
      else if (track === 'zen') playZen(ctx, nodesRef.current.masterGain);
      
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

      <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginBottom: '0.5rem' }}>
        [M: Mute/Unmute Radio]
      </div>

      {/* Track Selection */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'rain', label: '🌧️ Cyberpunk Rain' },
          { id: 'hum', label: '🏎️ Highway Hum' },
          { id: 'beats', label: '🎧 Lofi Beats' },
          { id: 'fire', label: '🔥 Crackling Fire' },
          { id: 'storm', label: '⛈️ Night Storm' },
          { id: 'zen', label: '🔔 Zen Meditation Chimes' }
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
              minWidth: '120px'
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
