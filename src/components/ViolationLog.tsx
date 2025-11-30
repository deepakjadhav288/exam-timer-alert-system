/**
 * ViolationLog Component
 * 
 * Displays a timeline of all violations that occurred during the exam.
 * Shows timestamp, type, and icon for each violation.
 */

import React from 'react';
import { Violation, ViolationType, VIOLATION_LABELS } from '../types';
import { formatTimestamp } from '../utils';
import './ViolationLog.css';

interface ViolationLogProps {
  /** List of violations to display */
  violations: Violation[];
  /** Maximum number of items to show (0 = all) */
  maxItems?: number;
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
 * Timeline log of violations.
 */
export function ViolationLog({
  violations,
  maxItems = 0,
}: ViolationLogProps): React.JSX.Element {
  // Sort violations by timestamp (most recent first)
  const sortedViolations = [...violations].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Limit items if maxItems is specified
  const displayViolations = maxItems > 0
    ? sortedViolations.slice(0, maxItems)
    : sortedViolations;

  // Check if we're showing limited items
  const isLimited = maxItems > 0 && violations.length > maxItems;

  if (violations.length === 0) {
    return (
      <div className="violation-log violation-log--empty">
        <div className="violation-log__empty-state">
          <span className="violation-log__empty-icon">✓</span>
          <span className="violation-log__empty-text">
            No violations recorded
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="violation-log">
      <div className="violation-log__header">
        <h4 className="violation-log__title">
          Violation Timeline
          <span className="violation-log__count">
            ({violations.length})
          </span>
        </h4>
        {isLimited && (
          <span className="violation-log__hint">
            Showing {maxItems} most recent
          </span>
        )}
      </div>

      <ul className="violation-log__list" role="log" aria-label="Violation timeline">
        {displayViolations.map((violation, index) => (
          <li 
            key={violation.id} 
            className="violation-log__item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="violation-log__item-icon">
              {VIOLATION_ICONS[violation.type]}
            </span>
            <div className="violation-log__item-content">
              <span className="violation-log__item-type">
                {VIOLATION_LABELS[violation.type]}
              </span>
              <span className="violation-log__item-time">
                {formatTimestamp(violation.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViolationLog;
