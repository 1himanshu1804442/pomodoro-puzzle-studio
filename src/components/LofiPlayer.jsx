// src/components/LofiPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';

// Why pure Web Audio API synthesis: Generating acoustic soundscapes dynamically inside the browser guarantees instantaneous zero-latency playback without bandwidth streaming limits or blocked CORS audio files!
export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState('rain'); 
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const activeNodesRef = useRef([]);
  const intervalRef = useRef(null);

  // Why global keyboard shorting: Allowing pro users to toggle sound playback via the 'M' key keeps developers immersed without reaching for a mouse!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, activeChannel]);

  useEffect(() => {
    return () => {
      stopCurrentChannel();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopCurrentChannel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    activeNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  // Why high-frequency acoustic layering: Using frequencies above 110Hz guarantees warm, audible richness even on smaller laptop and desktop monitor speakers!
  const startChannel = (channel, ctx, masterGain) => {
    stopCurrentChannel();

    if (channel === 'rain') {
      // 🌧️ Crisp Rain on Window Panes (1400Hz Bandpass Noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 0.8;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      activeNodesRef.current.push(whiteNoise, filter);

    } else if (channel === 'highway') {
      // 🏎️ Futuristic Electric Engine Hum (110Hz & 220Hz Dual Drone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const droneGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.value = 110; // Warm harmonic audible bass
      osc2.type = 'sine';
      osc2.frequency.value = 220; // Smooth engine turbine resonance

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      droneGain.gain.value = 0.5;
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();
      activeNodesRef.current.push(osc1, osc2, filter, droneGain);

    } else if (channel === 'lofi') {
      // 🎧 Warm Lofi Arpeggiated Melody
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic notes
      let noteIndex = 0;

      const playNote = () => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(scale[noteIndex % scale.length], ctx.currentTime);
        noteIndex = Math.floor(Math.random() * scale.length);

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      };
      playNote();
      intervalRef.current = setInterval(playNote, 1600);

    } else if (channel === 'fire') {
      // 🔥 Warm Crackling Hearth (Warm hum + random high-frequency crackle spikes)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Create occasional high-amplitude sharp pops to imitate burning wood logs!
        output[i] = Math.random() < 0.03 ? (Math.random() * 2 - 1) * 3 : (Math.random() * 2 - 1) * 0.15;
      }
      const fireNoise = ctx.createBufferSource();
      fireNoise.buffer = noiseBuffer;
      fireNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400; // Let crackle pops sing clearly through speaker!

      fireNoise.connect(filter);
      filter.connect(masterGain);
      fireNoise.start();
      activeNodesRef.current.push(fireNoise, filter);

    } else if (channel === 'storm') {
      // ⛈️ Distant Thunder & Rain (1600Hz shower rain + sweeping sub-oscillator rumble)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.value = 1600;

      const thunderOsc = ctx.createOscillator();
      const thunderGain = ctx.createGain();
      thunderOsc.type = 'triangle';
      thunderOsc.frequency.value = 85; // Warm audible rumble spectrum
      thunderGain.gain.value = 0.35;

      rainSource.connect(rainFilter);
      rainFilter.connect(masterGain);
      thunderOsc.connect(thunderGain);
      thunderGain.connect(masterGain);
      rainSource.start();
      thunderOsc.start();
      activeNodesRef.current.push(rainSource, rainFilter, thunderOsc, thunderGain);

    } else if (channel === 'zen') {
      // 🔔 Zen Meditation Bowl (432Hz harmonic pure chime with long relaxation reverberation)
      const playBell = () => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const bellGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime); // Relaxing fundamental chime frequency
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(864, ctx.currentTime); // Harmonic octave resonance

        bellGain.gain.setValueAtTime(0.01, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

        osc.connect(bellGain);
        overtone.connect(bellGain);
        bellGain.connect(masterGain);
        osc.start();
        overtone.start();
        osc.stop(ctx.currentTime + 4.6);
        overtone.stop(ctx.currentTime + 4.6);
      };
      playBell();
      intervalRef.current = setInterval(playBell, 5000);
    }
  };

  const initAudio = (newChannel) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    startChannel(newChannel || activeChannel, audioCtxRef.current, gainNodeRef.current);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopCurrentChannel();
      if (audioCtxRef.current) audioCtxRef.current.suspend();
      setIsPlaying(false);
    } else {
      initAudio(activeChannel);
    }
  };

  const switchChannel = (ch) => {
    setActiveChannel(ch);
    if (isPlaying) initAudio(ch);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
  };

  const channels = [
    { id: 'rain', label: '🌧️ Rain' },
    { id: 'highway', label: '🏎️ Highway' },
    { id: 'lofi', label: '🎧 Lofi Beats' },
    { id: 'fire', label: '🔥 Campfire' },
    { id: 'storm', label: '⛈️ Storm' },
    { id: 'zen', label: '🔔 Zen Bowl' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
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
