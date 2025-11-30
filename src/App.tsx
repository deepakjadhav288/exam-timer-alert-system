/**
 * Exam Timer & Alert System - Main Application Component
 * 
 * This is the root component that orchestrates all exam-related features:
 * - Countdown timer with visual warnings
 * - Browser notifications and sound alerts
 * - Violation detection and logging
 * - Session summary upon completion
 */

import React from 'react';
import { useTimer, useNotifications, useTabTitle, useViolations } from './hooks';
import {
  ExamTimer,
  AlertSettings,
  ViolationPanel,
  ViolationLog,
  SessionSummary,
} from './components';
import './App.css';

/**
 * Main application component.
 * 
 * Implements all core requirements:
 * - Task 2: useTimer hook for timer logic
 * - Task 3: ExamTimer component with visual warnings
 * - Task 4: Alert system with notifications, sound, and tab title
 * - Task 5: Violation detection and logging system
 * - Task 6: Session summary screen when timer ends
 */
function App(): React.JSX.Element {
  // Initialize timer hook - state is lifted here for integration with other features
  const timer = useTimer();

  // Initialize notifications hook - handles browser notifications and sound
  const notifications = useNotifications({
    timeRemaining: timer.timeRemaining,
    status: timer.status,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
  });

  // Initialize violations hook - tracks proctoring violations
  const violations = useViolations();

  // Update tab title with remaining time
  useTabTitle({
    timeRemaining: timer.timeRemaining,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
  });

  // Determine if exam is active (for enabling violation buttons)
  const isExamActive = timer.isRunning || timer.isPaused;

  // Handle timer reset - also clear violations
  const handleRestart = () => {
    timer.reset();
    violations.clearViolations();
  };

  // Show session summary when timer is finished
  if (timer.isFinished) {
    return (
      <main className="app">
        <div className="app-container">
          {/* Header */}
          <header className="app-header">
            <h1 className="app-title">Exam Timer</h1>
            <p className="app-subtitle">Online Proctoring System</p>
          </header>

          {/* Session Summary */}
          <SessionSummary
            timeRemaining={timer.timeRemaining}
            violations={violations.violations}
            countByType={violations.countByType}
            onRestart={handleRestart}
          />
        </div>
      </main>
    );
  }

  // Show main exam interface
  return (
    <main className="app">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Exam Timer</h1>
          <p className="app-subtitle">Online Proctoring System</p>
        </header>

        {/* Timer Section */}
        <ExamTimer 
          timer={{
            ...timer,
            reset: handleRestart, // Override reset to also clear violations
          }} 
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
        />
      </div>
    </main>
  );
}

export default App;
