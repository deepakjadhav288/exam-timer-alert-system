/**
 * TimerDisplay Component
 * 
 * Renders the countdown timer value with visual status indicators.
 * Changes appearance based on timer status (normal, warning, critical).
 */

import React from 'react';
import { TimerStatus } from '../types';
import { formatTime } from '../utils';
import './TimerDisplay.css';

interface TimerDisplayProps {
  /** Remaining time in seconds */
  timeRemaining: number;
  /** Current timer status for styling */
  status: TimerStatus;
  /** Whether the timer is actively counting down */
  isRunning: boolean;
  /** Whether the timer is paused */
  isPaused: boolean;
  /** Whether the timer has finished */
  isFinished: boolean;
}

/**
 * Displays the countdown timer with visual feedback.
 * 
 * Features:
 * - Large, monospace time display
 * - Status-based color changes
 * - Pulsing animation for critical status
 * - Accessibility support with aria-live
 */
export function TimerDisplay({
  timeRemaining,
  status,
  isRunning,
  isPaused,
  isFinished,
}: TimerDisplayProps): React.JSX.Element {
  // Determine the status message to display
  const getStatusMessage = (): string => {
    if (isFinished) return "Time's Up!";
    if (isPaused) return 'Paused';
    if (isRunning) return 'Exam in Progress';
    return 'Ready to Start';
  };

  return (
    <div 
      className={`timer-display timer-display--${status}`}
      role="timer"
      aria-label={`Exam timer: ${formatTime(timeRemaining)} remaining`}
    >
      {/* Timer Value */}
      <div className="timer-display__time-container">
        <span 
          className={`timer-display__value ${isFinished ? 'timer-display__value--finished' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(timeRemaining)}
        </span>
        
        {/* Circular Progress Indicator */}
        <svg 
          className="timer-display__progress" 
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            className="timer-display__progress-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            className={`timer-display__progress-bar timer-display__progress-bar--${status}`}
            cx="50"
            cy="50"
            r="45"
            style={{
              // Calculate stroke offset based on time remaining (45 min = 2700s)
              strokeDashoffset: 283 - (283 * timeRemaining) / 2700,
            }}
          />
        </svg>
      </div>

      {/* Status Label */}
      <div className="timer-display__status">
        <span className={`timer-display__status-dot timer-display__status-dot--${status}`} />
        <span className="timer-display__status-text">
          {getStatusMessage()}
        </span>
      </div>

      {/* Warning Messages */}
      {status === 'warning' && !isFinished && (
        <div className="timer-display__alert timer-display__alert--warning" role="alert">
          ⏰ Less than 5 minutes remaining
        </div>
      )}
      
      {status === 'critical' && !isFinished && (
        <div className="timer-display__alert timer-display__alert--critical" role="alert">
          ⚠️ Final minute! Submit your exam soon.
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;

