import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Eraser, BrainCircuit } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * BrainDump - Unclutter scratchpad.
 * Helps users offload hyper-focal distractions immediately so they don't derail focus.
 * Enhanced with real-time query searching and fading overlays.
 */
export default function BrainDump({ addTask }) {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Split lines and filter out empty ones
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const handleSweepLine = (line, index) => {
    addTask(line, 'todo'); // Add as standard task to 'todo' column
    playSuccess();

    // Remove the swept line from the textarea
    const rawLines = text.split('\n');
    let occurrencesFound = 0;
    const updatedLines = rawLines.filter((rawLine) => {
      if (rawLine.trim() === line && occurrencesFound === 0) {
        occurrencesFound++;
        return false;
      }
      return true;
    });

    setText(updatedLines.join('\n'));
  };

  const handleClear = () => {
    setText('');
    setSearchQuery('');
    playClick();
  };

  return (
    <div className="glass-panel brain-dump-widget" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
            Sensory Brain Dump
          </h3>
        </div>
        {text && (
          <button 
            onClick={handleClear} 
            className="sensory-button-secondary" 
            style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Eraser size={12} />
            Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Got a random idea or a distracting thought? Dump it here immediately to keep your focus. Parse it into structured tasks whenever you are ready!
      </p>

      {/* FIX 23: Warm in-context subheading */}
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, opacity: 0.7, marginTop: '-8px' }}>
        A thought enters your head mid-session. Type it here in 3 seconds and forget it. Come back to it when you're ready.
      </p>

      {/* Single-line borderless Search Bar */}
      {lines.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🔍</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or filter distraction lines..."
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>
      )}

      {/* Tactile Scratchpad Text Area */}
      <textarea
        className="sensory-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`💡 Type random thoughts, ideas, or distractions here...\nPress Enter for a new line.`}
        style={{
          minHeight: '160px',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: '1.6',
          fontSize: '14px',
          borderColor: text ? 'rgba(79, 172, 254, 0.25)' : 'var(--panel-border)'
        }}
      />

      {/* Parsed Sweepable Tasks Container */}
      {lines.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Sweep into Flow ({lines.length})
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {lines.map((line, idx) => {
              // Fade non-matching lines to 20% opacity in real time!
              const matches = searchQuery ? line.toLowerCase().includes(searchQuery.toLowerCase()) : true;
              return (
                <div 
                  key={idx}
                  className="tactile-card"
                  onClick={() => matches && handleSweepLine(line, idx)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: matches ? 1 : 0.2,
                    cursor: matches ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-word', paddingRight: '8px' }}>
                    {line}
                  </span>
                  <span 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      fontSize: '11px', 
                      color: 'var(--accent)', 
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sweep
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
