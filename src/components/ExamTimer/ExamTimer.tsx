import React from 'react';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { UseTimerReturn } from '../../types';
import './ExamTimer.css';
interface ExamTimerProps {
  timer: UseTimerReturn;
  totalDuration: number;
  warningMinutes: number;
  criticalMinutes: number;
  canStart: boolean;
};

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
