import React, { useRef } from 'react';
import { Palette, Check, Upload, X, Lock } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * ThemeSelector - Dynamic Workspace Theme & Wallpaper Dashboard.
 * Supports 4 Mindset Themes: Beautiful, Thoughtful, Mindful, Deep Work.
 * Integrates direct ref triggers for base64 wallpaper file loaders.
 */
export default function ThemeSelector({ 
  activeTheme, 
  setTheme, 
  customBg, 
  setCustomBg,
  fontSize = 'default',
  setFontSize,
  customAffirmations = '',
  setCustomAffirmations,
  useCustomAffirmations = false,
  setUseCustomAffirmations,
  isPro = false,
  triggerProModal,
  useAutoTheme = false,
  setUseAutoTheme,
  themeSchedule = {},
  setThemeSchedule
}) {
  const fileInputRef = useRef(null);

  const themes = [
    {
      id: 'theme-beautiful',
      name: 'Beautiful 🌸',
      desc: 'Dreamy pastel aurora',
      colors: ['#9a8cc4', '#00f2fe', '#17112c']
    },
    {
      id: 'theme-thoughtful',
      name: 'Thoughtful 🪵',
      desc: 'Cozy amber sepia & wood',
      colors: ['#dfaf70', '#d4af37', '#1e1610']
    },
    {
      id: 'theme-mindful',
      name: 'Mindful 🍃',
      desc: 'Calming misty sage forest',
      colors: ['#81c784', '#a5d6a7', '#0f1813']
    },
    {
      id: 'theme-deepwork',
      name: 'Deep Work 🖤',
      desc: 'Visually silent obsidian',
      colors: ['#1e1e24', '#0d0d0f', '#060608']
    }
  ];

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    playClick();
  };

  const handleTriggerUpload = () => {
    if (!isPro) {
      if (triggerProModal) {
        triggerProModal("Custom Wallpaper Upload");
      } else {
        alert("🚨 Custom wallpaper upload is a Pro feature.");
      }
      return;
    }
    // Robust cross-platform direct input click trigger
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    playClick();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Elevated file size limit to 6.5MB to support standard smartphone camera shots!
      if (file.size > 6500000) {
        alert("🚨 Please choose a wallpaper image under 6MB so it fits smoothly in local trial memory! In the production cloud build, this will be unlimited.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setCustomBg(base64Url);
        playSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setCustomBg('');
    playClick();
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Palette size={18} style={{ color: 'var(--accent)' }} />
        <h3 className="outfit-font" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
          Workspace Themes
        </h3>
      </div>

      {/* Grid of Themes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {themes.map((t) => {
          const isActive = activeTheme === t.id && !customBg;
          return (
            <div
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className="tactile-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.1)',
                borderColor: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.03)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {t.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {t.desc}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {t.colors.map((c, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: c,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }} 
                    />
                  ))}
                </div>
                {isActive && (
                  <Check size={14} style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 3px var(--accent))' }} />
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Personalized Wallpaper Panel */}
      <div style={{ marginTop: '4px', borderTop: '1px dashed var(--panel-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Personalized Wallpaper {!isPro && <Lock size={10} style={{ color: 'var(--text-muted)' }} />}
        </span>

        {customBg ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '10px', border: '1px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src={customBg} 
                alt="Wallpaper thumbnail" 
                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
              />
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>Wallpaper Active</span>
            </div>
            <button 
              className="sensory-button-secondary" 
              onClick={handleClearImage}
              style={{ padding: '6px 8px', color: 'rgba(255,0,0,0.7)', border: 'none', backgroundColor: 'transparent' }}
              title="Remove wallpaper"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <button 
              type="button"
              className="sensory-button-secondary" 
              onClick={handleTriggerUpload}
              style={{ 
                display: 'flex', 
                gap: '8px', 
                fontSize: '12px', 
                padding: '10px 12px', 
                width: '100%',
                justifyContent: 'center',
                borderStyle: 'dashed',
                position: 'relative'
              }}
            >
              <Upload size={14} style={{ color: 'var(--accent)' }} />
              Upload a photo from your gallery
              {!isPro && <Lock size={12} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />}
            </button>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3', textAlign: 'center', display: 'block' }}>
              Supports JPG and PNG images up to 6MB.
            </span>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
          </div>
        )}
      </div>

      {/* Accessibility Font Size Toggle */}
      <div style={{ marginTop: '4px', borderTop: '1px dashed var(--panel-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Accessibility Font Scaling
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['small', 'default', 'large'].map((size) => {
            const label = size.charAt(0).toUpperCase() + size.slice(1);
            const isActive = fontSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setFontSize(size);
                  playClick();
                }}
                className={isActive ? 'sensory-button' : 'sensory-button-secondary'}
                style={{
                  flex: 1,
                  fontSize: '12px',
                  padding: '8px',
                  textAlign: 'center',
                  border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          Scales the entire application text layout to optimize readability.
        </span>
      </div>

      {/* Custom Affirmations Section */}
      <div style={{ marginTop: '4px', borderTop: '1px dashed var(--panel-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            My Affirmations
          </span>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={useCustomAffirmations} 
              onChange={(e) => {
                setUseCustomAffirmations(e.target.checked);
                playClick();
              }}
              style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
            />
            <span style={{ fontWeight: '500' }}>Use My Affirmations</span>
          </label>
        </div>

        <textarea
          value={customAffirmations}
          onChange={(e) => setCustomAffirmations(e.target.value)}
          placeholder={`Focus on the breath.\nOne step at a time.\nI am doing enough.`}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '8px 10px',
            fontSize: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            color: 'var(--text-primary)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.4'
          }}
        />
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          Type your personal affirmation lines, one per line. They will rotate every 10 seconds during your focus session.
        </span>
      </div>

      {/* Auto-Theme Scheduler */}
      <div style={{ marginTop: '4px', borderTop: '1px dashed var(--panel-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Auto-Theme Schedule
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={useAutoTheme} 
              onChange={(e) => {
                setUseAutoTheme(e.target.checked);
                playClick();
              }}
              style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
            />
            <span style={{ fontWeight: '500' }}>Let MindFlow match your day</span>
          </label>
        </div>

        {useAutoTheme && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
            {[
              { slot: 'morning', label: 'Morning (6am–12pm)', value: themeSchedule.morning || 'theme-beautiful' },
              { slot: 'afternoon', label: 'Afternoon (12pm–5pm)', value: themeSchedule.afternoon || 'theme-mindful' },
              { slot: 'evening', label: 'Evening (5pm–9pm)', value: themeSchedule.evening || 'theme-thoughtful' },
              { slot: 'night', label: 'Night (9pm–6am)', value: themeSchedule.night || 'theme-deepwork' }
            ].map((slotItem) => (
              <div key={slotItem.slot} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{slotItem.label}</span>
                <select
                  value={slotItem.value}
                  onChange={(e) => {
                    setThemeSchedule(prev => ({ ...prev, [slotItem.slot]: e.target.value }));
                    playClick();
                  }}
                  style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="theme-beautiful">Beautiful 🌸</option>
                  <option value="theme-thoughtful">Thoughtful 🪵</option>
                  <option value="theme-mindful">Mindful 🍃</option>
                  <option value="theme-deepwork">Deep Work 🖤</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
