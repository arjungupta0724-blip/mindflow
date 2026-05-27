import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Heart, LogOut, HelpCircle, MessageSquare, Lock, X, ShieldCheck } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import FocusRoom from './components/FocusRoom';
import BrainDump from './components/BrainDump';
import TaskBoard from './components/TaskBoard';
import ThemeSelector from './components/ThemeSelector';
import Celebration from './components/Celebration';
import WelcomePortal from './components/WelcomePortal';
import IntentionSwitcher from './components/IntentionSwitcher';
import Affirmations from './components/Affirmations';
import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import { playLevelUp, playClick, stopAllActiveAudio } from './components/SoundSynthesizer';

/**
 * App - The core brain of the MindFlow universal, gamified, multi-intention workspace.
 */
export default function App() {
  // Authentication & Navigation
  const [user, setUser] = useLocalStorage('mindflow_user', null);
  const [hasVisitedBefore, setHasVisitedBefore] = useLocalStorage('mindflow_has_visited_before', false);
  const [hasOnboarded, setHasOnboarded] = useLocalStorage('mindflow_has_onboarded', false);
  const [activeTab, setActiveTab] = useState('focus');
  const [timerRunning, setTimerRunning] = useState(false);

  // Styling & Theme Resets
  const [customBg, setCustomBg] = useLocalStorage('mindflow_custom_bg', '');
  const [theme, setTheme] = useLocalStorage('mindflow_theme', 'theme-beautiful');
  const [intentionMode, setIntentionMode] = useLocalStorage('mindflow_intention', 'study');
  const [fontSize, setFontSize] = useLocalStorage('mindflow_font_size', 'default');

  // Gamification & Core Data
  const [tasks, setTasks] = useLocalStorage('mindflow_tasks', [
    { id: '1', text: '📖 Complete 25-minute study block', priority: 'steady', status: 'todo', subtasks: [], xpAwarded: false },
    { id: '2', text: '🧺 Declutter and tidy up desk area', priority: 'focal', status: 'todo', subtasks: [], xpAwarded: false },
    { id: '3', text: '✍️ Draft a paragraph for the project outline', priority: 'urgent', status: 'todo', subtasks: [], xpAwarded: false }
  ]);
  const [xp, setXp] = useLocalStorage('mindflow_xp', 15);
  const [stats, setStats] = useLocalStorage('mindflow_stats', {
    focusCompleted: 0,
    tasksCompleted: 0
  });

  // Level calculation (Capped at Level 7 for Free Tier)
  const isPro = useLocalStorage('mindflow_is_pro', false)[0]; // Soft pro tier gating check
  const calculatedLevel = Math.floor(xp / 100) + 1;
  const level = (!isPro && calculatedLevel > 7) ? 7 : calculatedLevel;

  // Streak, Intention & History Storage
  const [history, setHistory] = useLocalStorage('mindflow_history', []);
  const [streak, setStreak] = useLocalStorage('mindflow_streak', 0);
  const [lastSessionDate, setLastSessionDate] = useLocalStorage('mindflow_last_session_date', '');
  const [gardenCreatedAt, setGardenCreatedAt] = useLocalStorage('mindflow_garden_created_at', Date.now());
  const [customAffirmations, setCustomAffirmations] = useLocalStorage('mindflow_custom_affirmations', '');
  const [useCustomAffirmations, setUseCustomAffirmations] = useLocalStorage('mindflow_use_custom_affirmations', false);
  const [dailyIntention, setDailyIntention] = useLocalStorage('mindflow_daily_intention', { text: '', date: '', met: null });
  const [hasEmailPrompted, setHasEmailPrompted] = useLocalStorage('mindflow_has_email_prompted', false);
  const [waitlistEmails, setWaitlistEmails] = useLocalStorage('mindflow_waitlist', []);
  const [lastDuration, setLastDuration] = useLocalStorage('mindflow_last_duration', 25);

  // PWA Notifications States
  const [hasNotificationPrompted, setHasNotificationPrompted] = useLocalStorage('mindflow_has_notification_prompted', false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Theme Auto-Scheduling States
  const [useAutoTheme, setUseAutoTheme] = useLocalStorage('mindflow_use_auto_theme', false);
  const [themeSchedule, setThemeSchedule] = useLocalStorage('mindflow_theme_schedule', {
    morning: 'theme-beautiful',
    afternoon: 'theme-thoughtful',
    evening: 'theme-mindful',
    night: 'theme-deepwork'
  });
  const [lastScheduledHourApplied, setLastScheduledHourApplied] = useState(-1);

  // Pro Upgrade & Modals State
  const [proModal, setProModal] = useState({ show: false, feature: '' });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showIntentionPrompt, setShowIntentionPrompt] = useState(false);
  const [intentionInput, setIntentionInput] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false); // C2: custom sign-out modal

  // Interactive Level Up Celebrations
  const [prevLevel, setPrevLevel] = useState(level);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Gated Feature Interceptor
  const triggerProGating = (featureName) => {
    setProModal({ show: true, feature: featureName });
    playClick();
  };

  // Watch for Level Up
  useEffect(() => {
    if (level > prevLevel) {
      playLevelUp();
      setCelebrationActive(true);
      showToastMessage(`🎉 LEVEL UP! You grew to Level ${level}!`);
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  // Fix React async state theme lag
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
  }, [theme]);

  // Handle Font Size Scaling
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '85%';
    } else if (fontSize === 'large') {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '100%';
    }
  }, [fontSize]);

  // Auto-theme scheduler check every minute
  useEffect(() => {
    if (useAutoTheme) {
      const checkAndApplyTheme = () => {
        const currentHour = new Date().getHours();
        
        let activeScheduledTheme = '';
        if (currentHour >= 6 && currentHour < 12) {
          activeScheduledTheme = themeSchedule.morning || 'theme-beautiful';
        } else if (currentHour >= 12 && currentHour < 17) {
          activeScheduledTheme = themeSchedule.afternoon || 'theme-mindful';
        } else if (currentHour >= 17 && currentHour < 21) {
          activeScheduledTheme = themeSchedule.evening || 'theme-thoughtful';
        } else {
          activeScheduledTheme = themeSchedule.night || 'theme-deepwork';
        }
        
        if (theme !== activeScheduledTheme && lastScheduledHourApplied !== currentHour) {
          setTheme(activeScheduledTheme);
          setLastScheduledHourApplied(currentHour);
        }
      };

      checkAndApplyTheme();
      const interval = setInterval(checkAndApplyTheme, 60000);
      return () => clearInterval(interval);
    }
  }, [useAutoTheme, themeSchedule, theme, lastScheduledHourApplied]);

  // PWA Daily Notification Check
  useEffect(() => {
    if (Notification.permission === 'granted') {
      const interval = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const todayStr = now.toISOString().split('T')[0];
        
        const scheduledHourStr = localStorage.getItem('mindflow_scheduled_hour') || '9';
        const scheduledHour = parseInt(scheduledHourStr);
        const lastNotifDate = localStorage.getItem('mindflow_last_notification_date') || '';
        
        if (currentHour === scheduledHour && lastNotifDate !== todayStr) {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification("MindFlow 🌱", {
                body: "Your garden is waiting. Even 10 minutes counts.",
                icon: "/favicon.svg",
                badge: "/favicon.svg",
                tag: "daily-nudge"
              });
            });
          } else {
            new Notification("MindFlow 🌱", {
              body: "Your garden is waiting. Even 10 minutes counts.",
              icon: "/favicon.svg"
            });
          }
          localStorage.setItem('mindflow_last_notification_date', todayStr);
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [history]);

  const scheduleDailyNotification = () => {
    let targetHour = 9;
    if (history && history.length > 0) {
      const hours = history.map(item => {
        const timestamp = parseInt(item.id);
        if (!isNaN(timestamp)) {
          return new Date(timestamp).getHours();
        }
        return 9;
      });
      const counts = {};
      let maxCount = 0;
      let modeHour = 9;
      hours.forEach(hr => {
        counts[hr] = (counts[hr] || 0) + 1;
        if (counts[hr] > maxCount) {
          maxCount = counts[hr];
          modeHour = hr;
        }
      });
      targetHour = modeHour;
    }
    localStorage.setItem('mindflow_scheduled_hour', targetHour.toString());
  };

  const handleManualThemeChange = (newTheme) => {
    setTheme(newTheme);
    setLastScheduledHourApplied(new Date().getHours());
  };

  // Daily Streak Non-Punishing Check-in
  useEffect(() => {
    if (lastSessionDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastDateObj = new Date(lastSessionDate);
      const todayDateObj = new Date(todayStr);
      const diffTime = Math.abs(todayDateObj - lastDateObj);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1 && streak > 0) {
        setStreak(0);
        showToastMessage("🌧️ Your garden missed you. Start fresh today.");
      }
    }
  }, [lastSessionDate]);

  // Daily Intention Takeover Check-in — H3 fix: only show if today not answered, H9: null guard
  useEffect(() => {
    if (!user) return; // H9: null guard
    const todayStr = new Date().toISOString().split('T')[0];
    // H3: Only show if not already answered today
    if (dailyIntention.date !== todayStr && !showIntentionPrompt) {
      setShowIntentionPrompt(true);
    }
  }, [user]); // Only re-check when user logs in

  // Handle Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (e.key === ' ' || key === 'spacebar') {
        e.preventDefault();
        setTimerRunning(prev => !prev);
      } else if (key === 'b') {
        e.preventDefault();
        setActiveTab('dump');
      } else if (key === 'm') {
        e.preventDefault();
        // Master Mute
        stopAllActiveAudio();
        showToastMessage("🔇 Master Muted soundscapes!");
      } else if (key === 't') {
        e.preventDefault();
        setActiveTab('tasks');
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        setTimerRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToastMessage = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4000);
  };

  const addXp = (amount, toastMsg = '') => {
    // Gating check for Level 7 cap
    if (!isPro && level >= 7 && amount > 0) {
      triggerProGating("Garden Progression beyond Level 7");
      return;
    }
    setXp((prev) => {
      const nextXp = prev + amount;
      if (toastMsg) {
        showToastMessage(`${toastMsg} (+${amount} XP)`);
      }
      return nextXp;
    });
  };

  const logSessionComplete = (minutes, mood, journalNote = '') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      duration: minutes,
      mood: mood || '😐',
      xp: 15 + minutes,
      note: journalNote,
      intention: dailyIntention.text || '',
      intentionMet: dailyIntention.text ? true : null
    };

    setHistory((prev) => [newSession, ...prev]);

    // FIX 6: Increment Focus Blocks (focusCompleted) counter on session complete
    setStats(prev => ({ ...prev, focusCompleted: prev.focusCompleted + 1 }));

    // Handle Streaks increments
    let nextStreak = streak;
    if (lastSessionDate !== todayStr) {
      if (lastSessionDate === '') {
        nextStreak = 1;
      } else {
        const lastDateObj = new Date(lastSessionDate);
        const todayDateObj = new Date(todayStr);
        const diffTime = Math.abs(todayDateObj - lastDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          nextStreak = streak + 1;
        } else {
          nextStreak = 1; 
        }
      }
      setStreak(nextStreak);
      setLastSessionDate(todayStr);
    }

    addXp(15 + minutes, "Flow Session Complete! 🎉");

    // Email reminder modal checks on very first completion
    if (!hasEmailPrompted) {
      setTimeout(() => setShowEmailPrompt(true), 1200);
    }
  };

  // Sync tasks completed count in stats
  useEffect(() => {
    const doneCount = tasks.filter(t => t.status === 'done').length;
    if (doneCount !== stats.tasksCompleted) {
      setStats(prev => ({ ...prev, tasksCompleted: doneCount }));
    }
  }, [tasks, stats.tasksCompleted, setStats]);

  const addTask = (text, column = 'todo') => {
    if (!isPro && tasks.length >= 20) {
      triggerProGating("Task Board limit beyond 20 tasks");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: text,
      priority: 'steady',
      status: column,
      subtasks: [],
      xpAwarded: false,
      dueDate: ''
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleSignOut = () => {
    // C2: Replace window.confirm() with custom styled modal
    setShowSignOutConfirm(true);
    playClick();
  };

  const confirmSignOut = () => {
    setUser(null);
    setShowSignOutConfirm(false);
    playClick();
  };

  const triggerConfetti = () => {
    setCelebrationActive(true);
  };

  // Waitlist submission handler
  const handleWaitlistSubmit = (email) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setWaitlistEmails(prev => [...prev, email]);
    showToastMessage("✨ Joined waitlist! You'll be the first to know.");
    setProModal({ show: false, feature: '' });
  };

  // Email prompt signup handler
  const handleEmailPromptSubmit = (email) => {
    if (email && email.includes('@')) {
      setWaitlistEmails(prev => [...prev, email]);
      showToastMessage("🌿 Reminder set! We'll nudge you soon.");
    }
    setHasEmailPrompted(true);
    setShowEmailPrompt(false);
    
    // Automatically prompt notifications opt-in
    if (!hasNotificationPrompted) {
      setShowNotificationPrompt(true);
    }
  };

  // Intention morning anchor submitter
  const handleIntentionSubmit = () => {
    if (!intentionInput.trim()) return;
    const todayStr = new Date().toISOString().split('T')[0];
    setDailyIntention({
      text: intentionInput,
      date: todayStr,
      met: null
    });
    setShowIntentionPrompt(false);
    showToastMessage("🎯 Daily anchor set! Keep it in focus.");
  };

  // 1. Landing Page — H2: Skip double-funnel, go straight to WelcomePortal
  // New users land directly on WelcomePortal which has full marketing + signup

  // 2. Auth welcome selector
  if (!user) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="ambient-glowing-blob blob-1" />
        <div className="ambient-glowing-blob blob-2" />
        <WelcomePortal onSignIn={setUser} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      
      {/* Dynamic background wallpaper overlay */}
      {customBg && (
        <div 
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${customBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -2,
            transition: 'background-image 0.5s ease'
          }}
        />
      )}
      {customBg && (
        <div 
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 7, 20, 0.42)',
            zIndex: -1
          }}
        />
      )}

      {/* Default glowing blobs */}
      {!customBg && (
        <>
          <div className="ambient-glowing-blob blob-1" />
          <div className="ambient-glowing-blob blob-2" />
        </>
      )}

      {/* Confetti Overlay */}
      <Celebration active={celebrationActive} onComplete={() => setCelebrationActive(false)} />

      {/* Level Up & Reward Toast */}
      {toast.show && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 28px',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderColor: 'var(--accent)',
            boxShadow: 'var(--accent-glow)',
            animation: 'bloomPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <Sparkles size={20} style={{ color: 'var(--warning)', animation: 'spin 4s infinite linear' }} />
          <span className="outfit-font" style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {toast.message}
          </span>
        </div>
      )}

      {/* ========================================== */}
      {/* 3-STEP ONBOARDING OVERLAY                 */}
      {/* ========================================== */}
      {!hasOnboarded && (
        <OnboardingModal 
          theme={theme} 
          setTheme={setTheme} 
          onComplete={(brainDumpText) => {
            setHasOnboarded(true);
            // H7: Save brain dump text from onboarding step 2 to tasks
            if (brainDumpText && brainDumpText.trim()) {
              addTask(brainDumpText.trim(), 'todo');
              showToastMessage('💡 Your thought was saved to Brain Dump!');
            }
          }} 
        />
      )}

      {/* ========================================== */}
      {/* DAILY INTENTION MORNING OVERLAY TAKE-OVER  */}
      {/* ========================================== */}
      {showIntentionPrompt && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(30px)',
            zIndex: 1900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 className="outfit-font" style={{ fontSize: '22px', color: 'var(--text-primary)', fontWeight: '800' }}>
              🎯 Morning Focus Anchor
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            What is the <strong>one thing</strong> that would make today feel complete?
            </p>
            <input 
              type="text" 
              className="sensory-input"
              value={intentionInput}
              onChange={(e) => setIntentionInput(e.target.value)}
              placeholder="Example: Finish writing the research outline..."
              style={{ width: '100%', padding: '12px 14px', fontSize: '13px', borderRadius: '10px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button onClick={handleIntentionSubmit} className="sensory-button" style={{ width: '100%', padding: '12px' }}>
                This is my focus today
              </button>
              <button onClick={() => setShowIntentionPrompt(false)} className="sensory-button-secondary" style={{ width: '100%', border: 'none' }}>
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* KEYBOARD SHORTCUTS INSTRUCTIONS MODAL      */}
      {/* ========================================== */}
      {showShortcuts && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(30px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>🎹 Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="sensory-button-secondary" style={{ padding: '6px' }}><X size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Toggle Timer</span>
                <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: '700' }}>Space</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Open Brain Dump</span>
                <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: '700' }}>B</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Master Mute Audio</span>
                <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: '700' }}>M</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Open Task Board</span>
                <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: '700' }}>T</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Exit Immersive View</span>
                <kbd style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: '700' }}>Esc</kbd>
              </div>
            </div>
            <button onClick={() => setShowShortcuts(false)} className="sensory-button" style={{ width: '100%', marginTop: '8px' }}>Close</button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* FLOATING FEEDBACK MODAL FRAME              */}
      {/* ========================================== */}
      {showFeedback && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(30px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>💬 Share Feedback</h3>
              <button onClick={() => setShowFeedback(false)} className="sensory-button-secondary" style={{ padding: '6px' }}><X size={14} /></button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Help shape MindFlow. Pick a feedback category to compose an email directly to Anti-Gravity developers:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '👍 This works great', subject: 'Praise', body: 'What I love about MindFlow: [tell us here]' },
                { label: "🐛 Something's broken", subject: 'Bug Report', body: 'What happened: [describe the bug]%0AWhich screen: [which part of the app]%0ADevice: [your device]' },
                { label: '💡 I have an idea', subject: 'Feature Idea', body: 'My idea: [describe it here]%0AWhy it would help me: [explain here]' }
              ].map((opt) => (
                <a 
                  key={opt.subject}
                  href={`mailto:developer@mindflow.app?subject=[MindFlow Feedback] ${opt.subject}&body=${opt.body}`}
                  onClick={() => setShowFeedback(false)}
                  className="sensory-button-secondary text-center"
                  style={{ textDecoration: 'none', display: 'block', padding: '10px 8px', fontSize: '13px' }}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* WAITLIST WAIT / PRO FEATURE GATE MODAL      */}
      {/* ========================================== */}
      {proModal.show && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(30px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(79, 172, 254, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Lock size={20} />
            </div>
            <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '800' }}>
              This grows in Pro 🌱
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong>{proModal.feature}</strong> unlocks when MindFlow Pro launches. Join the waitlist and be first in line:
            </p>
            <input 
              type="email"
              placeholder="yourname@gmail.com"
              id="waitlist-email-input"
              className="sensory-input"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '10px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleWaitlistSubmit(document.getElementById('waitlist-email-input').value)}
                className="sensory-button" 
                style={{ width: '100%' }}
              >
                Yes, notify me!
              </button>
              <button 
                onClick={() => setProModal({ show: false, feature: '' })}
                className="sensory-button-secondary" 
                style={{ width: '100%', border: 'none' }}
              >
                Keep exploring Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ONE-TIME STUDY COMPLETED EMAIL PROMPT      */}
      {/* ========================================== */}
      {showEmailPrompt && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(30px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>🌱</span>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Your Garden is Growing!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Congratulations on completing your first focus block! Want a gentle reminder to come back tomorrow and water your plant?
            </p>
            <input 
              type="email"
              placeholder="enter your email address..."
              id="reminder-email-input"
              className="sensory-input"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '10px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleEmailPromptSubmit(document.getElementById('reminder-email-input').value)}
                className="sensory-button" 
                style={{ width: '100%' }}
              >
                Yes, remind me!
              </button>
              <button 
                onClick={() => { 
                  setHasEmailPrompted(true); 
                  setShowEmailPrompt(false); 
                  if (!hasNotificationPrompted) {
                    setShowNotificationPrompt(true);
                  }
                }}
                className="sensory-button-secondary" 
                style={{ width: '100%', border: 'none' }}
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PWA PUSH NOTIFICATIONS OPT-IN MODAL        */}
      {/* ========================================== */}
      {showNotificationPrompt && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(30px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>🔔</span>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Want a daily nudge to focus?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Your garden is waiting. Even 10 minutes counts. Get a quiet, silent notification at your best focus hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button 
                onClick={async () => {
                  setHasNotificationPrompted(true);
                  setShowNotificationPrompt(false);
                  playClick();
                  try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      scheduleDailyNotification();
                      showToastMessage("🔔 Reminders enabled! Your garden will nudge you daily.");
                      // Show immediate sample
                      new Notification("MindFlow 🌱", {
                        body: "Reminders successfully scheduled! See you at focus time.",
                        icon: "/favicon.svg"
                      });
                    } else {
                      showToastMessage("Reminders declined. You can enable them later.");
                    }
                  } catch (e) {
                    showToastMessage("Reminders not supported or blocked in browser.");
                  }
                }}
                className="sensory-button" 
                style={{ width: '100%' }}
              >
                Allow Reminders
              </button>
              <button 
                onClick={() => { 
                  setHasNotificationPrompted(true); 
                  setShowNotificationPrompt(false); 
                  playClick();
                  showToastMessage("No reminders set. Have a peaceful focus!");
                }}
                className="sensory-button-secondary" 
                style={{ width: '100%', border: 'none' }}
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MAIN APP SHELL FRAME                       */}
      {/* ========================================== */}
      <div 
        className="app-container"
        style={{
          display: 'flex',
          justifyContent: timerRunning ? 'center' : undefined,
          alignItems: timerRunning ? 'center' : undefined,
          minHeight: timerRunning ? '90vh' : undefined,
          padding: timerRunning ? '40px 24px' : undefined
        }}
      >
        {/* Sidebar */}
        {!timerRunning && (
          <aside className="sidebar glass-panel" style={{ gap: '20px', overflowY: 'auto' }}>
            
            {/* Main Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--panel-border)' }}>
              <div style={{ 
                padding: '8px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
                color: '#fff',
                boxShadow: 'var(--accent-glow)'
              }}>
                <BrainCircuit size={20} />
              </div>
              <div>
                <h1 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', lineHeight: 1 }}>
                  MindFlow
                </h1>
                <span style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                  Lv.{level} · {xp % 100} / 100 XP
                </span>
              </div>
            </div>

            {/* Profile badge */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '12px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                border: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '26px' }}>{user.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
                    Active User
                  </span>
                  <span className="outfit-font" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {user.name}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut} 
                className="sensory-button-secondary"
                style={{ padding: '6px', color: 'rgba(255, 60, 60, 0.75)' }}
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>

            {/* Sidebar nav buttons */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', paddingLeft: '8px', marginBottom: '4px' }}>
                Workspace Menu
              </span>
              {[
                { id: 'focus', label: '🌊 Focus Room', desc: 'Custom timer & sounds' },
                { id: 'dump', label: '🧠 Brain Dump', desc: 'Offload distractions' },
                { id: 'tasks', label: '📋 Action Tasks', desc: 'Manage flow columns' },
                { id: 'garden', label: '🏡 Seedling Garden', desc: 'Stats & wiggling seedling' },
                { id: 'theme', label: '🎨 Custom Wallpaper', desc: 'Upload a photo from your gallery' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); playClick(); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                      /* M12 fallback */ 
                      backgroundColor: isActive ? 'rgba(79, 172, 254, 0.08)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: isActive ? 'var(--accent-glow, none)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    className="tactile-card"
                  >
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{tab.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tab.desc}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions footer */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <button 
                onClick={() => { playClick(); setShowShortcuts(true); }}
                className="sensory-button-secondary"
                style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', borderRadius: '8px' }}
                title="Keyboard Shortcuts Cheatsheet"
              >
                <HelpCircle size={12} />
                <span>Shortcuts</span>
              </button>


            </div>

          </aside>
        )}

        {/* Workspace Display mains */}
        <main 
          className="main-content" 
          style={{ 
            maxWidth: timerRunning ? '640px' : '100%',
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px' 
          }}
        >
          {/* Daily Intention Banner Anchor Display */}
          {!timerRunning && dailyIntention.text && (
            <div 
              className="glass-panel" 
              style={{ 
                padding: '12px 18px', 
                borderRadius: '12px', 
                borderLeft: '4px solid var(--accent)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'rgba(79, 172, 254, 0.03)'
              }}
            >
              <div style={{ display: 'flex', flexDir: 'column', gap: '2px', textAlign: 'left' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Today's Core Intention</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>🎯 {dailyIntention.text}</span>
              </div>
              <button 
                onClick={() => {
                  playClick();
                  setDailyIntention(prev => ({ ...prev, met: true }));
                  addXp(10, "Intention Achieved! 🎯");
                  setDailyIntention({ text: '', date: '', met: null });
                }} 
                className="sensory-button" 
                style={{ padding: '6px 12px', fontSize: '11px' }}
              >
                Done
              </button>
            </div>
          )}

          {/* Switchers (Hidden when timer runs) */}
          {!timerRunning && <IntentionSwitcher activeMode={intentionMode} setMode={setIntentionMode} />}
          {!timerRunning && <Affirmations mode={intentionMode} />}

          {/* Preserved FocusRoom countdown viewport */}
          <div style={{ display: activeTab === 'focus' || timerRunning ? 'block' : 'none' }}>
            <FocusRoom 
              addXp={addXp} 
              mode={intentionMode} 
              tasks={tasks}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
              lastDuration={lastDuration}
              setLastDuration={setLastDuration}
              dailyIntention={dailyIntention.text}
              logSessionComplete={logSessionComplete}
              useCustomAffirmations={useCustomAffirmations}
              customAffirmations={customAffirmations}
              triggerProModal={triggerProGating}
              isPro={isPro}
            />
          </div>

          {/* Other tab spaces */}
          {!timerRunning && activeTab === 'dump' && <BrainDump addTask={addTask} />}
          {!timerRunning && activeTab === 'tasks' && <TaskBoard tasks={tasks} setTasks={setTasks} addXp={addXp} triggerConfetti={triggerConfetti} isPro={isPro} triggerProModal={triggerProGating} />}
          {!timerRunning && activeTab === 'garden' && (
            <Dashboard 
              xp={xp} 
              level={level} 
              stats={stats} 
              history={history}
              setHistory={setHistory}
              streak={streak}
              gardenCreatedAt={gardenCreatedAt}
              triggerProModal={triggerProGating}
              isPro={isPro}
            />
          )}
          {!timerRunning && activeTab === 'theme' && (
            <ThemeSelector 
              activeTheme={theme} 
              setTheme={handleManualThemeChange} 
              customBg={customBg} 
              setCustomBg={setCustomBg} 
              fontSize={fontSize}
              setFontSize={setFontSize}
              customAffirmations={customAffirmations}
              setCustomAffirmations={setCustomAffirmations}
              useCustomAffirmations={useCustomAffirmations}
              setUseCustomAffirmations={setUseCustomAffirmations}
              isPro={isPro}
              triggerProModal={triggerProGating}
              useAutoTheme={useAutoTheme}
              setUseAutoTheme={setUseAutoTheme}
              themeSchedule={themeSchedule}
              setThemeSchedule={setThemeSchedule}
            />
          )}

        </main>

      </div>

      {/* ========================================== */}
      {/* FIX 1: MOBILE BOTTOM TAB BAR              */}
      {/* Hidden on desktop (display:none default),  */}
      {/* shown on mobile via CSS media query.       */}
      {/* ========================================== */}
      {!timerRunning && (
        <nav className="mobile-tab-bar" style={{ display: 'none' }}>
          {[
            { id: 'focus', icon: '🌊', label: 'Focus' },
            { id: 'dump', icon: '🧠', label: 'Dump' },
            { id: 'tasks', icon: '📋', label: 'Tasks' },
            { id: 'garden', icon: '🏡', label: 'Garden' },
            { id: 'theme', icon: '⚙️', label: 'Settings' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); playClick(); }}
                className={isActive ? 'tab-active' : 'tab-inactive'}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Floating Ghost Feedback Speech Bubble Button */}
      {!timerRunning && (
        <button
          onClick={() => { playClick(); setShowFeedback(true); }}
          className="sensory-button-secondary feedback-float-btn"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          title="Send Feedback"
        >
          <MessageSquare size={18} />
        </button>
      )}

      {/* C2: Custom sign-out confirmation modal */}
      {showSignOutConfirm && (
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
            padding: '24px'
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '360px', width: '100%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'bloomPop 0.35s ease-out' }}>
            <div style={{ fontSize: '36px' }}>🌱</div>
            <h3 className="outfit-font" style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>
              Sign out of MindFlow?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your tasks, sessions, and seedling progress are saved right here in your browser. You can sign back in anytime.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={confirmSignOut}
                className="sensory-button"
                style={{ width: '100%', padding: '12px', color: 'rgba(255,80,80,0.9)' }}
              >
                Yes, sign me out
              </button>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="sensory-button-secondary"
                style={{ width: '100%', border: 'none' }}
              >
                Stay in MindFlow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIX 2: Floating "I'm Overwhelmed" pill button — always visible */}
      <button
        onClick={() => { playClick(); triggerProGating("ADHD Crisis Mode take-over"); }}
        className="overwhelmed-float-btn"
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '10px 22px',
          borderRadius: '99px',
          border: '1px solid rgba(255, 94, 98, 0.28)',
          backgroundColor: 'rgba(15, 10, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          color: '#ff7b7e',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255, 94, 98, 0.15)',
          fontFamily: "'Outfit', sans-serif",
          animation: 'overwhelmedPulse 4s infinite ease-in-out'
        }}
        title="Feeling overwhelmed? Get help."
      >
        <span style={{ fontSize: '15px' }}>🌊</span>
        I'm Overwhelmed
      </button>

    </div>
  );
}
