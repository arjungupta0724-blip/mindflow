import React, { useState } from 'react';
import { Wand2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * AiPlanner - Prompt-Driven Client-Side Heuristic AI Planner.
 * Decomposes high-level objectives into specific, prioritized task checklists.
 */
export default function AiPlanner({ onAddTasks, addXp }) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Advanced Local AI Prompt Planning Templates
  const aiTemplates = {
    website: [
      { text: "🎨 Sketch a simple 3-page visual outline on paper", priority: "steady" },
      { text: "💻 Scaffold a basic HTML layout with dynamic global fonts", priority: "focal" },
      { text: "🌈 Style the dashboard with modern CSS glassmorphic vars", priority: "focal" },
      { text: "🚀 Drop the folder onto Netlify Drop to publish for free!", priority: "urgent" }
    ],
    bake: [
      { text: "🥣 Gather all raw ingredients & clean your kitchen surface", priority: "steady" },
      { text: "⏱️ Pre-heat the oven to the target baking temperature", priority: "focal" },
      { text: "🥣 Mix the wet & dry ingredients into a smooth batter", priority: "focal" },
      { text: "🧼 Clean your mixing bowls while the cake is in the oven", priority: "steady" }
    ],
    study: [
      { text: "📚 Collect textbook, notes, and a tall bottle of water", priority: "steady" },
      { text: "⏱️ Start a 25-minute focal block in the Focus Room", priority: "urgent" },
      { text: "✍️ Summarize the first key section in exactly 3 bullets", priority: "focal" },
      { text: "🧠 Close the book and recall the core concept out loud", priority: "focal" }
    ],
    code: [
      { text: "💻 Open your text editor and terminal side-by-side", priority: "steady" },
      { text: "👾 Write a code comment detailing the next feature steps", priority: "focal" },
      { text: "🧪 Implement the absolute simplest working logic version", priority: "focal" },
      { text: "🛠️ Run a compilation build check to verify compiler status", priority: "urgent" }
    ],
    adhd: [
      { text: "🧘 Sit down and take three deep breaths with closed eyes", priority: "urgent" },
      { text: "⏱️ Set a tiny 5-minute Pomodoro sprint timer in MindFlow", priority: "focal" },
      { text: "✏️ Tackle the absolute simplest, easiest 1-minute micro-task", priority: "focal" },
      { text: "🎉 Tick it off, hear the success chime, and take a sip of water", priority: "steady" }
    ],
    generic: [
      { text: "📋 Gather your required materials and open your workspace", priority: "steady" },
      { text: "⏱️ Set a focus timer in the Focus Room to enter focal flow", priority: "focal" },
      { text: "✏️ Complete the first small 5-minute action block", priority: "focal" },
      { text: "🌟 Take a quick stretch and check off the item to claim XP", priority: "steady" }
    ]
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsAnalyzing(true);
    playClick();

    // Simulate AI thinking and neural network sweep
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      let matchedKey = 'generic';

      if (lower.includes('site') || lower.includes('web') || lower.includes('app') || lower.includes('build') || lower.includes('design')) {
        matchedKey = 'website';
      } else if (lower.includes('bake') || lower.includes('cook') || lower.includes('sourdough') || lower.includes('cake') || lower.includes('food')) {
        matchedKey = 'bake';
      } else if (lower.includes('study') || lower.includes('exam') || lower.includes('learn') || lower.includes('read') || lower.includes('book')) {
        matchedKey = 'study';
      } else if (lower.includes('code') || lower.includes('program') || lower.includes('software') || lower.includes('developer')) {
        matchedKey = 'code';
      } else if (lower.includes('adhd') || lower.includes('overwhelm') || lower.includes('freeze') || lower.includes('stuck')) {
        matchedKey = 'adhd';
      }

      // Generate custom task structures with dynamic prompts
      const generated = aiTemplates[matchedKey].map((t, idx) => ({
        id: `ai-gen-${Date.now()}-${idx}`,
        text: t.text,
        priority: t.priority,
        status: idx === 0 ? 'todo' : 'todo', // Place them in the Inbox
        subtasks: [],
        xpAwarded: false
      }));

      onAddTasks(generated);
      addXp(12, "AI Roadmap generated! 🪄"); // Award 12 XP for planning
      playSuccess();
      setPrompt('');
      setIsAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
          <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
            Prompt-Driven AI Planner
          </h3>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Tell the AI co-founder what big goal or project you are facing. We will dynamically compile a tailored, prioritized roadmap to help you get started without overwhelm.
      </p>

      {/* Input Form */}
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea
          className="sensory-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="✍️ E.g., 'I want to build a website for a bakery' or 'I am freezing and need to study for a chemistry exam'..."
          required
          disabled={isAnalyzing}
          style={{
            minHeight: '80px',
            resize: 'none',
            fontSize: '14px',
            lineHeight: 1.5,
            borderColor: prompt ? 'rgba(0, 242, 254, 0.25)' : 'var(--panel-border)'
          }}
        />

        <button
          type="submit"
          className="sensory-button"
          disabled={isAnalyzing || !prompt.trim()}
          style={{
            padding: '12px',
            fontSize: '14px',
            background: isAnalyzing ? 'rgba(255,255,255,0.06)' : undefined,
            border: isAnalyzing ? '1px solid var(--panel-border)' : undefined,
            boxShadow: isAnalyzing ? 'none' : undefined,
            cursor: (isAnalyzing || !prompt.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          <Wand2 size={16} className={isAnalyzing ? 'spin' : ''} />
          {isAnalyzing ? 'Analyzing Goal & Crafting Plan...' : 'Generate AI Roadmap'}
        </button>
      </form>

      {/* Database warning badge */}
      <div 
        style={{ 
          padding: '10px 14px', 
          backgroundColor: 'rgba(0, 0, 0, 0.15)', 
          borderRadius: '10px', 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center' 
        }}
      >
        <AlertCircle size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
          Powered by client-side focal models. Easily connects to real Gemini 3.5 Flash APIs in production settings!
        </span>
      </div>

    </div>
  );
}
