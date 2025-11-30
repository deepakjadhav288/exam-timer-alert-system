/**
 * Exam Timer & Alert System - Main Application Component
 * 
 * This is the root component that orchestrates all exam-related features:
 * - Countdown timer with visual warnings
 * - Browser notifications and sound alerts
 * - Violation detection and logging (coming in Task 5)
 * - Session summary upon completion (coming in Task 6)
 */

import React from 'react';
import { useTimer, useNotifications, useTabTitle } from './hooks';
import { ExamTimer, AlertSettings } from './components';
import './App.css';

/**
 * Main application component.
 * 
 * Currently implements:
 * - Task 2: useTimer hook for timer logic
 * - Task 3: ExamTimer component with visual warnings
 * - Task 4: Alert system with notifications, sound, and tab title
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

  // Update tab title with remaining time
  useTabTitle({
    timeRemaining: timer.timeRemaining,
    isRunning: timer.isRunning,
    isFinished: timer.isFinished,
  });

  return (
    <main className="app">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Exam Timer</h1>
          <p className="app-subtitle">Online Proctoring System</p>
        </header>

        {/* Timer Section */}
        <ExamTimer timer={timer} />

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
