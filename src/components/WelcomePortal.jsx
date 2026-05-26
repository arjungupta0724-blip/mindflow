import React, { useState, useRef } from 'react';
import { Sparkles, BrainCircuit, User, ShieldAlert, ChevronDown, Volume2, Sprout, ShieldCheck, Play } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * WelcomePortal - FIX 25: Full marketing landing page with hero, feature highlights,
 * then the name/avatar sign-up form. Returning users skip this entirely (handled in App.jsx).
 */
export default function WelcomePortal({ onSignIn }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const formRef = useRef(null);
  
  const avatars = ['🦊', '🦉', '🐼', '🦄', '🐸', '🐱', '🦁', '🐨', '🐬'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    playSuccess();
    onSignIn({
      name: name.trim(),
      avatar: selectedAvatar,
      createdAt: new Date().toISOString()
    });
  };

  const scrollToForm = () => {
    playClick();
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    {
      icon: <ShieldCheck size={20} style={{ color: '#ff7b7e' }} />,
      title: 'The Overwhelmed Button',
      desc: 'When everything feels like too much, one tap activates a calm-down protocol. No judgment. Just support.'
    },
    {
      icon: <Volume2 size={20} style={{ color: '#74c0fc' }} />,
      title: '14 Synthesized Soundscapes',
      desc: 'From cozy campfires to ticking clocks — all generated locally on your device. Zero network load, zero latency.'
    },
    {
      icon: <Sprout size={20} style={{ color: '#69db7c' }} />,
      title: 'A Garden That Grows With You',
      desc: 'Spend minutes focused to earn XP and watch your seedling grow through 5 organic life stages. Gamify your dopamine.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px',
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* ===================== HERO SECTION ===================== */}
      <section style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '28px',
        padding: '60px 0 40px'
      }}>
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            color: '#fff',
            boxShadow: 'var(--accent-glow)'
          }}>
            <BrainCircuit size={24} />
          </div>
          <span className="outfit-font" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            MindFlow
          </span>
        </div>

        {/* Hero badge */}
        <div style={{
          padding: '5px 14px',
          borderRadius: '99px',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.03)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={11} style={{ color: 'var(--accent)' }} />
          <span>Free · No account needed · Works offline</span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1 className="outfit-font" style={{
            fontSize: 'clamp(28px, 6vw, 50px)',
            fontWeight: '800',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em'
          }}>
            The only focus app<br />with an Overwhelmed button
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Built for the days when everything feels like too much.
          </p>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={scrollToForm}
            className="sensory-button"
            style={{ padding: '14px 36px', fontSize: '16px', fontWeight: '700', borderRadius: '12px' }}
          >
            <Play size={16} />
            Start Free Now
          </button>
          <button
            onClick={scrollToForm}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px'
            }}
          >
            See how it works
            <ChevronDown size={14} style={{ animation: 'bounceDown 2s infinite ease-in-out' }} />
          </button>
        </div>

        {/* Calm decorative placeholder UI preview */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          height: '180px',
          borderRadius: '20px',
          border: '1px solid var(--panel-border)',
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Fake timer ring */}
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', opacity: 0.15 }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="var(--accent)" strokeWidth="5" strokeDasharray="239" strokeDashoffset="60" strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="outfit-font" style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', position: 'relative' }}>25:00</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>Enter Focal Flow</span>
        </div>
      </section>

      {/* ===================== FEATURE HIGHLIGHTS ===================== */}
      <section style={{
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px 0 40px'
      }}>
        <h2 className="outfit-font" style={{
          fontSize: '20px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          What makes MindFlow different
        </h2>

        {features.map((f, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '18px',
              borderRadius: '16px',
              border: '1px solid var(--panel-border)',
              backgroundColor: 'rgba(255,255,255,0.015)',
              animation: `bloomPop 0.4s ${i * 0.1}s both`
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {f.icon}
            </div>
            <div>
              <h3 className="outfit-font" style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '6px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ===================== SIGN-UP FORM ===================== */}
      <section
        ref={formRef}
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 0 80px'
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            animation: 'bloomPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Form header */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <h2 className="outfit-font" style={{ fontSize: '22px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Create your space
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.4, maxWidth: '280px' }}>
              No email. No password. Just your name and a focus avatar.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Name input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                What should we call you?
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="sensory-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your focus nickname..."
                  required
                  maxLength={15}
                  style={{ paddingLeft: '44px' }}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>

            {/* Avatar selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Select your focus avatar
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '10px',
                borderRadius: '12px'
              }}>
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => { setSelectedAvatar(av); playClick(); }}
                    style={{
                      fontSize: '24px',
                      padding: '8px 0',
                      borderRadius: '8px',
                      background: selectedAvatar === av ? 'var(--card-bg)' : 'transparent',
                      border: selectedAvatar === av ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease'
                    }}
                    className="tactile-card"
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              type="submit"
              className="sensory-button"
              style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '4px' }}
            >
              <Sparkles size={18} />
              Start Flowing
            </button>
          </form>

          {/* Privacy notice */}
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(0,0,0,0.15)',
            borderRadius: '10px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <ShieldAlert size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>100% private:</strong> All your data lives on your device. Nothing is sent to any server. No account, no email, no tracking.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
