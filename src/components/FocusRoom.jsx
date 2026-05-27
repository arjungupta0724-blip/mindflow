import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Coffee, EyeOff, Eye, Clock, Wind, Moon, CheckCircle, Flame } from 'lucide-react';
import { playClick, playSuccess, playSingingBowl, setAmbientNoise } from './SoundSynthesizer';
import Affirmations from './Affirmations';
import Ably from 'ably';

const soundCategories = [
  {
    name: '🔒 Focus Shields',
    sounds: [
      { type: 'white', label: '⚪ Focal White' },
      { type: 'brown', label: '🟤 Earth Brown' },
      { type: 'cafe', label: '☕ Cozy Cafe' },
      { type: 'train', label: '🚂 Rolling Train' }
    ]
  },
  {
    name: '🌿 Nature Whispers',
    sounds: [
      { type: 'waves', label: '🌊 Ocean Waves' },
      { type: 'rain', label: '🌧️ Forest Rain' },
      { type: 'campfire', label: '🔥 Cozy Campfire' },
      { type: 'stream', label: '💧 Woodland Stream' },
      { type: 'wind', label: '🌾 Whispering Wind' },
      { type: 'crickets', label: '🦗 Summer Crickets' }
    ]
  },
  {
    name: '🧘 Inner Sanctuary',
    sounds: [
      { type: 'drone', label: '🕉️ Zen Drone' },
      { type: 'bowls', label: '🥣 Singing Bowls' },
      { type: 'aurora', label: '✨ Celestial Chimes' },
      { type: 'heartbeat', label: '💓 Warm Heartbeat' }
    ]
  }
];

/**
 * FocusRoom - Immersive Giant Focus Clock & Zen Meditation Room.
 * Enhanced with presets, mood check-ins, break overlays, and multi-track mixers.
 */
export default function FocusRoom({ 
  addXp, 
  mode, 
  timerRunning, 
  setTimerRunning,
  lastDuration,
  setLastDuration,
  dailyIntention,
  logSessionComplete,
  useCustomAffirmations,
  customAffirmations,
  triggerProModal,
  isPro
}) {
  // Timer States
  const [sessionTime, setSessionTime] = useState(lastDuration || 25);
  const [timeLeft, setTimeLeft] = useState((lastDuration || 25) * 60);

  // Ably Real-time Anonymous Co-working Presence
  const [presenceCount, setPresenceCount] = useState(0);
  const [ablyConnected, setAblyConnected] = useState(false);
  const ablyClientRef = useRef(null);
  const ablyChannelRef = useRef(null);

  useEffect(() => {
    let client = null;
    let channel = null;
    try {
      client = new Ably.Realtime({
        key: 'RjUi5g.dm-t3A:4tBd5n-3RgndmwUthvMj2LFkEfg1MAIp2drGTopEp1k',
        clientId: 'user_' + Math.random().toString(36).substring(2, 9)
      });
      ablyClientRef.current = client;

      if (client.connection.state === 'connected') {
        setAblyConnected(true);
      }

      client.connection.on('connected', () => {
        setAblyConnected(true);
      });
      client.connection.on('failed', () => {
        setAblyConnected(false);
      });
      client.connection.on('disconnected', () => {
        setAblyConnected(false);
      });

      channel = client.channels.get('mindflow-focus');
      ablyChannelRef.current = channel;

      channel.presence.subscribe(() => {
        channel.presence.get()
          .then((members) => {
            if (members) setPresenceCount(members.length);
          })
          .catch((err) => console.warn("Presence update fetch error:", err));
      });

      channel.presence.get()
        .then((members) => {
          if (members) setPresenceCount(members.length);
        })
        .catch((err) => console.warn("Initial presence fetch error:", err));
    } catch (e) {
      console.warn("Presence connection failed:", e);
      setAblyConnected(false);
    }

    return () => {
      try {
        if (channel) {
          channel.presence.unsubscribe();
        }
        if (client) {
          client.close();
        }
      } catch (err) {
        // Silently swallow cleanup errors
      }
    };
  }, []);

  useEffect(() => {
    const channel = ablyChannelRef.current;
    if (channel && ablyConnected) {
      if (timerRunning) {
        channel.presence.enter('focusing')
          .then(() => channel.presence.get())
          .then((members) => {
            if (members) setPresenceCount(members.length);
          })
          .catch((err) => console.warn("Error entering presence:", err));
      } else {
        channel.presence.leave()
          .then(() => channel.presence.get())
          .then((members) => {
            if (members) setPresenceCount(members.length);
          })
          .catch((err) => console.warn("Error leaving presence:", err));
      }
    }
  }, [timerRunning, ablyConnected]);

  // Multi-Track Mixing States
  const [activeSounds, setActiveSounds] = useState([]);
  const [soundVolumes, setSoundVolumes] = useState({
    white: 0.4, brown: 0.4, cafe: 0.4, train: 0.4,
    waves: 0.4, rain: 0.4, campfire: 0.4, stream: 0.4,
    wind: 0.4, crickets: 0.4, drone: 0.4, bowls: 0.4,
    aurora: 0.4, heartbeat: 0.4
  });
  const [masterVolume, setMasterVolume] = useState(0.4);

  // Mood Check-in States
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [activeMood, setActiveMood] = useState('😐');
  const [moodTimer, setMoodTimer] = useState(null);

  // Interstitial Break & Journaling States
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60);
  const [breakActive, setBreakActive] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalNote, setJournalNote] = useState('');

  // Box-Breathing Meditation States
  const [breathState, setBreathState] = useState('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathsCompleted, setBreathsCompleted] = useState(0);

  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const meditationRef = useRef(null);
  const breakRef = useRef(null);

  // Total seconds in the current focus block
  const totalSeconds = sessionTime * 60;
  const strokeDash = 879.64;
  const strokeOffset = totalSeconds > 0 
    ? strokeDash - (timeLeft / totalSeconds) * strokeDash 
    : strokeDash;

  // Handle Multi-Track Audio Volume Syncing
  useEffect(() => {
    activeSounds.forEach((type) => {
      const vol = (soundVolumes[type] || 0.4) * masterVolume;
      setAmbientNoise(type, vol);
    });

    soundCategories.forEach((cat) => {
      cat.sounds.forEach((snd) => {
        if (!activeSounds.includes(snd.type)) {
          setAmbientNoise(snd.type, 0);
        }
      });
    });
  }, [activeSounds, soundVolumes, masterVolume]);

  // Handle study countdown timer
  useEffect(() => {
    if (timerRunning && mode !== 'meditate') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playSuccess();
            // Transition to Break Overlay
            setShowBreakOverlay(true);
            return 0;
          }

          secondsRef.current += 1;
          if (secondsRef.current >= 60) {
            addXp(1); // +1 XP per active minute
            playClick();
            secondsRef.current = 0;
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timerRunning, addXp, mode, setTimerRunning, sessionTime]);

  // Handle Break Timer Countdown
  useEffect(() => {
    if (breakActive && showBreakOverlay) {
      breakRef.current = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(breakRef.current);
            setBreakActive(false);
            playSuccess();
            // Transition to Micro Journal
            setShowBreakOverlay(false);
            setShowJournalPrompt(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(breakRef.current);
    }
    return () => clearInterval(breakRef.current);
  }, [breakActive, showBreakOverlay]);

  // Listen to keyboard shortcut master mute event
  useEffect(() => {
    const handleMuteEvent = () => {
      setActiveSounds([]);
    };
    window.addEventListener('mindflow-toggle-mute', handleMuteEvent);
    return () => window.removeEventListener('mindflow-toggle-mute', handleMuteEvent);
  }, []);

  // Handle Box-Breathing Meditation state machine
  useEffect(() => {
    if (timerRunning && mode === 'meditate') {
      if (breathSeconds === 4 && breathState === 'inhale' && breathsCompleted === 0) {
        playSingingBowl();
      }

      meditationRef.current = setInterval(() => {
        setBreathSeconds((prevSec) => {
          if (prevSec <= 1) {
            let nextState = 'inhale';
            if (breathState === 'inhale') nextState = 'hold1';
            else if (breathState === 'hold1') nextState = 'exhale';
            else if (breathState === 'exhale') nextState = 'hold2';
            else if (breathState === 'hold2') {
              nextState = 'inhale';
              setBreathsCompleted(prev => {
                const count = prev + 1;
                addXp(2, "Breathing cycle completed! 🧘"); 
                return count;
              });
            }

            setBreathState(nextState);
            playSingingBowl(); 
            return 4;
          }
          return prevSec - 1;
        });
      }, 1000);
    } else {
      clearInterval(meditationRef.current);
    }

    return () => clearInterval(meditationRef.current);
  }, [timerRunning, breathState, breathSeconds, breathsCompleted, addXp, mode]);

  // Re-adjust values when mode switches
  useEffect(() => {
    setTimerRunning(false);
    setBreathsCompleted(0);
    setBreathState('inhale');
    setBreathSeconds(4);
    if (mode === 'meditate') {
      setActiveSounds(['drone']); // Default to Zen Drone
    }
  }, [mode, setTimerRunning]);

  const handleStartPause = () => {
    if (timerRunning) {
      setTimerRunning(false);
      playClick();
    } else {
      if (mode === 'meditate') {
        setTimerRunning(true);
        playClick();
      } else {
        // Trigger pre-session mood check-in bar (3-second auto start countdown)
        setShowMoodCheck(true);
        const t = setTimeout(() => {
          triggerStart('😐');
        }, 3000);
        setMoodTimer(t);
      }
    }
  };

  const triggerStart = (mood) => {
    if (moodTimer) clearTimeout(moodTimer);
    setMoodTimer(null);
    setShowMoodCheck(false);
    setActiveMood(mood);
    setTimeLeft(sessionTime * 60);
    setTimerRunning(true);
    playClick();
  };

  const handleReset = () => {
    setTimerRunning(false);
    if (mode === 'meditate') {
      setBreathState('inhale');
      setBreathSeconds(4);
      setBreathsCompleted(0);
    } else {
      setTimeLeft(sessionTime * 60);
      secondsRef.current = 0;
    }
    playClick();
  };

  const handleTimeSelect = (minutes) => {
    const val = Math.max(1, Math.min(180, minutes));
    setTimerRunning(false);
    setSessionTime(val);
    setLastDuration(val);
    setTimeLeft(val * 60);
    secondsRef.current = 0;
    playClick();
  };

  const handleToggleSound = (type) => {
    if (activeSounds.includes(type)) {
      setActiveSounds(prev => prev.filter(s => s !== type));
    } else {
      if (activeSounds.length >= 3) {
        triggerProModal("Mix up to 3 sound tracks simultaneously");
        return;
      }
      setActiveSounds(prev => [...prev, type]);
    }
    playClick();
  };

  const handleJournalSave = () => {
    setShowJournalPrompt(false);
    if (logSessionComplete) {
      logSessionComplete(sessionTime, activeMood, journalNote);
    } else {
      addXp(15, "Focus Session Complete! 🎉");
    }
    setJournalNote('');
    playClick();
  };

  const handleJournalSkip = () => {
    setShowJournalPrompt(false);
    if (logSessionComplete) {
      logSessionComplete(sessionTime, activeMood, '');
    } else {
      addXp(15, "Focus Session Complete! 🎉");
    }
    playClick();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathDetails = () => {
    const states = {
      inhale: { text: '💨 Inhale slowly...', scale: 1.25, color: 'var(--success)' },
      hold1: { text: '🧘 Hold breath...', scale: 1.25, color: 'var(--warning)' },
      exhale: { text: '🌬️ Exhale fully...', scale: 0.65, color: 'var(--accent)' },
      hold2: { text: '🧘 Rest empty...', scale: 0.65, color: 'var(--text-muted)' }
    };
    return states[breathState];
  };

  const breath = getBreathDetails();

  // A. Break Reminder Interstitial Overlay takeover
  if (showBreakOverlay) {
    return (
      <div 
        className="glass-panel"
        style={{
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
          animation: 'bloomPop 0.4s ease-out'
        }}
      >
        <div>
          <span style={{ fontSize: '32px' }}>☕</span>
          <h2 className="outfit-font" style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '12px' }}>
            Session complete. Your mind needs rest now.
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Taking a short break helps keep your sensory thresholds fully balanced.
          </p>
        </div>

        {/* Immersive Break Countdown Clock */}
        <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', width: '200px', height: '200px', transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="90" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="6" />
            <circle cx="100" cy="100" r="90" fill="transparent" stroke="var(--success)" strokeWidth="6" strokeDasharray="565.48" strokeDashoffset={breakActive ? 565.48 - (breakTimeLeft / 300) * 565.48 : 0} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
          </svg>
          <span className="outfit-font" style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatTime(breakTimeLeft)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
          {!breakActive ? (
            <button 
              onClick={() => { playClick(); setBreakActive(true); }}
              className="sensory-button"
              style={{ padding: '12px 28px' }}
            >
              Take a 5-min Break
            </button>
          ) : (
            <button 
              onClick={() => { playClick(); setBreakActive(false); }}
              className="sensory-button-secondary"
              style={{ padding: '12px 28px', color: 'var(--warning)' }}
            >
              Pause Break
            </button>
          )}

          <button 
            onClick={() => { playClick(); setShowBreakOverlay(false); setShowJournalPrompt(true); }}
            className="sensory-button-secondary"
            style={{ padding: '12px 28px' }}
          >
            Keep Going
          </button>
        </div>
      </div>
    );
  }

  // B. Post-Session Micro Journaling prompt overlay takeover
  if (showJournalPrompt) {
    return (
      <div 
        className="glass-panel"
        style={{
          padding: '36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          animation: 'bloomPop 0.4s ease-out'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '28px' }}>📝</span>
          <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
            What did you actually get done?
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Offload your accomplishments briefly. This builds your focus diary.</p>
        </div>

        <textarea 
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          className="sensory-input"
          placeholder="I completed the summary writing and parsed 3 task files..."
          style={{ width: '100%', minHeight: '80px', fontSize: '13px', borderRadius: '12px', padding: '12px 14px' }}
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%', marginTop: '4px' }}>
          <button onClick={handleJournalSave} className="sensory-button" style={{ padding: '10px 24px', fontSize: '13px' }}>
            Save Note
          </button>
          <button onClick={handleJournalSkip} className="sensory-button-secondary" style={{ padding: '10px 24px', fontSize: '13px', border: 'none' }}>
            Skip
          </button>
        </div>
      </div>
    );
  }

  // C. If timer is active: Render the HYPER-FOCAL VIEWPORT Takeover
  if (timerRunning) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '36px',
          padding: '40px',
          textAlign: 'center',
          animation: 'bloomPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Intention Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            {mode === 'meditate' ? 'Mindful Breathing' : 'Focal Flow Active'}
          </span>
          <h2 className="outfit-font" style={{ fontSize: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            {mode === 'meditate' ? '🧘 Inner Sanctuary' : '🌊 Flowing into Zen'}
          </h2>
        </div>

        {/* GIANT COUNTDOWN OR MEDITATION ORB */}
        {mode === 'meditate' ? (
          <div style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', backgroundColor: breath.color, opacity: 0.08, transform: `scale(${breath.scale})`, transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }} />
            <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: `radial-gradient(circle, ${breath.color} 0%, rgba(255,255,255,0.04) 90%)`, transform: `scale(${breath.scale})`, transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${breath.color}35`, zIndex: 1 }} className="timer-pulse-layer">
              <span className="outfit-font" style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-primary)' }}>{breathSeconds}</span>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '340px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="timer-running">
            <div className="timer-pulse-layer"></div>
            <svg style={{ position: 'absolute', width: '320px', height: '320px', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 16px rgba(0,0,0,0.25))' }}>
              <circle cx="160" cy="160" r="140" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
              {/* Glowing fuzzy backdrop stroke */}
              <circle cx="160" cy="160" r="140" fill="transparent" stroke="var(--accent)" strokeWidth="12" strokeDasharray={strokeDash} strokeDashoffset={strokeOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s linear', filter: 'blur(8px)', opacity: 0.6 }} />
              {/* Sharp top-layer focus stroke */}
              <circle cx="160" cy="160" r="140" fill="transparent" stroke="var(--accent)" strokeWidth="12" strokeDasharray={strokeDash} strokeDashoffset={strokeOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
            </svg>
            <div style={{ zIndex: 2 }}>
              <span className="outfit-font" style={{ fontSize: '64px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Breathing State details or Active Intention Anchor */}
        {mode === 'meditate' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '40px' }}>
            <span className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '600' }}>{breath.text}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Breaths logged: {breathsCompleted}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '440px' }}>
            {dailyIntention ? (
              /* If a Daily Intention Anchor is set, display it persistently! */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>My Active Anchor</span>
                <span className="outfit-font" style={{ fontSize: '16px', color: 'var(--accent)', fontWeight: '700' }}>🎯 {dailyIntention}</span>
              </div>
            ) : (
              /* Fallback to rotating affirmations */
              <Affirmations mode={mode} timerRunning={timerRunning} customAffirmations={customAffirmations} useCustomAffirmations={useCustomAffirmations} />
            )}
            
            {/* Live body doubling real presence counter */}
            {ablyConnected && presenceCount > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.6, marginTop: '12px' }}>
                👥 {presenceCount} {presenceCount === 1 ? 'person is' : 'people are'} focusing with you right now.
              </span>
            )}
          </div>
        )}

        {/* Actions bar at bottom */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%', marginTop: '16px', opacity: 0.7 }}>
          <button className="sensory-button-secondary" onClick={handleStartPause} style={{ padding: '10px 24px', fontSize: '13px' }}>
            <Pause size={14} />
            Pause
          </button>
          
          <button className="sensory-button-secondary" onClick={handleReset} style={{ padding: '10px 14px', color: 'rgba(255,60,60,0.8)' }} title="Reset timer">
            <RotateCcw size={14} />
          </button>
        </div>

      </div>
    );
  }

  // D. Setup screen before start
  return (
    <div className="glass-panel focus-room-container" style={{ padding: '32px', textAlign: 'center' }}>
      
      {/* 3-Second sliding mood check-in bar */}
      {showMoodCheck && (
        <div 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.85)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '16px',
            borderRadius: '16px',
            marginBottom: '20px',
            animation: 'bloomPop 0.4s ease-out'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            🧠 Pre-Session Mood Check-in (Starting in 3s...)
          </span>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {[
              { emoji: '😴', label: 'Drained' },
              { emoji: '😟', label: 'Anxious' },
              { emoji: '😐', label: 'Neutral' },
              { emoji: '😊', label: 'Good' },
              { emoji: '⚡', label: 'Energized' }
            ].map((m) => (
              <button 
                key={m.emoji}
                onClick={() => triggerStart(m.emoji)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '8px',
                  transition: 'transform 0.2s'
                }}
                className="tactile-card"
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        
        {/* Header */}
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px', color: 'var(--text-primary)' }}>
            {mode === 'meditate' ? 'Zen Meditation' : 'Focus Room'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {mode === 'meditate' 
              ? '🧘 Deepen your box breathing. Listen to the singing bowl chimes. Earn +2 XP per cycle.'
              : '📚 Gather dopamine points. Earn +1 XP per minute and +15 XP on completion.'
            }
          </p>
        </div>

        {/* SVG POT PRESETS CIRCLE */}
        {mode === 'meditate' ? (
          <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-secondary) 0%, rgba(255,255,255,0.02) 80%)', opacity: 0.1 }} />
            <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={32} style={{ color: 'var(--accent-secondary)' }} />
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Fix 3: Ambient idle halo */}
            <div className="focus-idle-halo" />
            <svg style={{ position: 'absolute', width: '180px', height: '180px', transform: 'rotate(-90deg)' }}>
              <circle cx="90" cy="90" r="75" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
              {/* Glowing backdrop ring */}
              <circle cx="90" cy="90" r="75" fill="transparent" stroke="var(--accent)" strokeWidth="8" strokeDasharray="471.23" strokeDashoffset="0" strokeLinecap="round" style={{ filter: 'blur(6px)', opacity: 0.5 }} />
              {/* Sharp ring */}
              <circle cx="90" cy="90" r="75" fill="transparent" stroke="var(--accent)" strokeWidth="8" strokeDasharray="471.23" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="outfit-font" style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {formatTime(sessionTime * 60)}
            </span>
          </div>
        )}

        {/* Flexible Presets + Custom Duration Input */}
        {mode !== 'meditate' && (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              width: '100%', 
              maxWidth: '360px', 
              padding: '16px', 
              backgroundColor: 'rgba(0,0,0,0.1)', 
              borderRadius: '14px', 
              border: '1px solid rgba(255,255,255,0.03)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                <Clock size={15} style={{ color: 'var(--accent)' }} />
                <span>Adjust Target Focus</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={sessionTime}
                  onChange={(e) => handleTimeSelect(parseInt(e.target.value) || 1)}
                  style={{
                    width: '60px',
                    padding: '4px 6px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--panel-border)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>min</span>
              </div>
            </div>

            {/* Presets Row */}
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              {[10, 25, 52, 90].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTimeSelect(t)}
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    padding: '8px 0',
                    borderRadius: '8px',
                    backgroundColor: sessionTime === t ? 'rgba(79, 172, 254, 0.12)' : 'rgba(255,255,255,0.02)',
                    borderColor: sessionTime === t ? 'var(--accent)' : 'var(--panel-border)',
                    color: sessionTime === t ? 'var(--accent)' : 'var(--text-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer'
                  }}
                >
                  {t} Min
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start CTA */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
          <button 
            className="sensory-button" 
            onClick={handleStartPause} 
            style={{ padding: '14px 48px', fontSize: '16px' }}
          >
            <Play size={18} />
            {mode === 'meditate' ? 'Start Zen Session' : 'Enter Focal Flow'}
          </button>
        </div>

        {/* Multi-Track Mixer Section */}
        <div 
          style={{ 
            marginTop: '12px',
            paddingTop: '24px', 
            borderTop: '1px solid var(--panel-border)',
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} style={{ color: 'var(--accent)' }} />
              <span className="outfit-font" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Atmospheric Sound Waves (Mix up to 3)
              </span>
            </div>
            
            {activeSounds.length > 0 && (
              <button
                className="sensory-button-secondary"
                onClick={() => { playClick(); setActiveSounds([]); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderRadius: '8px',
                  color: 'rgba(255, 60, 60, 0.85)',
                  borderColor: 'rgba(255, 60, 60, 0.15)',
                  cursor: 'pointer'
                }}
              >
                Silence Atmosphere
              </button>
            )}
          </div>

          {/* Categorized Mix Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', textAlign: 'left' }}>
            {soundCategories.map((category) => (
              <div key={category.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
                  {category.name}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '10px', width: '100%' }}>
                  {category.sounds.map((noise) => {
                    const isActive = activeSounds.includes(noise.type);
                    return (
                      <div 
                        key={noise.type} 
                        className={isActive ? 'sound-active-pulse' : ''}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '6px',
                          padding: '10px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'rgba(255,255,255,0.01)',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--accent)' : 'var(--panel-border)',
                          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                      >
                        <button
                          className="sensory-button-secondary"
                          onClick={() => handleToggleSound(noise.type)}
                          style={{
                            width: '100%',
                            padding: '8px 4px',
                            fontSize: '12px',
                            border: 'none',
                            background: 'none',
                            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontWeight: isActive ? '700' : '400'
                          }}
                        >
                          {noise.label}
                        </button>
                        
                        {/* Individual volume slider */}
                        {isActive && (
                          <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={soundVolumes[noise.type]}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setSoundVolumes(prev => ({ ...prev, [noise.type]: v }));
                            }}
                            style={{
                              width: '100%',
                              accentColor: 'var(--accent)',
                              height: '3px',
                              cursor: 'pointer'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Master Volume slider */}
          {activeSounds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px', margin: '12px auto 0 auto', width: '100%' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mute Master</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={masterVolume} 
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: 'var(--accent)',
                  height: '4px',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>100%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
