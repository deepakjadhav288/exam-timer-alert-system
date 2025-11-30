/**
 * Exam Timer & Alert System - Main Application Component
 * 
 * This is the root component that orchestrates all exam-related features:
 * - Countdown timer with visual warnings
 * - Violation detection and logging
 * - Session summary upon completion
 */

import React from 'react';
import { useTimer } from './hooks';
import { formatTime } from './utils';
import './App.css';

/**
 * Main application component.
 * Demonstrates the useTimer hook functionality.
 */
function App(): React.JSX.Element {
  const {
    timeRemaining,
    isRunning,
    isPaused,
    isFinished,
    status,
    toggle,
    reset,
  } = useTimer();

  return (
    <main className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Exam Timer & Alert System</h1>
        </header>

        {/* Timer Display - Basic implementation for Task 2 demo */}
        <section className={`timer-section status-${status}`}>
          <div className="timer-display">
            <span className="timer-value" aria-live="polite">
              {formatTime(timeRemaining)}
            </span>
            <span className="timer-label">
              {isFinished 
                ? 'Time\'s Up!' 
                : isPaused 
                  ? 'Paused' 
                  : isRunning 
                    ? 'Running' 
                    : 'Ready'}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="timer-controls">
            {!isFinished ? (
              <>
                <button 
                  onClick={toggle}
                  className="btn btn-primary"
                  aria-label={isRunning ? 'Pause timer' : 'Start timer'}
                >
                  {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
                </button>
                <button 
                  onClick={reset}
                  className="btn btn-secondary"
                  aria-label="Reset timer"
                >
                  Reset
                </button>
              </>
            ) : (
              <button 
                onClick={reset}
                className="btn btn-primary"
                aria-label="Restart exam"
              >
                Restart
              </button>
            )}
          </div>

          {/* Status Indicator */}
          <div className="status-indicator">
            <span className={`status-badge status-badge-${status}`}>
              {status === 'critical' && '⚠️ '}
              {status === 'warning' && '⏰ '}
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
