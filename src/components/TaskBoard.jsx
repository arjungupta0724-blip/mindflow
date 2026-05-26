import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Trash2, CheckCircle2, Circle, Wand2, Plus, Calendar, Lock } from 'lucide-react';
import { playClick, playSuccess } from './SoundSynthesizer';

/**
 * TaskBoard - A high-dopamine, ADHD-friendly task board.
 * - Caps Inbox at 10 active tasks for Free users (Unlimited for Pro).
 * - Caps "Active Flow" column to 3 items to prevent multi-tasking.
 * - Displays a simple red dot 🔴 if overdue, and an amber dot 🟡 if due today.
 */
export default function TaskBoard({ tasks, setTasks, addXp, triggerConfetti, isPro, triggerProModal }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('steady'); 
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [breakingTaskId, setBreakingTaskId] = useState(null); 

  const breakdownTemplates = {
    clean: [
      "🧹 Put 3 loose items in their proper place",
      "🧺 Gather any stray laundry into a pile",
      "🧻 Wipe just ONE desk or counter surface",
      "🗑️ Empty the room wastebasket"
    ],
    write: [
      "📄 Open a blank doc & write exactly ONE sentence",
      "🧠 Brain dump 3 quick bullet points on the topic",
      "📝 Draft a rough 1-paragraph intro without editing",
      "☕ Take a sip of water and celebrate writing"
    ],
    study: [
      "📚 Clear all tabs except the study material",
      "✏️ Read exactly one section or page",
      "🗒️ Write down two main takeaway concepts",
      "⏱️ Close notes and recall them out loud for 30s"
    ],
    code: [
      "💻 Open your terminal or text editor",
      "👾 Write a simple comment defining the next function",
      "🧪 Implement just the first return statement",
      "🛠️ Run a quick compilation or local build check"
    ],
    workout: [
      "👟 Put on comfortable shoes or workout clothes",
      "🧘 Stretch arms and legs for 1 minute",
      "💪 Do exactly 5 squats or 5 jumping jacks",
      "💧 Drink a sip of cold water"
    ],
    default: [
      "✨ Open the necessary workspace or materials",
      "⏱️ Focus on this for exactly 3 minutes (micro-sprint)",
      "✏️ Do the absolute easiest sub-step first",
      "🎉 Check off this list item and keep going!"
    ]
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    // Free Tier Cap Check
    if (!isPro && tasks.length >= 20) {
      triggerProModal("Task Board limit beyond 20 tasks");
      return;
    }

    const task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      priority: newTaskPriority,
      status: 'todo', 
      subtasks: [],
      xpAwarded: false,
      dueDate: newTaskDueDate
    };

    setTasks(prev => [task, ...prev]);
    setNewTaskText('');
    setNewTaskPriority('steady');
    setNewTaskDueDate('');
    playSuccess();
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    playClick();
  };

  const moveTask = (id, newStatus) => {
    if (newStatus === 'active') {
      const activeCount = tasks.filter(t => t.status === 'active').length;
      if (activeCount >= 3) {
        alert("🚨 Active Flow is capped at 3 tasks to prevent cognitive overwhelm! Focus on these or move them back to Inbox first.");
        return;
      }
    }

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (newStatus === 'done' && !t.xpAwarded) {
          addXp(10, "Task Accomplished! 🌟"); 
          triggerConfetti();
          playSuccess();
          return { ...t, status: newStatus, xpAwarded: true };
        }
        playClick();
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleBreakDown = (taskId, taskText) => {
    setBreakingTaskId(taskId);
    playClick();

    setTimeout(() => {
      const textLower = taskText.toLowerCase();
      let matchedKey = 'default';

      if (textLower.includes('clean') || textLower.includes('room') || textLower.includes('tidy') || textLower.includes('wash')) {
        matchedKey = 'clean';
      } else if (textLower.includes('write') || textLower.includes('essay') || textLower.includes('report') || textLower.includes('draft')) {
        matchedKey = 'write';
      } else if (textLower.includes('study') || textLower.includes('read') || textLower.includes('learn') || textLower.includes('exam')) {
        matchedKey = 'study';
      } else if (textLower.includes('code') || textLower.includes('build') || textLower.includes('program') || textLower.includes('bug')) {
        matchedKey = 'code';
      } else if (textLower.includes('workout') || textLower.includes('gym') || textLower.includes('run') || textLower.includes('exercise')) {
        matchedKey = 'workout';
      }

      const selectedSteps = breakdownTemplates[matchedKey].map((step, idx) => ({
        id: `${taskId}-sub-${idx}`,
        text: step,
        completed: false
      }));

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: selectedSteps };
        }
        return t;
      }));

      setBreakingTaskId(null);
      addXp(2, "Task broken down! Magic! 🪄"); 
      playSuccess();
    }, 1200);
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(sub => {
          if (sub.id === subtaskId) {
            const nextCompleted = !sub.completed;
            if (nextCompleted) {
              addXp(3, "Subtask completed! ⚡"); 
              playSuccess();
            } else {
              playClick();
            }
            return { ...sub, completed: nextCompleted };
          }
          return sub;
        });

        const allDone = updatedSubtasks.every(s => s.completed);
        let status = t.status;
        let xpAwarded = t.xpAwarded;

        if (allDone && t.status !== 'done' && updatedSubtasks.length > 0) {
          status = 'done';
          if (!xpAwarded) {
            addXp(10, "Task Completed! 🌟");
            triggerConfetti();
            xpAwarded = true;
          }
        }

        return { ...t, subtasks: updatedSubtasks, status, xpAwarded };
      }
      return t;
    }));
  };

  const handleCardDueDateChange = (id, newDate) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, dueDate: newDate };
      }
      return t;
    }));
    playClick();
  };

  // Due Date urgency calculation (returns color dot or null)
  const getUrgencyDot = (dueDate) => {
    if (!dueDate) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    if (dueDate < todayStr) {
      return { dot: '🔴', title: 'Overdue!' };
    }
    if (dueDate === todayStr) {
      return { dot: '🟡', title: 'Due today' };
    }
    return null;
  };

  const renderPriority = (p) => {
    const badges = {
      urgent: { label: '🔥 Urgent', color: 'rgba(255, 0, 127, 0.15)', text: '#ff007f' },
      focal: { label: '⚡ Focal', color: 'rgba(255, 230, 0, 0.15)', text: 'var(--accent-secondary)' },
      steady: { label: '🧊 Steady', color: 'rgba(79, 172, 254, 0.15)', text: 'var(--accent)' }
    };
    const b = badges[p] || badges.steady;
    return (
      <span style={{ 
        padding: '3px 8px', 
        borderRadius: '99px', 
        fontSize: '11px', 
        fontWeight: '600', 
        backgroundColor: b.color, 
        color: b.text 
      }}>
        {b.label}
      </span>
    );
  };

  const columns = [
    { id: 'todo', title: 'Inbox / Ideas', desc: 'Capture thoughts first' },
    { id: 'active', title: 'In Progress', desc: 'Up to 3 active tasks', isCap: true },
    { id: 'done', title: 'Accomplished', desc: 'Dopamine Bank' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Task creator form with Optional Due Date picker */}
      <form onSubmit={handleAddTask} className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <input 
          className="sensory-input"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="➕ Capture a new task or idea..."
          style={{ flex: 1, minWidth: '220px', padding: '12px 16px', borderRadius: '10px' }}
        />
        
        {/* Due Date picker */}
        <input 
          type="date"
          className="sensory-input"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          style={{ padding: '10px', fontSize: '13px', borderRadius: '10px', color: 'var(--text-secondary)' }}
          title="Optional Due Date"
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          {['steady', 'focal', 'urgent'].map((p) => (
            <button
              type="button"
              key={p}
              className="sensory-button-secondary"
              onClick={() => { setNewTaskPriority(p); playClick(); }}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                borderRadius: '10px',
                backgroundColor: newTaskPriority === p ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                borderColor: newTaskPriority === p ? 'var(--accent)' : 'var(--panel-border)',
                color: newTaskPriority === p ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              {p === 'urgent' && '🔥 Urgent'}
              {p === 'focal' && '⚡ Focal'}
              {p === 'steady' && '🧊 Steady'}
            </button>
          ))}
        </div>

        <button type="submit" className="sensory-button" style={{ padding: '12px 24px', borderRadius: '10px' }}>
          <Plus size={16} />
          Add Task
        </button>
      </form>

      {/* Kanban columns */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const isFull = col.isCap && colTasks.length >= 3;

          return (
            <div 
              key={col.id} 
              className="glass-panel" 
              style={{ 
                padding: '20px', 
                minHeight: '400px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                borderColor: isFull ? 'rgba(255, 230, 0, 0.25)' : 'var(--panel-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="outfit-font" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                    {col.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{col.desc}</span>
                </div>
                <span 
                  className="outfit-font"
                  style={{ 
                    padding: '4px 10px', 
                    borderRadius: '8px', 
                    fontSize: '13px', 
                    backgroundColor: isFull ? 'rgba(255, 230, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: isFull ? 'var(--accent-secondary)' : 'var(--text-primary)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {col.isCap ? (
                    // FIX 8: Replace "0/3" counter with 3 dot indicators
                    [0, 1, 2].map(dotIdx => (
                      <span key={dotIdx} style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: dotIdx < colTasks.length 
                          ? (isFull ? 'var(--accent-secondary)' : 'var(--accent)')
                          : 'rgba(255,255,255,0.15)',
                        display: 'inline-block',
                        transition: 'background-color 0.3s'
                      }} />
                    ))
                  ) : (
                    colTasks.length
                  )}
                </span>
              </div>

              {/* Task Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {colTasks.length === 0 ? (
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    padding: '40px 0',
                    border: '1px dashed rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                  }}>
                    <span>🌊 Quiet and calm</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const urgency = getUrgencyDot(task.dueDate);
                    return (
                      <div 
                        key={task.id} 
                        className="tactile-card"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px',
                          padding: '16px',
                          borderLeft: task.status === 'active' ? '3px solid var(--accent)' : undefined
                        }}
                      >
                        {/* Title line */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
                            {/* Urgency signal dot */}
                            {urgency && (
                              <span style={{ fontSize: '12px', cursor: 'help' }} title={urgency.title}>
                                {urgency.dot}
                              </span>
                            )}
                            <span 
                              style={{ 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                color: 'var(--text-primary)',
                                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                                opacity: task.status === 'done' ? 0.5 : 1,
                                wordBreak: 'break-word',
                                lineHeight: 1.4
                              }}
                            >
                              {task.text}
                            </span>
                          </div>
                          {renderPriority(task.priority)}
                        </div>

                        {/* Optional Card Date Setter */}
                        {task.status !== 'done' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <Calendar size={11} />
                            <input 
                              type="date"
                              value={task.dueDate || ''}
                              onChange={(e) => handleCardDueDateChange(task.id, e.target.value)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                fontSize: '10px',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                        )}

                        {/* Subtasks */}
                        {task.subtasks.length > 0 && (
                          <div 
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '8px', 
                              padding: '10px', 
                              backgroundColor: 'rgba(0,0,0,0.1)', 
                              borderRadius: '8px' 
                            }}
                          >
                            {task.subtasks.map((sub) => (
                              <div 
                                key={sub.id} 
                                onClick={() => toggleSubtask(task.id, sub.id)}
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  color: sub.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                                  textDecoration: sub.completed ? 'line-through' : 'none'
                                }}
                              >
                                {sub.completed 
                                  ? <CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> 
                                  : <Circle size={15} style={{ color: 'var(--text-muted)' }} />
                                }
                                <span>{sub.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick actions row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {task.status !== 'done' && task.subtasks.length === 0 && (
                              <button
                                className="sensory-button-secondary"
                                onClick={() => handleBreakDown(task.id, task.text)}
                                disabled={breakingTaskId === task.id}
                                style={{ 
                                  padding: '6px 10px', 
                                  fontSize: '11px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  color: breakingTaskId === task.id ? 'var(--accent)' : 'var(--text-secondary)'
                                }}
                              >
                                <Wand2 size={12} className={breakingTaskId === task.id ? 'pulse-glow' : ''} />
                                {breakingTaskId === task.id ? 'Breaking...' : 'Magic Break'}
                              </button>
                            )}

                            <button
                              className="sensory-button-secondary"
                              onClick={() => handleDeleteTask(task.id)}
                              style={{ padding: '6px 8px', color: 'rgba(255,0,0,0.6)' }}
                              title="Delete task"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            {task.status !== 'todo' && (
                              <button
                                className="sensory-button-secondary"
                                onClick={() => moveTask(task.id, task.status === 'active' ? 'todo' : 'active')}
                                style={{ padding: '6px 10px' }}
                              >
                                <ArrowLeft size={12} />
                              </button>
                            )}
                            
                            {task.status !== 'done' && (
                              <button
                                className="sensory-button"
                                onClick={() => moveTask(task.id, task.status === 'todo' ? 'active' : 'done')}
                                style={{ padding: '6px 12px', fontSize: '11px', boxShadow: 'none' }}
                              >
                                <span>{task.status === 'todo' ? 'Focus' : 'Complete'}</span>
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
