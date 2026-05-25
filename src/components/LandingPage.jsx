import React from 'react';
import { Sparkles, Play, ShieldAlert, Heart, Volume2, Sprout } from 'lucide-react';
import { playClick } from './SoundSynthesizer';

/**
 * LandingPage - Fully responsive pre-app welcome presentation page.
 * Styled with a gorgeous, dark matte Obsidian slate design.
 */
export default function LandingPage({ onStart }) {
  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0c0c12',
        color: '#f3f4f6',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px',
        overflowX: 'hidden'
      }}
      className="theme-deepwork"
    >
      {/* Header / Nav Bar */}
      <header 
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '40px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌊</span>
          <h1 className="outfit-font" style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
            MindFlow
          </h1>
        </div>
        <button 
          onClick={() => { playClick(); onStart(); }}
          className="sensory-button"
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          Open App
        </button>
      </header>

      {/* Main Container */}
      <main style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '64px', textAlign: 'center' }}>
        
        {/* Section 1: Hero Block */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative' }}>
          <div style={{ padding: '6px 14px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
            <span>Introducing MindFlow 3.0</span>
          </div>

          <h2 className="outfit-font" style={{ fontSize: 'clamp(32px, 6.5vw, 54px)', fontWeight: '800', lineHeight: 1.15, color: '#fff', maxWidth: '750px', letterSpacing: '-0.03em' }}>
            Focus without the noise.<br />Grow without the pressure.
          </h2>

          <p style={{ fontSize: 'clamp(14px, 4vw, 17px)', color: 'rgba(255,255,255,0.6)', maxWidth: '580px', lineHeight: 1.6 }}>
            A gorgeous, tactile sensory workspace designed to protect neurodivergent minds from cognitive burnout. Flow with gamified timers, plant growth, and programmatically synthesized ambient environments.
          </p>

          <button 
            onClick={() => { playClick(); onStart(); }}
            className="sensory-button"
            style={{ padding: '16px 36px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', marginTop: '12px' }}
          >
            Start Free — No Account Needed
          </button>

          {/* Frosted App Preview Screenshot Placeholder */}
          <div 
            style={{ 
              width: '100%', 
              height: '240px', 
              borderRadius: '20px', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '40px',
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ position: 'absolute', inset: '20px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Sprout size={32} style={{ color: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>MindFlow Zen Workspace Frame</span>
            </div>
            {/* Matte Backdrop overlay blur */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.1)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </section>

        {/* Section 2: Three Feature Highlight Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' }}>
          {[
            {
              icon: <ShieldAlert size={20} style={{ color: 'var(--accent)' }} />,
              title: 'Distraction-Free Focus',
              desc: 'Our dynamic "Focal Flow" takeover instantly hides all sidebar menus and sliders the second your timer starts, leaving only a giant clock and a custom motivation line.'
            },
            {
              icon: <Volume2 size={20} style={{ color: '#4caf50' }} />,
              title: '14 Synthesized Soundscapes',
              desc: 'From cozy campfires to ticking clocks, explore programmatically generated nature soundscapes built on native Web Audio nodes with zero network load or latency.'
            },
            {
              icon: <Sprout size={20} style={{ color: '#ffb300' }} />,
              title: 'A Garden That Grows With You',
              desc: 'Gamify your dopamine cycles. Spend minutes focused to earn Experience Points (XP) and watch your wiggling SVG sunflower seedling grow through 5 organic life stages.'
            }
          ].map((card, idx) => (
            <div 
              key={idx}
              className="glass-panel"
              style={{
                padding: '28px 24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.015)'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <h3 className="outfit-font" style={{ fontSize: '16px', color: '#fff', fontWeight: '700' }}>{card.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{card.desc}</p>
            </div>
          ))}
        </section>

        {/* Section 3: Frosted Testimonial Block */}
        <section 
          className="glass-panel"
          style={{
            width: '100%',
            padding: '32px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '24px', color: 'var(--accent)', opacity: 0.6 }}>"</span>
          <p className="outfit-font" style={{ fontSize: '16px', fontStyle: 'italic', lineHeight: 1.5, color: '#e5e7eb', maxWidth: '650px', margin: '0 auto' }}>
            MindFlow transformed my study routine. There are no lists judging me, no glowing notifications, just a beautiful, quiet dark slate pot wiggling as I concentrate.
          </p>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '8px' }}>
            - An ADHD Focused Member
          </span>
        </section>

        {/* Section 4: Final CTA */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '80px' }}>
          <h3 className="outfit-font" style={{ fontSize: '24px', color: '#fff', fontWeight: '800' }}>
            Your mind deserves a calmer workspace.
          </h3>
          <button 
            onClick={() => { playClick(); onStart(); }}
            className="sensory-button"
            style={{ padding: '16px 40px', fontSize: '16px', fontWeight: '700' }}
          >
            Start Free
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer 
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.3)',
          marginTop: 'auto',
          gap: '4px'
        }}
      >
        <span>Created with love for high-efficiency workspaces</span>
        <Heart size={10} style={{ color: 'var(--accent)' }} />
      </footer>
    </div>
  );
}
