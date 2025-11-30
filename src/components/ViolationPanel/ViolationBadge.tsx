/**
 * ViolationBadge Component
 * 
 * Displays the total violation count as a badge.
 * Shows different styles based on count severity.
 */

import React from 'react';
import './ViolationBadge.css';

interface ViolationBadgeProps {
  /** Number of violations */
  count: number;
  /** Optional size variant */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Badge showing violation count with severity-based styling.
 */
export function ViolationBadge({
  count,
  size = 'medium',
}: ViolationBadgeProps): React.JSX.Element | null {
  // Don't render if no violations
  if (count === 0) {
    return (
      <span className={`violation-badge violation-badge--${size} violation-badge--empty`}>
        No Violations
      </span>
    );
  }

  // Determine severity based on count
  const getSeverity = (): 'low' | 'medium' | 'high' => {
    if (count >= 5) return 'high';
    if (count >= 3) return 'medium';
    return 'low';
  };

  return (
    <span 
      className={`violation-badge violation-badge--${size} violation-badge--${getSeverity()}`}
      aria-label={`${count} violation${count !== 1 ? 's' : ''}`}
    >
      <span className="violation-badge__icon">⚠️</span>
      <span className="violation-badge__count">{count}</span>
      <span className="violation-badge__label">
        Violation{count !== 1 ? 's' : ''}
      </span>
    </span>
  );
}

export default ViolationBadge;

