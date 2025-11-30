/**
 * ExamTimer Component
 * 
 * Main timer component that composes TimerDisplay and TimerControls.
 * Manages the exam timer using the useTimer hook.
 */

import React from 'react';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { UseTimerReturn } from '../types';
import './ExamTimer.css';

interface ExamTimerProps {
  /** Timer state and actions from useTimer hook */
  timer: UseTimerReturn;
  /** Total exam duration in seconds */
  totalDuration: number;
  /** Warning threshold in minutes */
  warningMinutes: number;
  /** Critical threshold in minutes */
  criticalMinutes: number;
  /** Whether the exam can be started (notifications enabled) */
  canStart: boolean;
}

/**
 * Exam timer component with display and controls.
 * 
 * Uses composition pattern to combine:
 * - TimerDisplay: Shows countdown and visual status
 * - TimerControls: Pause, resume, reset buttons
 * 
 * The timer logic is lifted to the parent component via useTimer hook,
 * allowing for integration with other features (alerts, session tracking).
 */
export function ExamTimer({
  timer,
  totalDuration,
  warningMinutes,
  criticalMinutes,
  canStart,
}: ExamTimerProps): React.JSX.Element {
  const {
    timeRemaining,
    isRunning,
    isPaused,
    isFinished,
    status,
    toggle,
    reset,
  } = timer;

  return (
    <div className={`exam-timer exam-timer--${status}`}>
      <div className="exam-timer__card">
        {/* Timer Display */}
        <TimerDisplay
          timeRemaining={timeRemaining}
          status={status}
          isRunning={isRunning}
          isPaused={isPaused}
          isFinished={isFinished}
          totalDuration={totalDuration}
          warningMinutes={warningMinutes}
          criticalMinutes={criticalMinutes}
        />

        {/* Timer Controls */}
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          isFinished={isFinished}
          canStart={canStart}
          onToggle={toggle}
          onReset={reset}
        />
      </div>
    </div>
  );
}

export default ExamTimer;
