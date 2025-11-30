/**
 * useViolations - Custom hook for managing proctoring violation detection
 * 
 * Tracks simulated violations during an exam session:
 * - Multiple faces detected
 * - Tab switch detected
 * - Prohibited application detected
 * 
 * Each violation is logged with timestamp and type for later review.
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Violation,
  ViolationType,
  ViolationState,
  VIOLATION_LABELS,
} from '../types';
import { generateId } from '../utils';

interface UseViolationsReturn extends ViolationState {
  /** Log a new violation of the specified type */
  addViolation: (type: ViolationType) => void;
  /** Clear all violations (for reset) */
  clearViolations: () => void;
  /** Get violations grouped by type */
  getViolationsByType: () => Record<ViolationType, Violation[]>;
}

/**
 * Custom hook for managing violation detection and logging.
 */
export function useViolations(): UseViolationsReturn {
  // Store all violations
  const [violations, setViolations] = useState<Violation[]>([]);

  /**
   * Add a new violation to the log.
   */
  const addViolation = useCallback((type: ViolationType) => {
    const newViolation: Violation = {
      id: generateId(),
      type,
      timestamp: new Date(),
      message: VIOLATION_LABELS[type],
    };

    setViolations(prev => [...prev, newViolation]);
  }, []);

  /**
   * Clear all violations (used when resetting the exam).
   */
  const clearViolations = useCallback(() => {
    setViolations([]);
  }, []);

  /**
   * Count violations by type.
   */
  const countByType = useMemo((): Record<ViolationType, number> => {
    const counts: Record<ViolationType, number> = {
      MULTIPLE_FACES: 0,
      TAB_SWITCH: 0,
      PROHIBITED_APP: 0,
    };

    violations.forEach(violation => {
      counts[violation.type]++;
    });

    return counts;
  }, [violations]);

  /**
   * Get violations grouped by type.
   */
  const getViolationsByType = useCallback((): Record<ViolationType, Violation[]> => {
    const grouped: Record<ViolationType, Violation[]> = {
      MULTIPLE_FACES: [],
      TAB_SWITCH: [],
      PROHIBITED_APP: [],
    };

    violations.forEach(violation => {
      grouped[violation.type].push(violation);
    });

    return grouped;
  }, [violations]);

  /**
   * Total violation count.
   */
  const totalCount = violations.length;

  return {
    violations,
    countByType,
    totalCount,
    addViolation,
    clearViolations,
    getViolationsByType,
  };
}

export default useViolations;

