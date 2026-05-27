import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Play, ArrowRight, X } from 'lucide-react';
import { playClick } from './SoundSynthesizer';

/**
 * OnboardingModal - Implements the interactive 3-step onboarding flow modal.
 */
export default function OnboardingModal({ theme, setTheme, onComplete }) {
  const [step, setStep] = useState(1);
  const [brainDumpText, setBrainDumpText] = useState('');

  const themesList = [
    { id: 'theme-beautiful', name: '🌸 Beautiful', desc: 'Warm Light Linen' },
    { id: 'theme-thoughtful', name: '🪵 Thoughtful', desc: 'Sand & Sepia' },
    { id: 'theme-mindful', name: '🌿 Mindful', desc: 'Sage & Eucalyptus' },
    { id: 'theme-deepwork', name: 'Deep Work 🖤', desc: 'Obsidian Slate' }
  ];

  const handleNext = () => {
    playClick();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(brainDumpText.trim());
    }
  };

  const handleSkip = () => {
    playClick();
    onComplete('');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(35px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        animation: 'bloomPop 0.4s ease-out'
      }}
    >
      {/* Frosted Container */}
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'var(--panel-bg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Step Indicator Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
              Welcome to MindFlow
            </span>
          </div>
          {/* L5: Visual step progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{
                  width: s === step ? '18px' : '7px',
                  height: '7px',
                  borderRadius: '99px',
                  backgroundColor: s <= step ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }} />
              ))}
            </div>
            <button 
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Skip Onboarding"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Pick Your Mindset Theme
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Choose a calm color workspace that matches your active cognitive intention today.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '8px' }}>
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { playClick(); setTheme(t.id); }}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    backgroundColor: theme === t.id ? 'rgba(79, 172, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: theme === t.id ? 'var(--accent)' : 'var(--panel-border)',
                    color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{t.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Drop a Thought in Brain Dump
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Got a distracting thought or a random task? Type it here to offload it instantly. You can sweep it into structured tasks whenever you are ready!
            </p>
            
            <input 
              type="text"
              className="sensory-input"
              value={brainDumpText}
              onChange={(e) => setBrainDumpText(e.target.value)}
              placeholder="💡 Example: Buy groceries or study for exams..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                marginTop: '8px'
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Start Your First Session!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              MindFlow hides all sliders, menus, and sidebars the moment your timer starts, giving you a completely borderless visual environment to focus in peace.
            </p>
            
            <div 
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--panel-border)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginTop: '8px' 
              }}
            >
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(79, 172, 254, 0.1)', color: 'var(--accent)' }}>
                <Play size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Standard Focus Period</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>25 Minutes Study + 5 Minutes Rest</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <button 
            onClick={handleSkip}
            className="sensory-button-secondary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Skip Intro
          </button>
          
          <button 
            onClick={handleNext}
            className="sensory-button"
            style={{ 
              padding: '10px 24px', 
              fontSize: '13px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              backgroundColor: 'var(--accent)',
              color: '#fff',
              borderColor: 'transparent'
            }}
          >
            <span>{step === 3 ? 'Get Started' : 'Next Step'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
