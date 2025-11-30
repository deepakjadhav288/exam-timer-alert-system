/**
 * TimerControls Component
 * 
 * Provides control buttons for the exam timer.
 * Handles pause, resume, and reset actions.
 */

import React from 'react';
import './TimerControls.css';

interface TimerControlsProps {
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether the timer is paused */
  isPaused: boolean;
  /** Whether the timer has finished */
  isFinished: boolean;
  /** Toggle between pause and resume */
  onToggle: () => void;
  /** Reset the timer to initial state */
  onReset: () => void;
}

/**
 * Control buttons for the exam timer.
 * 
 * States:
 * - Initial: Shows "Start Exam" button
 * - Running: Shows "Pause" and "Reset" buttons
 * - Paused: Shows "Resume" and "Reset" buttons
 * - Finished: Shows "Restart Exam" button
 */
export function TimerControls({
  isRunning,
  isPaused,
  isFinished,
  onToggle,
  onReset,
}: TimerControlsProps): React.JSX.Element {
  // Determine primary button text based on state
  const getPrimaryButtonText = (): string => {
    if (isFinished) return 'Restart Exam';
    if (isRunning) return 'Pause';
    if (isPaused) return 'Resume';
    return 'Start Exam';
  };

  // Determine primary button icon
  const getPrimaryButtonIcon = (): string => {
    if (isFinished) return '🔄';
    if (isRunning) return '⏸️';
    return '▶️';
  };

  return (
    <div className="timer-controls">
      {/* Primary Action Button */}
      <button
        className={`timer-controls__btn timer-controls__btn--primary ${
          isFinished ? 'timer-controls__btn--restart' : ''
        }`}
        onClick={isFinished ? onReset : onToggle}
        aria-label={getPrimaryButtonText()}
      >
        <span className="timer-controls__btn-icon" aria-hidden="true">
          {getPrimaryButtonIcon()}
        </span>
        <span className="timer-controls__btn-text">
          {getPrimaryButtonText()}
        </span>
      </button>

      {/* Reset Button - only show when timer is active (running or paused) */}
      {!isFinished && (isRunning || isPaused) && (
        <button
          className="timer-controls__btn timer-controls__btn--secondary"
          onClick={onReset}
          aria-label="Reset timer"
        >
          <span className="timer-controls__btn-icon" aria-hidden="true">
            🔄
          </span>
          <span className="timer-controls__btn-text">
            Reset
          </span>
        </button>
      )}
    </div>
  );
}

export default TimerControls;

