import React from 'react';
import './TimerControls.css';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  canStart: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  isFinished,
  canStart,
  onToggle,
  onReset,
}: TimerControlsProps): React.JSX.Element {
  // Determine if this is the initial state (not started yet)
  const isInitialState = !isRunning && !isPaused && !isFinished;

  const getPrimaryButtonText = (): string => {
    if (isFinished) return 'Restart Exam';
    if (isRunning) return 'Pause';
    if (isPaused) return 'Resume';
    return 'Start Exam';
  };

  const getPrimaryButtonIcon = (): string => {
    if (isFinished) return '🔄';
    if (isRunning) return '⏸️';
    return '▶️';
  };

  const isStartDisabled = isInitialState && !canStart;

  return (
    <div className="timer-controls">
      {isStartDisabled && (
        <div className="timer-controls__warning" role="alert">
          ⚠️ Enable Browser Notifications to start the exam
        </div>
      )}

      {/* Primary Action Button */}
      <button
        className={`timer-controls__btn timer-controls__btn--primary ${
          isFinished ? 'timer-controls__btn--restart' : ''
        } ${isStartDisabled ? 'timer-controls__btn--disabled' : ''}`}
        onClick={isFinished ? onReset : onToggle}
        aria-label={getPrimaryButtonText()}
        disabled={isStartDisabled}
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
