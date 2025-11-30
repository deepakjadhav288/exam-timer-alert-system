/**
 * ExamConfig Component
 * 
 * Configuration panel for exam settings.
 * Allows setting total time and alert thresholds.
 * Settings are locked once the exam has started.
 */

import React from 'react';
import './ExamConfig.css';

interface ExamConfigProps {
  /** Total exam duration in minutes */
  duration: number;
  /** Warning threshold in minutes */
  warningAt: number;
  /** Critical threshold in minutes */
  criticalAt: number;
  /** Whether the exam has started (locks settings) */
  isLocked: boolean;
  /** Handler for duration change */
  onDurationChange: (minutes: number) => void;
  /** Handler for warning threshold change */
  onWarningChange: (minutes: number) => void;
  /** Handler for critical threshold change */
  onCriticalChange: (minutes: number) => void;
}

/**
 * Exam configuration panel with duration and alert settings.
 */
export function ExamConfig({
  duration,
  warningAt,
  criticalAt,
  isLocked,
  onDurationChange,
  onWarningChange,
  onCriticalChange,
}: ExamConfigProps): React.JSX.Element {
  return (
    <div className={`exam-config ${isLocked ? 'exam-config--locked' : ''}`}>
      <div className="exam-config__header">
        <h3 className="exam-config__title">Exam Configuration</h3>
        {isLocked && (
          <span className="exam-config__locked-badge">
            🔒 Locked
          </span>
        )}
      </div>

      {isLocked && (
        <p className="exam-config__locked-msg">
          Settings cannot be changed after exam starts.
        </p>
      )}

      <div className="exam-config__fields">
        {/* Total Duration */}
        <div className="exam-config__field">
          <label className="exam-config__label" htmlFor="exam-duration">
            <span className="exam-config__label-icon">⏱️</span>
            <span className="exam-config__label-text">
              Total Time
              <span className="exam-config__label-hint">Exam duration</span>
            </span>
          </label>
          <div className="exam-config__input-group">
            <input
              id="exam-duration"
              type="number"
              className="exam-config__input"
              value={duration}
              onChange={(e) => onDurationChange(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={180}
              disabled={isLocked}
              aria-describedby="duration-unit"
            />
            <span id="duration-unit" className="exam-config__unit">min</span>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="exam-config__field">
          <label className="exam-config__label" htmlFor="warning-threshold">
            <span className="exam-config__label-icon">⏰</span>
            <span className="exam-config__label-text">
              Warning Alert
              <span className="exam-config__label-hint">Yellow warning</span>
            </span>
          </label>
          <div className="exam-config__input-group">
            <input
              id="warning-threshold"
              type="number"
              className="exam-config__input"
              value={warningAt}
              onChange={(e) => onWarningChange(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={duration - 1}
              disabled={isLocked}
              aria-describedby="warning-unit"
            />
            <span id="warning-unit" className="exam-config__unit">min</span>
          </div>
        </div>

        {/* Critical Alert */}
        <div className="exam-config__field">
          <label className="exam-config__label" htmlFor="critical-threshold">
            <span className="exam-config__label-icon">⚠️</span>
            <span className="exam-config__label-text">
              Critical Alert
              <span className="exam-config__label-hint">Red alert + sound</span>
            </span>
          </label>
          <div className="exam-config__input-group">
            <input
              id="critical-threshold"
              type="number"
              className="exam-config__input"
              value={criticalAt}
              onChange={(e) => onCriticalChange(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={warningAt - 1}
              disabled={isLocked}
              aria-describedby="critical-unit"
            />
            <span id="critical-unit" className="exam-config__unit">min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamConfig;

