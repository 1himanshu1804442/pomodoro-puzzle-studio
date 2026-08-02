// src/components/TaskList.jsx
import React, { useState } from 'react';

// Why this design: Making the task manager background ultra-translucent lets the evolving puzzle grid remain visible directly underneath your checklist items!
// Why onCompleteTask prop: Previously, checking a task only toggled local state without granting XP or unlocking puzzle tiles. Now the parent ArcadeDashboard passes down its handleCompleteTask callback so checking a task properly triggers XP rewards and tile reveals!
export default function TaskList({ tasks, setTasks, activeTaskId, setActiveTaskId, onCompleteTask }) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  // Why one-way completion: Completed tasks should stay completed to preserve XP integrity. Allowing un-checking would create an XP duplication exploit where users repeatedly check/uncheck the same task.
  const handleToggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // If task is already completed, do nothing (prevent un-checking)
    if (task.completed) return;

    // Call the parent's XP-granting completion handler
    if (onCompleteTask) {
      onCompleteTask(id);
    }
  };

  // Why delete handler: Users who make typos or add wrong tasks need an escape hatch. Deleting only removes the task from the list without affecting XP that was already earned.
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  return (
    <div className="glass-panel neon-border" style={{ display: 'flex', flexDirection: 'column', minHeight: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#ff007f', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px', textShadow: '0 0 10px rgba(255, 0, 127, 0.3)' }}>
          📋 FOCUS CHECKLIST
        </h3>
        <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
          {tasks.filter(t => t.completed).length} / {tasks.length} UNLOCKED
        </span>
      </div>
      
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.8rem' }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new study or engineering task..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          ＋
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '350px', paddingRight: '0.3rem' }}>
        {tasks.length === 0 ? (
          <div style={{ opacity: 0.4, textAlign: 'center', margin: 'auto 0', fontSize: '1.05rem' }}>
            ✦ Your checklist is currently empty. Add tasks above to initialize the puzzle grid!
          </div>
        ) : (
          tasks.map(task => {
            const isActive = activeTaskId === task.id;
            return (
              <div 
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.9rem 1.2rem',
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15), rgba(0, 240, 255, 0.05))' : 'rgba(0, 0, 0, 0.35)',
                  border: `1px solid ${isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: '14px',
                  boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.25)' : 'none',
                  transition: 'all 0.25s ease',
                  opacity: task.completed ? 0.5 : 1
                }}
              >
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  disabled={task.completed}
                  style={{ marginRight: '1rem', cursor: task.completed ? 'not-allowed' : 'pointer', width: '20px', height: '20px', accentColor: '#00f0ff' }}
                />
                <span style={{ 
                  flex: 1, 
                  fontSize: '1.05rem',
                  fontWeight: '500',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#8892a0' : '#ffffff',
                  cursor: task.completed ? 'default' : 'pointer'
                }}
                  onClick={() => { if(!task.completed) setActiveTaskId(task.id) }}
                >
                  {task.text}
                </span>

                {/* Delete button: Always available so users can remove typos or mistaken entries */}
                {!task.completed && (
                  <button 
                    className="btn" 
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete this task"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', background: 'transparent', borderColor: 'rgba(255,100,100,0.3)', color: '#ff6b6b', marginLeft: '0.5rem', minWidth: 'auto' }}
                  >
                    🗑️
                  </button>
                )}

                {!task.completed && !isActive && (
                  <button 
                    className="btn" 
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', marginLeft: '0.3rem' }}
                    onClick={() => setActiveTaskId(task.id)}
                  >
                    Target ➔
                  </button>
                )}
                {isActive && (
                  <span style={{ color: '#00f0ff', fontSize: '0.78rem', fontWeight: '800', background: 'rgba(0, 240, 255, 0.2)', padding: '0.3rem 0.7rem', borderRadius: '12px', letterSpacing: '1px', marginLeft: '0.3rem' }}>
                    ✦ ACTIVE
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
