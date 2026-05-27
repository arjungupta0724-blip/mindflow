import React, { useState } from 'react';
import { Award, Flame, CheckCircle, Hourglass, Zap, Download, Upload, Share2, MessageSquare, Send, X, Lock, RefreshCw } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * Dashboard - Displays user stats and the beautiful interactive SVG Digital Garden Plant.
 * Capped up to Level 7 for Free users, unlimited levels and species for Pro users!
 */
export default function Dashboard({ 
  xp, 
  level, 
  stats, 
  history = [], 
  setHistory, 
  streak = 0, 
  gardenCreatedAt,
  triggerProModal,
  isPro
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: "Hello! I am your MindFlow Focus Coach. I am looking at your actual stats and history. How can I help you identify one small, concrete next focus action today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});

  // Calculations
  const xpNeededForNext = 100;
  const currentXpInLevel = xp % xpNeededForNext;
  const progressPercent = Math.min((currentXpInLevel / xpNeededForNext) * 100, 100);

  const gardenDays = Math.max(1, Math.ceil((Date.now() - (gardenCreatedAt || Date.now())) / (1000 * 60 * 60 * 24)));

  // Generate plant stage names based on level
  const getLevelTitle = (lvl) => {
    if (lvl === 1) return '🌱 Mindful Seedling';
    if (lvl === 2) return '🌿 Curious Sprout';
    if (lvl === 3) return '🌸 Rising Bud';
    if (lvl === 4) return '🏵️ Golden Blossom';
    if (lvl <= 7) return '👑 Infinite Flow Tree';
    if (lvl <= 12) return '🌻 Twin Bloom Sunflower';
    if (lvl <= 20) return '🪻 Lavender Sanctuary';
    return '🦋 Butterfly Valley Spores';
  };

  // Renders beautiful multi-species SVG plant, extending beyond level 7!
  const renderSVGPlant = (lvl) => {
    const potColor = 'var(--text-muted)';
    const stemColor = 'var(--success)';
    const leafColor = '#81c784';
    
    // Background gradient shifts softly from day to sunset/dusk for Level 31+ completed sessions
    const skyBackground = (lvl >= 31) 
      ? 'linear-gradient(180deg, #2b2b40 0%, #0d0d1f 100%)' 
      : 'rgba(0,0,0,0.15)';

    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
        {/* Fix 2: Ambient environmental glow behind the plant */}
        <div style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(20px)',
          animation: 'haloBreath 5s infinite ease-in-out'
        }} />
        <svg 
          viewBox="0 0 200 200" 
          style={{ 
            width: '100%', 
            maxHeight: '280px',
            background: skyBackground,
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '8px',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Terracotta Pot */}
          <path d="M60,130 L140,130 L130,170 L70,170 Z" fill={potColor} opacity="0.8" />
          <rect x="55" y="120" width="90" height="12" rx="4" fill={potColor} />
          {/* Soil */}
          <ellipse cx="100" cy="122" rx="38" ry="6" fill="#5c4033" />

          {/* LEVEL 1: Large Seedling - clearly visible round seed + tall white sprout from dark soil */}
          {lvl === 1 && (
            <g className="plant-breathe-stage">
              {/* Dark soil mound that seed sits in */}
              <ellipse cx="100" cy="122" rx="20" ry="5" fill="#3e2a18" />
              {/* Seed body - round seed nestled in soil, clearly visible */}
              <ellipse cx="100" cy="119" rx="12" ry="10" fill="#7d5a38" />
              {/* Seed texture highlight */}
              <ellipse cx="96" cy="115" rx="4" ry="3" fill="#a07848" opacity="0.7" />
              {/* Main tall white sprout emerging from seed upward */}
              <path d="M100,109 C100,95 97,72 100,45" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.92" />
              {/* Left tiny leaf at mid-sprout height */}
              <path d="M100,80 C94,74 86,76 88,83 C93,82 98,80 100,80 Z" fill="#b8f0a0" opacity="0.85" />
              {/* Right tiny leaf at top of sprout */}
              <path d="M100,55 C106,48 116,50 114,58 C109,57 103,55 100,55 Z" fill="#c8f5b0" opacity="0.9" />
              {/* Tiny sprout tip curl */}
              <circle cx="100" cy="44" r="4" fill="#d8ffc0" opacity="0.75" />
            </g>
          )}

          {/* LEVEL 2: Simple Sprout */}
          {lvl === 2 && (
            <g className="plant-grow-stage">
              <path d="M100,120 Q95,95 105,75" stroke={stemColor} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M105,75 Q115,68 120,74 Q110,82 105,75 Z" fill={leafColor} />
              <path d="M98,90 Q85,82 82,90 Q92,94 98,90 Z" fill={leafColor} />
            </g>
          )}

          {/* LEVEL 3-4: Sprout with leaf bud */}
          {lvl >= 3 && lvl <= 4 && (
            <g className="plant-grow-stage">
              <path d="M100,120 Q90,85 100,55" stroke={stemColor} strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M98,95 Q118,85 122,70" stroke={stemColor} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M100,55 Q112,45 115,55 Z" fill={leafColor} />
              <path d="M95,78 Q80,70 78,80 Z" fill={leafColor} />
              <path d="M122,70 Q135,65 138,72 Z" fill={leafColor} />
              <circle cx="100" cy="50" r="8" fill="var(--accent-secondary)" className="bloom-pop" />
            </g>
          )}

          {/* LEVEL 5-7: Fully Blooming Sunflower tree */}
          {lvl >= 5 && lvl <= 7 && (
            <g className="plant-grow-stage">
              <path d="M100,120 Q105,75 95,45" stroke={stemColor} strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M102,85 Q125,75 130,55" stroke={stemColor} strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M98,95 Q75,85 70,65" stroke={stemColor} strokeWidth="4" fill="none" strokeLinecap="round" />
              
              <path d="M95,45 Q108,35 110,45 Z" fill={leafColor} />
              <path d="M130,55 Q145,50 142,60 Z" fill={leafColor} />
              
              <g transform="translate(95, 40)" className="bloom-pop">
                <circle cx="0" cy="-10" r="10" fill="var(--accent-secondary)" />
                <circle cx="-10" cy="0" r="10" fill="var(--accent-secondary)" />
                <circle cx="10" cy="0" r="10" fill="var(--accent-secondary)" />
                <circle cx="0" cy="10" r="10" fill="var(--accent-secondary)" />
                <circle cx="0" cy="0" r="8" fill="var(--warning)" />
              </g>
            </g>
          )}

          {/* LEVEL 8-12: Pro Expansion - Sunflower Twin Bloom! */}
          {lvl >= 8 && lvl <= 12 && (
            <g className="plant-grow-stage">
              <path d="M100,120 Q105,75 95,45" stroke={stemColor} strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M102,85 Q125,75 130,55" stroke={stemColor} strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M98,95 Q75,85 70,65" stroke={stemColor} strokeWidth="4" fill="none" strokeLinecap="round" />
              
              <g transform="translate(95, 40)" className="bloom-pop">
                <circle cx="0" cy="-10" r="9" fill="var(--accent-secondary)" />
                <circle cx="-9" cy="0" r="9" fill="var(--accent-secondary)" />
                <circle cx="9" cy="0" r="9" fill="var(--accent-secondary)" />
                <circle cx="0" cy="9" r="9" fill="var(--accent-secondary)" />
                <circle cx="0" cy="0" r="7" fill="var(--warning)" />
              </g>
              {/* Second Bloom! */}
              <g transform="translate(130, 55)" className="bloom-pop">
                <circle cx="0" cy="-6" r="6" fill="#ff70a6" />
                <circle cx="-6" cy="0" r="6" fill="#ff70a6" />
                <circle cx="6" cy="0" r="6" fill="#ff70a6" />
                <circle cx="0" cy="6" r="6" fill="#ff70a6" />
                <circle cx="0" cy="0" r="5" fill="var(--warning)" />
              </g>
            </g>
          )}

          {/* LEVEL 13-20: Pro Expansion - Sunflower + Lavender species! */}
          {lvl >= 13 && lvl <= 20 && (
            <g className="plant-grow-stage">
              {/* Main sunflower */}
              <path d="M100,120 Q105,75 95,45" stroke={stemColor} strokeWidth="6" fill="none" strokeLinecap="round" />
              <g transform="translate(95, 40)" className="bloom-pop">
                <circle cx="0" cy="-8" r="8" fill="var(--accent-secondary)" />
                <circle cx="-8" cy="0" r="8" fill="var(--accent-secondary)" />
                <circle cx="8" cy="0" r="8" fill="var(--accent-secondary)" />
                <circle cx="0" cy="0" r="6" fill="var(--warning)" />
              </g>

              {/* Second Lavender Stem & blooms */}
              <path d="M80,120 Q65,95 70,75" stroke="#7e57c2" strokeWidth="4" fill="none" strokeLinecap="round" />
              <g transform="translate(70, 75)" fill="#b39ddb">
                <ellipse cx="0" cy="-14" rx="4" ry="7" />
                <ellipse cx="0" cy="-7" rx="5" ry="6" />
                <ellipse cx="-4" cy="0" rx="4" ry="4" />
                <ellipse cx="4" cy="0" rx="4" ry="4" />
                <ellipse cx="0" cy="7" rx="6" ry="5" />
              </g>
            </g>
          )}

          {/* LEVEL 21+: Pro Expansion - SVG Wiggling Butterfly! */}
          {lvl >= 21 && (
            <g className="plant-grow-stage">
              <path d="M100,120 Q105,75 95,45" stroke={stemColor} strokeWidth="6" fill="none" strokeLinecap="round" />
              <g transform="translate(95, 40)" className="bloom-pop">
                <circle cx="0" cy="-8" r="8" fill="var(--accent-secondary)" />
                <circle cx="-8" cy="0" r="8" fill="var(--accent-secondary)" />
                <circle cx="8" cy="0" r="8" fill="var(--accent-secondary)" />
                <circle cx="0" cy="0" r="6" fill="var(--warning)" />
              </g>

              <path d="M80,120 Q65,95 70,75" stroke="#7e57c2" strokeWidth="4" fill="none" strokeLinecap="round" />
              <g transform="translate(70, 75)" fill="#b39ddb">
                <ellipse cx="0" cy="-14" rx="4" ry="7" />
                <ellipse cx="0" cy="-7" rx="5" ry="6" />
              </g>

              {/* Butterfly landing periodically! */}
              <g transform="translate(130, 45)" style={{ transformOrigin: 'center' }}>
                <path d="M0,0 C-6,-6 -12,0 0,6 C12,0 6,-6 0,0" fill="#e040fb" />
                <circle cx="0" cy="3" r="1" fill="#fff" />
              </g>
            </g>
          )}
        </svg>
      </div>
    );
  };

  // JSON Export handler (Backup My Progress)
  const handleBackup = () => {
    playClick();
    const dataDump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('mindflow_')) {
        dataDump[key] = localStorage.getItem(key);
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataDump));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `mindflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    playSuccess();
  };

  // JSON Import handler (Restore from Backup)
  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.keys(data).forEach((key) => {
          if (key.startsWith('mindflow_')) {
            localStorage.setItem(key, data[key]);
          }
        });
        playSuccess();
        alert('Mindflow restore complete! Hydrating workspace...');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // HTML5 Canvas Card share PNG downloader
  const handleCanvasShare = () => {
    playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Drawing obsidian container backdrop
    ctx.fillStyle = '#0f0f15';
    ctx.fillRect(0, 0, 600, 400);

    ctx.strokeStyle = 'rgba(79, 172, 254, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 576, 376);

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("My MindFlow Garden 🌱", 40, 60);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = "14px sans-serif";
    ctx.fillText("Growing one focus session at a time.", 40, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`Rank: ${getLevelTitle(level)}`, 40, 160);
    ctx.fillText(`Current Streak: ${streak} Days 🔥`, 40, 200);
    ctx.fillText(`Focus Age: ${gardenDays} Days Alive`, 40, 240);
    ctx.fillText(`Total completed sessions: ${stats.focusCompleted}`, 40, 280);

    // Render simple potted plant graphics
    ctx.fillStyle = '#81c784';
    ctx.fillRect(450, 180, 6, 120);
    ctx.fillStyle = '#e040fb';
    ctx.beginPath();
    ctx.arc(453, 170, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4e4e5e';
    ctx.fillRect(415, 300, 80, 50);

    ctx.fillStyle = 'rgba(79, 172, 254, 0.6)';
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("MINDFLOW APP • LOCAL-FIRST PRODUCTIVITY", 40, 350);

    const link = document.createElement('a');
    link.download = `mindflow-garden-level${level}.png`;
    link.href = canvas.toDataURL();
    link.click();
    playSuccess();
  };

  // Coaching Response Simulator
  const handleSendCoach = () => {
    if (!chatInput.trim()) return;
    if (!isPro) {
      triggerProModal("ADHD Focus Coaching");
      return;
    }
    playClick();
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Generate smart contextual response using user stats from localStorage!
    setTimeout(() => {
      let reply = '';
      if (stats.focusCompleted === 0) {
        reply = "I see your seedling garden has just started today! Let's get our hands warm by doing one short 10-minute focus session right now.";
      } else {
        reply = `You are doing wonderfully! With a ${streak}-day focus streak and Level ${level} rank, your sunflower is wiggling beautifully. What is one small, bite-sized step you can check off on your Kanban Tasks board next?`;
      }
      setChatMessages((prev) => [...prev, { sender: 'coach', text: reply }]);
      playSuccess();
    }, 1000);
  };

  const getWeeklyHours = () => {
    const totalMin = history.reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0);
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs} hrs ${mins} min focused.`;
  };

  const getPast7DaysData = () => {
    const days = [];
    const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStringLocale = d.toLocaleDateString();
      const dayLabel = dayLabels[d.getDay()];
      
      const totalMinutes = history
        .filter(item => item.date === dateStringLocale)
        .reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0);
        
      days.push({
        label: dayLabel,
        minutes: totalMinutes,
        dateStr: dateStringLocale
      });
    }
    return days;
  };

  const renderWeeklyChart = () => {
    const data = getPast7DaysData();
    const maxVal = Math.max(...data.map(d => d.minutes), 0);
    
    return (
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <h4 className="outfit-font" style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📊 Weekly Focus Patterns (Past 7 Days)
        </h4>
        <div style={{ width: '100%' }}>
          <svg viewBox="0 0 400 180" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {data.map((day, idx) => {
              const y = idx * 24 + 10;
              const barHeight = 12;
              const maxBarWidth = 300;
              
              let barWidth = 0;
              if (maxVal > 0) {
                barWidth = (day.minutes / maxVal) * maxBarWidth;
              }
              const finalBarWidth = barWidth > 0 ? barWidth : maxBarWidth * 0.04;
              const barColor = barWidth > 0 ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)';
              
              return (
                <g key={idx}>
                  <text 
                    x="10" 
                    y={y + 10} 
                    fill="var(--text-secondary)" 
                    fontSize="11" 
                    fontWeight="700" 
                    fontFamily="inherit"
                  >
                    {day.label}
                  </text>
                  
                  <rect 
                    x="40" 
                    y={y} 
                    width={maxBarWidth} 
                    height={barHeight} 
                    rx="4" 
                    fill="rgba(0, 0, 0, 0.2)" 
                  />
                  
                  <rect 
                    x="40" 
                    y={y} 
                    width={finalBarWidth} 
                    height={barHeight} 
                    rx="4" 
                    fill={barColor}
                    style={{ transition: 'width 0.6s ease' }}
                  />
                  
                  <text 
                    x={40 + maxBarWidth + 10} 
                    y={y + 10} 
                    fill={barWidth > 0 ? 'var(--text-primary)' : 'var(--text-muted)'} 
                    fontSize="10" 
                    fontWeight="600" 
                    fontFamily="inherit"
                  >
                    {day.minutes}m
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const visibleHistory = isPro ? history : history.slice(0, 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HUD ranks card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Seedling Garden Rank
            </span>
            <h2 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '2px' }}>
              {getLevelTitle(level)}
            </h2>
          </div>
          
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 14px', 
              borderRadius: '99px', 
              backgroundColor: 'rgba(79, 172, 254, 0.1)', 
              border: '1px solid var(--accent)',
              color: 'var(--accent)'
            }}
          >
            <Award size={16} />
            <span className="outfit-font" style={{ fontWeight: '700', fontSize: '14px' }}>LVL {level}</span>
          </div>
        </div>

        {/* Level XP Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Energy to Next Level</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currentXpInLevel} / {xpNeededForNext} XP</span>
          </div>
          <div style={{ height: '10px', width: '100%', backgroundColor: 'var(--xp-bar-bg)', borderRadius: '99px', overflow: 'hidden', padding: '1px' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--xp-fill)', borderRadius: '99px', transition: 'width 0.6s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>Garden Age: {gardenDays} Days Alive</span>
            <span>Total: {xp} XP</span>
          </div>
        </div>
      </div>

      {/* SVG Garden Displays */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <h3 className="outfit-font" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
          Your MindFlow Greenhouse
        </h3>
        
        {renderSVGPlant(level)}

        {/* FIX 19: Locked ghost preview of next growth stage */}
        <div style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '4px'
        }}>
          {/* Ghost silhouette - simplified next stage shape */}
          <div style={{
            width: '48px',
            height: '48px',
            position: 'relative',
            flexShrink: 0,
            opacity: 0.2
          }}>
            <svg viewBox="0 0 48 48" width="48" height="48">
              {/* Generic next-stage plant silhouette */}
              <rect x="22" y="36" width="4" height="10" rx="2" fill="var(--accent)" />
              <path d="M24,36 C24,28 18,22 24,14 C30,22 24,28 24,36 Z" fill="var(--accent)" />
              <path d="M24,24 C24,24 14,20 16,28 C20,26 24,24 24,24 Z" fill="var(--accent)" />
              <path d="M24,20 C24,20 32,16 34,24 C30,22 24,20 24,20 Z" fill="var(--accent)" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <Lock size={10} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
                Next Stage Locked
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Level {level + 1} — Keep growing to unlock this
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
          <button 
            onClick={handleCanvasShare}
            className="sensory-button-secondary"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
          >
            <Share2 size={13} />
            Share My Garden Card
          </button>
        </div>
      </div>

      {/* Focus counters & Daily Streaks — Fix 10: Big numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div className="glass-panel slide-up-2" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '28px' }}>🔥</span>
          <span className="outfit-font" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{streak}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Day Streak</span>
        </div>
        
        <div className="glass-panel slide-up-3" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '28px' }}>📚</span>
          <span className="outfit-font" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{stats.focusCompleted}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Sessions Done</span>
        </div>

        <div className="glass-panel slide-up-4" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: '28px' }}>🧹</span>
          <span className="outfit-font" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{stats.tasksCompleted}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Thoughts Cleared</span>
        </div>
      </div>

      {/* Backup & Restore systems */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <h4 className="outfit-font" style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          💾 Workspace Backups
        </h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleBackup}
            className="sensory-button-secondary"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', flex: 1 }}
          >
            <Download size={13} />
            Backup My Progress
          </button>
          
          <label 
            className="sensory-button-secondary"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', flex: 1, cursor: 'pointer', justifyContent: 'center' }}
          >
            <Upload size={13} />
            <span>Restore from Backup</span>
            <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
          </label>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          *Your data lives on your device. Back it up.
        </span>
      </div>

      {/* SVG Chart */}
      {renderWeeklyChart()}

      {/* Session History Log */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="outfit-font" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Focus History</h3>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700' }}>This week: {getWeeklyHours()}</span>
        </div>

        {visibleHistory.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No completed focus blocks registered yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {visibleHistory.map((sess) => (
              <div 
                key={sess.id} 
                className="glass-panel"
                style={{ 
                  padding: '12px', 
                  borderRadius: '10px', 
                  backgroundColor: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>📅 {sess.date}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px' }}>{sess.mood}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: '700' }}>+{sess.xp} XP</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Target duration: {sess.duration} Min</span>
                  {sess.note && (
                    <button 
                      onClick={() => setExpandedNotes(prev => ({ ...prev, [sess.id]: !prev[sess.id] }))}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '10px' }}
                    >
                      {expandedNotes[sess.id] ? 'Hide Note' : 'View Note'}
                    </button>
                  )}
                </div>
                {sess.note && expandedNotes[sess.id] && (
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '2px', fontStyle: 'italic' }}>
                    Accomplished: "{sess.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button 
            onClick={() => { playClick(); setHistory([]); }}
            className="sensory-button-secondary"
            style={{ width: '100%', border: 'none', color: 'rgba(255,60,60,0.7)', fontSize: '11px' }}
          >
            Clear History Log
          </button>
        )}
      </div>

      {/* Built-in ADHD Coach Button & Gated Chat takeover */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 className="outfit-font" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            🧠 ADHD Focus Coach {!isPro && <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
          </h4>
          <button 
            onClick={() => {
              if (!isPro) {
                triggerProModal("Talk to your AI Focus Coach");
              } else {
                setChatOpen(true);
                playClick();
              }
            }} 
            className="sensory-button" 
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Talk to Coach
          </button>
        </div>
      </div>

      {/* Coach Chat Takeover Modal */}
      {chatOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(30px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🧘</span>
                <h3 className="outfit-font" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>ADHD Focus Coach</h3>
              </div>
              <button onClick={() => setChatOpen(false)} className="sensory-button-secondary" style={{ padding: '6px' }}><X size={14} /></button>
            </div>

            {/* Message Thread */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'user' ? 'rgba(79, 172, 254, 0.12)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--panel-border)',
                    fontSize: '12.5px',
                    color: 'var(--text-primary)',
                    textAlign: 'left'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text"
                className="sensory-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCoach()}
                placeholder="Ask your coach anything..."
                style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '10px' }}
              />
              <button onClick={handleSendCoach} className="sensory-button" style={{ padding: '10px 14px' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
