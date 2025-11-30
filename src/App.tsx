/**
 * Exam Timer & Alert System - Main Application Component
 * 
 * This is the root component that orchestrates all exam-related features:
 * - Configurable exam duration and alert thresholds
 * - Countdown timer with visual warnings
 * - Browser notifications and sound alerts
 * - Violation detection and logging
 * - Session summary upon completion
 */

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

/**
 * Main application component.
 * 
 * Implements all core requirements with configurable settings.
 */
function App(): React.JSX.Element {
  // -------------------------------------------------------------------------
  // Exam Configuration State (locked once exam starts)
  // -------------------------------------------------------------------------
  const [examConfig, setExamConfig] = useState({
    duration: 45,    // Total time in minutes
    warningAt: 5,    // Warning alert at X minutes
    criticalAt: 1,   // Critical alert at X minutes
  });

  // -------------------------------------------------------------------------
  // Initialize Hooks
  // -------------------------------------------------------------------------

  // Timer hook with configurable duration and thresholds
  const timer = useTimer({
    duration: examConfig.duration,
    warningAt: examConfig.warningAt,
    criticalAt: examConfig.criticalAt,
  });

  // Notifications hook with configurable thresholds
  const notifications = useNotifications({
    timeRemaining: timer.timeRemaining,
    status: timer.status,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
    warningThreshold: examConfig.warningAt * 60,
    criticalThreshold: examConfig.criticalAt * 60,
  });

  // Violations hook
  const violations = useViolations();

  // Tab title hook (updates when tab is inactive)
  const { isTabHidden } = useTabTitle({
    timeRemaining: timer.timeRemaining,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
  });

  // -------------------------------------------------------------------------
  // Derived State
  // -------------------------------------------------------------------------

  // Exam is "started" if running, paused, or finished
  const isExamStarted = timer.isRunning || timer.isPaused || timer.isFinished;
  
  // Config is locked once exam has started
  const isConfigLocked = isExamStarted;

  // Violation buttons enabled only when exam is active
  const isExamActive = timer.isRunning || timer.isPaused;

  // Total duration in seconds (for progress bar)
  const totalDurationSeconds = examConfig.duration * 60;

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  // Handle config changes (only when not locked)
  const handleDurationChange = (minutes: number) => {
    if (!isConfigLocked) {
      setExamConfig(prev => ({
        ...prev,
        duration: minutes,
        // Ensure warning is less than duration
        warningAt: Math.min(prev.warningAt, minutes - 1),
      }));
    }
  };

  const handleWarningChange = (minutes: number) => {
    if (!isConfigLocked) {
      setExamConfig(prev => ({
        ...prev,
        warningAt: minutes,
        // Ensure critical is less than warning
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

  // Handle restart - reset timer and violations
  const handleRestart = () => {
    timer.reset();
    violations.clearViolations();
  };

  // -------------------------------------------------------------------------
  // Render: Session Summary (when finished)
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Render: Main Exam Interface
  // -------------------------------------------------------------------------

  return (
    <main className="app">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Exam Timer</h1>
          <p className="app-subtitle">Online Proctoring System</p>
        </header>

        {/* Exam Configuration - Locked once started */}
        <ExamConfig
          duration={examConfig.duration}
          warningAt={examConfig.warningAt}
          criticalAt={examConfig.criticalAt}
          isLocked={isConfigLocked}
          onDurationChange={handleDurationChange}
          onWarningChange={handleWarningChange}
          onCriticalChange={handleCriticalChange}
        />

        {/* Timer Section */}
        <ExamTimer 
          timer={{
            ...timer,
            reset: handleRestart,
          }}
          totalDuration={totalDurationSeconds}
          warningMinutes={examConfig.warningAt}
          criticalMinutes={examConfig.criticalAt}
        />

        {/* Violation Panel - Simulation Buttons */}
        <ViolationPanel
          totalCount={violations.totalCount}
          countByType={violations.countByType}
          onViolation={violations.addViolation}
          isExamActive={isExamActive}
        />

        {/* Violation Log - Timeline */}
        <ViolationLog
          violations={violations.violations}
          maxItems={5}
        />

        {/* Alert Settings */}
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
