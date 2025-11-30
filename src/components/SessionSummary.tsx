/**
 * SessionSummary Component
 * 
 * Displays the exam session summary when the timer ends.
 * Shows total time taken, violations by type, and violation timeline.
 */

import React from 'react';
import {
  Violation,
  ViolationType,
  VIOLATION_LABELS,
} from '../types';
import { formatTime, formatTimestamp } from '../utils';
import './SessionSummary.css';

interface SessionSummaryProps {
  /** Time remaining when exam ended (0 if completed) */
  timeRemaining: number;
  /** Total exam duration in seconds (configured by user) */
  totalDuration: number;
  /** All violations that occurred */
  violations: Violation[];
  /** Violations grouped by type */
  countByType: Record<ViolationType, number>;
  /** Handler to restart the exam */
  onRestart: () => void;
}

/**
 * Icon mapping for violation types.
 */
const VIOLATION_ICONS: Record<ViolationType, string> = {
  MULTIPLE_FACES: '👥',
  TAB_SWITCH: '🔄',
  PROHIBITED_APP: '🚫',
};

/**
 * Session summary displayed when exam ends.
 */
export function SessionSummary({
  timeRemaining,
  totalDuration,
  violations,
  countByType,
  onRestart,
}: SessionSummaryProps): React.JSX.Element {
  // Calculate time spent using actual configured duration
  const timeSpent = totalDuration - timeRemaining;
  const totalViolations = violations.length;

  // Determine if exam was completed (timer reached 0)
  const wasCompleted = timeRemaining === 0;

  // Sort violations by timestamp for timeline
  const sortedViolations = [...violations].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Get violation types
  const violationTypes: ViolationType[] = ['MULTIPLE_FACES', 'TAB_SWITCH', 'PROHIBITED_APP'];

  return (
    <div className="session-summary">
      {/* Header */}
      <div className="session-summary__header">
        <div className="session-summary__icon">
          {wasCompleted ? '⏰' : '✅'}
        </div>
        <h2 className="session-summary__title">
          {wasCompleted ? "Time's Up!" : 'Exam Completed'}
        </h2>
        <p className="session-summary__subtitle">
          Here's your session summary
        </p>
      </div>

      {/* Stats Cards */}
      <div className="session-summary__stats">
        {/* Time Spent */}
        <div className="session-summary__stat-card">
          <span className="session-summary__stat-icon">⏱️</span>
          <div className="session-summary__stat-content">
            <span className="session-summary__stat-value">
              {formatTime(timeSpent)}
            </span>
            <span className="session-summary__stat-label">
              Time Spent
            </span>
          </div>
        </div>

        {/* Total Violations */}
        <div className={`session-summary__stat-card ${totalViolations > 0 ? 'session-summary__stat-card--warning' : 'session-summary__stat-card--success'}`}>
          <span className="session-summary__stat-icon">
            {totalViolations > 0 ? '⚠️' : '✓'}
          </span>
          <div className="session-summary__stat-content">
            <span className="session-summary__stat-value">
              {totalViolations}
            </span>
            <span className="session-summary__stat-label">
              {totalViolations === 1 ? 'Violation' : 'Violations'}
            </span>
          </div>
        </div>
      </div>

      {/* Violations by Type */}
      {totalViolations > 0 && (
        <div className="session-summary__section">
          <h3 className="session-summary__section-title">
            Violations by Type
          </h3>
          <div className="session-summary__violations-grid">
            {violationTypes.map(type => (
              <div 
                key={type}
                className={`session-summary__violation-type ${countByType[type] > 0 ? 'session-summary__violation-type--active' : ''}`}
              >
                <span className="session-summary__violation-icon">
                  {VIOLATION_ICONS[type]}
                </span>
                <span className="session-summary__violation-count">
                  {countByType[type]}
                </span>
                <span className="session-summary__violation-label">
                  {VIOLATION_LABELS[type]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Violation Timeline */}
      {totalViolations > 0 && (
        <div className="session-summary__section">
          <h3 className="session-summary__section-title">
            Violation Timeline
          </h3>
          <div className="session-summary__timeline">
            {sortedViolations.map((violation, index) => (
              <div 
                key={violation.id}
                className="session-summary__timeline-item"
              >
                <div className="session-summary__timeline-marker">
                  <span className="session-summary__timeline-number">
                    {index + 1}
                  </span>
                </div>
                <div className="session-summary__timeline-content">
                  <div className="session-summary__timeline-header">
                    <span className="session-summary__timeline-icon">
                      {VIOLATION_ICONS[violation.type]}
                    </span>
                    <span className="session-summary__timeline-type">
                      {VIOLATION_LABELS[violation.type]}
                    </span>
                  </div>
                  <span className="session-summary__timeline-time">
                    {formatTimestamp(violation.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Violations Message */}
      {totalViolations === 0 && (
        <div className="session-summary__section">
          <div className="session-summary__clean-record">
            <span className="session-summary__clean-icon">🎉</span>
            <p className="session-summary__clean-text">
              Excellent! No violations were detected during your exam session.
            </p>
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="session-summary__actions">
        <button 
          className="session-summary__btn"
          onClick={onRestart}
          aria-label="Start a new exam session"
        >
          <span>🔄</span>
          Start New Session
        </button>
      </div>
    </div>
  );
}

export default SessionSummary;
