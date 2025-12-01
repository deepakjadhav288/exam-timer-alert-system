import { useState, useCallback, useMemo } from 'react';
import {
  Violation,
  ViolationType,
  ViolationState,
  VIOLATION_LABELS,
} from '../types';
import { generateId } from '../utils';

interface UseViolationsReturn extends ViolationState {
  addViolation: (type: ViolationType) => void;
  clearViolations: () => void;
  getViolationsByType: () => Record<ViolationType, Violation[]>;
}

export function useViolations(): UseViolationsReturn {
  const [violations, setViolations] = useState<Violation[]>([]);

  const addViolation = useCallback((type: ViolationType) => {
    const newViolation: Violation = {
      id: generateId(),
      type,
      timestamp: new Date(),
      message: VIOLATION_LABELS[type],
    };

    setViolations(prev => [...prev, newViolation]);
  }, []);

  const clearViolations = useCallback(() => {
    setViolations([]);
  }, []);


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

