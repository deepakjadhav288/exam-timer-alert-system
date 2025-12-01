/**
 * ViolationPanel Component
 * 
 * Provides simulation buttons for proctoring violations.
 * In a real application, these would be triggered automatically
 * by webcam/screen monitoring systems.
 */

import React from 'react';
import { ViolationType, VIOLATION_LABELS } from '../../types';
import { ViolationBadge } from './ViolationBadge';
import './ViolationPanel.css';

interface ViolationPanelProps {
  /** Total violation count */
  totalCount: number;
  /** Violation counts by type */
  countByType: Record<ViolationType, number>;
  /** Handler to add a violation */
  onViolation: (type: ViolationType) => void;
  /** Whether the exam is active (timer running or paused) */
  isExamActive: boolean;
}

/**
 * Violation type configurations with icons and colors.
 */
const VIOLATION_CONFIG: Record<ViolationType, { icon: string; color: string }> = {
  MULTIPLE_FACES: { icon: '👥', color: '#ef4444' },
  TAB_SWITCH: { icon: '🔄', color: '#f59e0b' },
  PROHIBITED_APP: { icon: '🚫', color: '#8b5cf6' },
};

/**
 * Panel for simulating proctoring violations.
 */
export function ViolationPanel({
  totalCount,
  countByType,
  onViolation,
  isExamActive,
}: ViolationPanelProps): React.JSX.Element {
  const violationTypes: ViolationType[] = [
    'MULTIPLE_FACES',
    'TAB_SWITCH',
    'PROHIBITED_APP',
  ];

  return (
    <div className="violation-panel">
      {/* Header with Badge */}
      <div className="violation-panel__header">
        <h3 className="violation-panel__title">
          Violation Simulation
        </h3>
        <ViolationBadge count={totalCount} />
      </div>

      <p className="violation-panel__desc">
        Click <span className="violation-panel__plus-hint">+</span> to simulate a proctoring violation.
        {!isExamActive && (
          <span className="violation-panel__hint">
            {' '}Start the exam to enable.
          </span>
        )}
      </p>

      {/* Violation Buttons */}
      <div className="violation-panel__buttons">
        {violationTypes.map(type => {
          const config = VIOLATION_CONFIG[type];
          const count = countByType[type];

          return (
            <button
              key={type}
              className="violation-panel__btn"
              onClick={() => onViolation(type)}
              disabled={!isExamActive}
              aria-label={`Add ${VIOLATION_LABELS[type]} violation`}
              style={{
                '--violation-color': config.color,
              } as React.CSSProperties}
            >
              {/* Plus Icon - indicates "add" action */}
              <span className="violation-panel__btn-add" aria-hidden="true">
                +
              </span>
              
              {/* Violation Type Icon */}
              <span className="violation-panel__btn-icon">
                {config.icon}
              </span>
              
              {/* Label */}
              <span className="violation-panel__btn-text">
                {VIOLATION_LABELS[type]}
              </span>
              
              {/* Count Badge */}
              {count > 0 && (
                <span className="violation-panel__btn-count">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ViolationPanel;
