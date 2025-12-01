import React, { useState } from 'react';
import { useTimer, useNotifications, useTabTitle, useViolations } from './hooks';
import {
  ExamTimer,
  ExamConfig,
  AlertSettings,
  ViolationPanel,
  ViolationLog,
  SessionSummary,
} from './components';
import './App.css';

function App(): React.JSX.Element {
  const [examConfig, setExamConfig] = useState({
    duration: 45,
    warningAt: 5,
    criticalAt: 1,
  });

  const timer = useTimer({
    duration: examConfig.duration,
    warningAt: examConfig.warningAt,
    criticalAt: examConfig.criticalAt,
  });

  const notifications = useNotifications({
    timeRemaining: timer.timeRemaining,
    status: timer.status,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
    warningThreshold: examConfig.warningAt * 60,
    criticalThreshold: examConfig.criticalAt * 60,
  });

  const violations = useViolations();

  const { isTabHidden } = useTabTitle({
    timeRemaining: timer.timeRemaining,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
  });

  const isExamStarted = timer.isRunning || timer.isPaused || timer.isFinished;
  
  const isConfigLocked = isExamStarted;

  const isExamActive = timer.isRunning || timer.isPaused;

  const totalDurationSeconds = examConfig.duration * 60;

  const canStartExam = notifications.isSupported && notifications.config.permissionGranted;

  const handleDurationChange = (minutes: number) => {
    if (!isConfigLocked) {
      setExamConfig(prev => ({
        ...prev,
        duration: minutes,
        warningAt: Math.min(prev.warningAt, minutes - 1),
      }));
    }
  };

  const handleWarningChange = (minutes: number) => {
    if (!isConfigLocked) {
      setExamConfig(prev => ({
        ...prev,
        warningAt: minutes,
        criticalAt: Math.min(prev.criticalAt, minutes - 1),
      }));
    }
  };

  const handleCriticalChange = (minutes: number) => {
    if (!isConfigLocked) {
      setExamConfig(prev => ({
        ...prev,
        criticalAt: minutes,
      }));
    }
  };

  const handleRestart = () => {
    timer.reset();
    violations.clearViolations();
  };


  if (timer.isFinished) {
    return (
      <main className="app">
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Exam Timer</h1>
            <p className="app-subtitle">Online Proctoring System</p>
          </header>

          <SessionSummary
            timeRemaining={timer.timeRemaining}
            totalDuration={totalDurationSeconds}
            violations={violations.violations}
            countByType={violations.countByType}
            onRestart={handleRestart}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Exam Timer</h1>
          <p className="app-subtitle">Online Proctoring System</p>
        </header>

        <ExamConfig
          duration={examConfig.duration}
          warningAt={examConfig.warningAt}
          criticalAt={examConfig.criticalAt}
          isLocked={isConfigLocked}
          onDurationChange={handleDurationChange}
          onWarningChange={handleWarningChange}
          onCriticalChange={handleCriticalChange}
        />

        <ExamTimer 
          timer={{
            ...timer,
            reset: handleRestart,
          }}
          totalDuration={totalDurationSeconds}
          warningMinutes={examConfig.warningAt}
          criticalMinutes={examConfig.criticalAt}
          canStart={canStartExam}
        />

        <ViolationPanel
          totalCount={violations.totalCount}
          countByType={violations.countByType}
          onViolation={violations.addViolation}
          isExamActive={isExamActive}
        />

        <ViolationLog
          violations={violations.violations}
          maxItems={5}
        />

        <AlertSettings
          config={notifications.config}
          isSupported={notifications.isSupported}
          onRequestPermission={notifications.requestPermission}
          onToggleSound={notifications.toggleSound}
          isTabHidden={isTabHidden}
        />
      </div>
    </main>
  );
}

export default App;
