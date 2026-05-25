import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { playClick } from './SoundSynthesizer';

/**
 * Affirmations - Supports dynamic, comforting daily quotes matching active mind intentions.
 * Automatically rotates quotes every 10 seconds when the focus timer is running.
 * Streamlined to render a borderless, centered 2-line text block during focus.
 */
export default function Affirmations({ mode, timerRunning, customAffirmations = '', useCustomAffirmations = false }) {
  const [activeQuote, setActiveQuote] = useState('');

  const quotes = {
    study: [
      "✨ It is completely okay to start small. Let's just do one easy step for 2 minutes.",
      "🧠 One thing at a time, you have plenty of time. Your mind is capable and resilient.",
      "⚡ Focus isn't about being perfect; it's about returning gently when you drift off.",
      "🎓 Deep breath. Your value as a person is not defined by how much you complete today."
    ],
    relax: [
      "🌊 There is absolutely nothing you need to accomplish right now. Let your shoulders drop.",
      "🍃 You are safe, and your mind deserves this quiet moment of resting. Details can wait.",
      "🌸 Rest is not earned; it is a fundamental need. Breathe in soft space, breathe out tasks.",
      "🕊️ Let your thoughts drift like soft clouds in a quiet sky. Enjoy this peaceful sanctuary."
    ],
    meditate: [
      "🧘 Let go of the need to do. Simply be. Inhale fresh peace, exhale old tension.",
      "✨ Listen to the chime, feel your feet on the ground, and return gently to the absolute now.",
      "🌸 Just this breath. Just this second. You are present, whole, and completely alive.",
      "🍃 Quieting the mind is not about stopping thoughts, but letting them pass without struggle."
    ],
    life: [
      "🌟 Consistency isn't about perfection; it is about showing up gently for yourself.",
      "💪 Small, consistent, compassionate steps create large, wonderful waves in your life.",
      "✨ Treat yourself with the same soft kindness you would show a dear friend today.",
      "🌱 Every single action you take for self-care is a beautiful watering of your inner garden."
    ]
  };

  const getNewQuote = () => {
    if (useCustomAffirmations && customAffirmations.trim() !== '') {
      const list = customAffirmations
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (list.length > 0) {
        let idx = Math.floor(Math.random() * list.length);
        if (list.length > 1 && list[idx] === activeQuote) {
          idx = (idx + 1) % list.length;
        }
        setActiveQuote(list[idx]);
        return;
      }
    }

    const list = quotes[mode] || quotes.study;
    let idx = Math.floor(Math.random() * list.length);
    if (list.length > 1 && list[idx] === activeQuote) {
      idx = (idx + 1) % list.length;
    }
    setActiveQuote(list[idx]);
  };

  // Re-roll quote when mode or custom settings change
  useEffect(() => {
    getNewQuote();
  }, [mode, useCustomAffirmations, customAffirmations]);

  // Rotate quotes every 10 seconds when the timer is active!
  useEffect(() => {
    let intervalId = null;
    if (timerRunning) {
      intervalId = setInterval(() => {
        getNewQuote();
      }, 10000); // 10 seconds
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timerRunning, mode, activeQuote, useCustomAffirmations, customAffirmations]);

  const handleRefresh = () => {
    getNewQuote();
    playClick();
  };

  const getAccentColor = () => {
    if (mode === 'relax') return '#81c784';
    if (mode === 'meditate') return 'var(--accent-secondary)';
    if (mode === 'life') return 'var(--warning)';
    return 'var(--accent)';
  };

  // HYPER-FOCAL VIEWPORT: Clean, borderless, centered 2-line quote block under the clock
  if (timerRunning) {
    return (
      <div 
        style={{ 
          height: '52px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '440px',
          margin: '0 auto',
          padding: '0 20px',
          animation: 'bloomPop 0.4s ease-out'
        }}
      >
        <span 
          className="outfit-font" 
          style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.5,
            fontStyle: 'italic',
            display: 'block'
          }}
        >
          {activeQuote}
        </span>
      </div>
    );
  }

  // Setup Viewport: Standard glass panelcard
  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '16px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '16px',
        borderLeft: `3px solid ${getAccentColor()}`,
        animation: 'bloomPop 0.4s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', flex: 1 }}>
        <Sparkles size={16} style={{ color: getAccentColor(), flexShrink: 0 }} />
        <span 
          className="outfit-font" 
          style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: 'var(--text-primary)', 
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}
        >
          {activeQuote}
        </span>
      </div>

      <button
        onClick={handleRefresh}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="tactile-card"
        title="Refresh reminder"
      >
        <RefreshCw size={13} />
      </button>
    </div>
  );
}
