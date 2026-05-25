import React, { useState } from 'react';
import { Sparkles, BrainCircuit, User, ShieldAlert } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * WelcomePortal - Simulated Sign-in/Signup portal.
 * Designed for frictionless local profile creation with Supabase/Firebase backend readiness hooks.
 */
export default function WelcomePortal({ onSignIn }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  
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

  return (
    <div 
      className="glass-panel" 
      style={{ 
        maxWidth: '480px', 
        margin: '60px auto', 
        padding: '36px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        animation: 'bloomPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
      }}
    >
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          padding: '12px', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
          color: '#fff',
          boxShadow: 'var(--accent-glow)',
          width: 'fit-content'
        }}>
          <BrainCircuit size={32} />
        </div>
        <h2 className="outfit-font" style={{ fontSize: '32px', color: 'var(--text-primary)', marginTop: '8px' }}>
          MindFlow
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.4, maxWidth: '300px' }}>
          Your sensory-friendly, gamified focus workspace. Water your digital garden and offload distraction.
        </p>
      </div>

      {/* Form */}
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

      {/* Cloud DB Notice Footer */}
      <div 
        style={{ 
          marginTop: '12px', 
          padding: '12px', 
          backgroundColor: 'rgba(0,0,0,0.15)', 
          borderRadius: '10px', 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'flex-start' 
        }}
      >
        <ShieldAlert size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          <strong>SaaS Architecture Ready:</strong> Currently in local trial mode. All profile data is saved locally on your device. We can instantly hook this up to Firebase, Supabase, or clerk.com for production database synchronization.
        </p>
      </div>

    </div>
  );
}
