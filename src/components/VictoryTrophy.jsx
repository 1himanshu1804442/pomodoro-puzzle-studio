import React from 'react';

// Why this structural pattern: We use a full-screen overlay portal-like component to create a dramatic, uninterrupted flow when the user succeeds.
// Props clearly dictate visual info (sessionXp for current round, totalXp for lifetime, tasks, image preview).

export default function VictoryTrophy({ totalTasks, sessionXp, totalXp, activeArtwork, onContinue }) {
  const handleShareX = () => {
    const text = `I just completed ${totalTasks} tasks and earned ${sessionXp} XP in Pomodoro Studio! Join the grind!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareLinkedIn = () => {
    // LinkedIn share URL is more limited, usually just URL, but we can try to pass summary or just open the generic sharer
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Challenge Badge Link copied to clipboard!');
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease-out',
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 25, 45, 0.9), rgba(10, 15, 30, 0.95))',
        border: '2px solid #00f0ff',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 0 50px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(255, 0, 127, 0.2)',
        color: '#fff'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(90deg, #ff007f, #00f0ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(255, 0, 127, 0.5)'
        }}>
          VICTORY ACHIEVED!
        </h2>
        
        <p style={{ fontSize: '1.2rem', color: '#c5d2e0', marginBottom: '2rem' }}>
          You crushed it. The fog has cleared and your focus is rewarded.
        </p>

        {/* Why separate session vs total XP display: Previously this showed cumulative lifetime XP as "XP GAINED" which was misleading. Now it correctly shows only the XP earned in this specific session, plus the lifetime total for context. */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '2rem',
          background: 'rgba(0,0,0,0.5)',
          padding: '1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#8892b0' }}>TASKS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00f0ff' }}>{totalTasks}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#8892b0' }}>XP EARNED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff007f' }}>+{sessionXp}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#8892b0' }}>TOTAL XP</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a78bfa' }}>{totalXp}</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#8892b0', marginBottom: '0.5rem' }}>UNLOCKED ARTWORK</div>
          <div style={{
            height: '120px',
            borderRadius: '12px',
            backgroundImage: `url(${activeArtwork})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid rgba(0, 240, 255, 0.5)',
            boxShadow: '0 0 20px rgba(0,240,255,0.3)'
          }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={handleShareX} style={btnStyle('#1DA1F2')}>Share on X / Twitter</button>
          <button onClick={handleShareLinkedIn} style={btnStyle('#0A66C2')}>Share on LinkedIn</button>
          <button onClick={handleCopyLink} style={btnStyle('rgba(255,255,255,0.1)')}>Copy Challenge Badge Link</button>
        </div>

        <button onClick={onContinue} style={{
          background: 'linear-gradient(90deg, #00f0ff, #0072ff)',
          color: '#000',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '30px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.6)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          CONTINUE TO NEXT LEVEL
        </button>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg,
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '0.8rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.2s ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem'
});
