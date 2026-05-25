import React from 'react';
import { BookOpen, Leaf, Moon, ClipboardList } from 'lucide-react';
import { playClick } from './SoundSynthesizer';

/**
 * IntentionSwitcher - Horizontal glassmorphic select deck for universal workspaces.
 */
export default function IntentionSwitcher({ activeMode, setMode }) {
  const modes = [
    { id: 'study', label: 'Focal Study', icon: <BookOpen size={16} />, color: 'var(--accent)' },
    { id: 'relax', label: 'Deep Relax', icon: <Leaf size={16} />, color: '#81c784' },
    { id: 'meditate', label: 'Zen Meditate', icon: <Moon size={16} />, color: 'var(--accent-secondary)' },
    { id: 'life', label: 'Life Routine', icon: <ClipboardList size={16} />, color: 'var(--warning)' }
  ];

  const handleModeChange = (modeId) => {
    setMode(modeId);
    playClick();
  };

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '10px 16px', 
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
      }}
    >
      <span className="outfit-font" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Current Intention
      </span>

      {/* Intention Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {modes.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isActive ? m.color : 'var(--panel-border)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.15)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isActive ? `0 0 10px ${m.color}25` : 'none'
              }}
              className="tactile-card"
            >
              <span style={{ color: isActive ? m.color : 'inherit' }}>{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
