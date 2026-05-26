import React, { useState, useRef } from 'react';
import { Sparkles, BrainCircuit, User, ShieldAlert, ChevronDown, Volume2, Sprout, ShieldCheck, Play } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * WelcomePortal - Full marketing landing page with hero, feature highlights,
 * then the name/avatar sign-up form. Returning users skip this entirely (handled in App.jsx).
 * FIX 11: Removed SaaS disclaimer
 * FIX 12: Updated emotional copy
 * FIX 13: Replaced animal avatars with focus identity symbols
 * FIX 14: Added feature highlights above the form
 * FIX 15: Glassmorphism card on aurora gradient background
 * FIX 25: Marketing section loads first
 */
export default function WelcomePortal({ onSignIn }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌱'); // FIX 13: Default to Sprout
  const formRef = useRef(null);

  // FIX 13: Replace animal emojis with minimalist focus identity symbols
  const avatars = ['🌊', '🌱', '🪨', '🌙', '✦', '🔥'];

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

  // FIX 14: Feature highlight rows to show above the form
  const formHighlights = [
    { emoji: '🎵', text: '14 offline soundscapes — zero internet needed' },
    { emoji: '🌱', text: 'A garden that grows every time you focus' },
    { emoji: '🆘', text: "An Overwhelmed button for when it's all too much." }
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
      position: 'relative',
      // FIX 15: Beautiful theme aurora gradient background
      background: 'linear-gradient(135deg, #f0edf8 0%, #e8e4f0 40%, #ede8f2 100%)'
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
            background: 'linear-gradient(135deg, #9a8cc4 0%, #8e8072 100%)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(154, 140, 196, 0.3)'
          }}>
            <BrainCircuit size={24} />
          </div>
          <span className="outfit-font" style={{ fontSize: '22px', fontWeight: '800', color: '#2d2a26', letterSpacing: '-0.02em' }}>
            MindFlow
          </span>
        </div>

        {/* Hero badge */}
        <div style={{
          padding: '5px 14px',
          borderRadius: '99px',
          border: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: 'rgba(255,255,255,0.6)',
          fontSize: '11px',
          color: '#6e675f',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={11} style={{ color: '#9a8cc4' }} />
          <span>Free · No account needed · Works offline</span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1 className="outfit-font" style={{
            fontSize: 'clamp(28px, 6vw, 50px)',
            fontWeight: '800',
            lineHeight: 1.1,
            color: '#2d2a26',
            letterSpacing: '-0.03em'
          }}>
            The only focus app<br />with an Overwhelmed button
          </h1>
          {/* FIX 12: Updated emotional copy — two lines, 90% opacity */}
          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 17px)',
            color: '#6e675f',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            Built for the days when everything feels like too much.<br />
            Focus gently. Grow steadily. No pressure.
          </p>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={scrollToForm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 36px',
              fontSize: '16px',
              fontWeight: '700',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9a8cc4 0%, #8e8072 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(154, 140, 196, 0.35)',
              fontFamily: "'Outfit', sans-serif"
            }}
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
              color: '#9e978d',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px'
            }}
          >
            See How It Works
            <ChevronDown size={14} style={{ animation: 'bounceDown 2s infinite ease-in-out' }} />
          </button>
        </div>

        {/* Calm decorative UI preview */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          height: '180px',
          borderRadius: '20px',
          border: '1px solid rgba(154, 140, 196, 0.2)',
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 20px 60px rgba(154, 140, 196, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', opacity: 0.12 }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="#9a8cc4" strokeWidth="5" strokeDasharray="239" strokeDashoffset="60" strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="outfit-font" style={{ fontSize: '32px', fontWeight: '800', color: '#2d2a26', letterSpacing: '-0.03em', position: 'relative' }}>25:00</span>
          <span style={{ fontSize: '11px', color: '#9e978d', textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative' }}>Enter Focal Flow</span>
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
          color: '#2d2a26',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          What makes MindFlow different
        </h2>

        {features.map((f, i) => (
          <div
            key={i}
            style={{
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(154, 140, 196, 0.15)',
              backgroundColor: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 16px rgba(154, 140, 196, 0.1)',
              animation: `bloomPop 0.4s ${i * 0.1}s both`
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(154, 140, 196, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {f.icon}
            </div>
            <div>
              <h3 className="outfit-font" style={{ fontSize: '15px', color: '#2d2a26', fontWeight: '700', marginBottom: '6px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#6e675f', lineHeight: 1.5 }}>
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
          padding: '20px 0 80px'
        }}
      >
        {/* FIX 15: Glassmorphism card */}
        <div
          style={{
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(154, 140, 196, 0.2)',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(154, 140, 196, 0.15)',
            animation: 'bloomPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Form header */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <h2 className="outfit-font" style={{ fontSize: '22px', color: '#2d2a26', fontWeight: '800' }}>
              Create your space
            </h2>
            {/* FIX 12: Emotional copy on landing */}
            <p style={{ color: '#6e675f', fontSize: '14px', lineHeight: 1.5, maxWidth: '300px', textAlign: 'center', opacity: 0.9 }}>
              Built for the days when everything feels like too much.<br />
              <span style={{ fontWeight: '400' }}>Focus gently. Grow steadily. No pressure.</span>
            </p>
          </div>

          {/* FIX 14: Feature highlights above the form inputs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: '1px solid rgba(154, 140, 196, 0.12)',
            overflow: 'hidden',
            backgroundColor: 'rgba(154, 140, 196, 0.04)'
          }}>
            {formHighlights.map((h, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderBottom: i < formHighlights.length - 1 ? '1px solid rgba(154, 140, 196, 0.1)' : 'none'
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{h.emoji}</span>
                <span style={{ fontSize: '13px', color: '#6e675f', fontWeight: '400', lineHeight: 1.4 }}>{h.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Name input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6e675f', letterSpacing: '0.04em' }}>
                What should we call you?
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your focus nickname..."
                  required
                  maxLength={15}
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    padding: '12px 16px 12px 44px',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(154, 140, 196, 0.25)',
                    borderRadius: '10px',
                    fontSize: '15px',
                    color: '#2d2a26',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9e978d'
                  }}
                />
              </div>
            </div>

            {/* FIX 13: Focus symbol avatar selector — 6 symbols, default 🌱 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6e675f', letterSpacing: '0.04em' }}>
                Select your focus identity
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid rgba(154, 140, 196, 0.12)'
              }}>
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => { setSelectedAvatar(av); playClick(); }}
                    style={{
                      fontSize: '22px',
                      padding: '10px 0',
                      borderRadius: '10px',
                      background: selectedAvatar === av ? 'rgba(154, 140, 196, 0.15)' : 'transparent',
                      border: selectedAvatar === av ? '1px solid rgba(154, 140, 196, 0.5)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #9a8cc4 0%, #8e8072 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(154, 140, 196, 0.3)',
                fontFamily: "'Outfit', sans-serif",
                marginTop: '4px'
              }}
            >
              <Sparkles size={18} />
              Start Flowing
            </button>
          </form>

          {/* FIX 11: Remove SaaS disclaimer. Replace with clean privacy line */}
          <p style={{ fontSize: '11px', color: '#9e978d', textAlign: 'center', lineHeight: 1.5 }}>
            No account needed. Your data stays on your device. Always free to start.
          </p>
        </div>
      </section>

    </div>
  );
}
