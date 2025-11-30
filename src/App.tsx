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
import { ExamTimer } from './components';
import './App.css';

/**
 * Main application component.
 * 
 * Currently implements:
 * - Task 2: useTimer hook for timer logic
 * - Task 3: ExamTimer component with visual warnings
 */
function App(): React.JSX.Element {
  // Initialize timer hook - state is lifted here for integration with other features
  const timer = useTimer();

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
      </div>
    </main>
  );
}

export default App;
