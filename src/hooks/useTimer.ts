/**
 * useTimer - Custom hook for managing exam countdown timer
 * 
 * Features:
 * - Countdown from configurable duration
 * - Pause/Resume functionality
 * - Automatic status updates based on configurable thresholds
 * - Clean interval cleanup on unmount
 * 
 * @example
 * const timer = useTimer({ duration: 45, warningAt: 5, criticalAt: 1 });
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerState,
  TimerStatus,
  UseTimerReturn,
  DEFAULT_EXAM_DURATION,
} from '../types';

interface UseTimerConfig {
  /** Exam duration in minutes */
  duration?: number;
  /** Warning threshold in minutes */
  warningAt?: number;
  /** Critical threshold in minutes */
  criticalAt?: number;
}

/**
 * Determines the timer status based on remaining time and thresholds.
 */
function getTimerStatus(
  timeRemaining: number,
  warningThreshold: number,
  criticalThreshold: number
): TimerStatus {
  if (timeRemaining <= criticalThreshold) {
    return 'critical';
  }
  if (timeRemaining <= warningThreshold) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Custom hook for exam timer functionality.
 * 
 * @param config - Timer configuration (duration and thresholds in minutes)
 * @returns Timer state and control actions
 */
export function useTimer(config: UseTimerConfig = {}): UseTimerReturn {
  const {
    duration = DEFAULT_EXAM_DURATION / 60, // Convert default seconds to minutes
    warningAt = 5,
    criticalAt = 1,
  } = config;

  // Convert minutes to seconds for internal use
  const initialDuration = duration * 60;
  const warningThreshold = warningAt * 60;
  const criticalThreshold = criticalAt * 60;

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------
  
  const [timerState, setTimerState] = useState<TimerState>(() => ({
    timeRemaining: initialDuration,
    isRunning: false,
    isPaused: false,
    isFinished: false,
    status: getTimerStatus(initialDuration, warningThreshold, criticalThreshold),
  }));

  // Ref to store interval ID - prevents stale closure issues
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track if component is mounted - prevents state updates after unmount
  const isMountedRef = useRef<boolean>(true);

  // Store thresholds in refs to avoid stale closures
  const warningThresholdRef = useRef(warningThreshold);
  const criticalThresholdRef = useRef(criticalThreshold);

  // Update refs when thresholds change
  useEffect(() => {
    warningThresholdRef.current = warningThreshold;
    criticalThresholdRef.current = criticalThreshold;
  }, [warningThreshold, criticalThreshold]);

  // -------------------------------------------------------------------------
  // Interval Management
  // -------------------------------------------------------------------------

  /**
   * Clears the active interval if one exists.
   */
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Starts the countdown interval.
   */
  const startInterval = useCallback(() => {
    clearTimerInterval();

    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      setTimerState((prev) => {
        if (prev.timeRemaining <= 0) {
          clearTimerInterval();
          return {
            ...prev,
            isRunning: false,
            isFinished: true,
          };
        }

        const newTimeRemaining = prev.timeRemaining - 1;
        const newStatus = getTimerStatus(
          newTimeRemaining,
          warningThresholdRef.current,
          criticalThresholdRef.current
        );

        if (newTimeRemaining <= 0) {
          clearTimerInterval();
          return {
            ...prev,
            timeRemaining: 0,
            isRunning: false,
            isFinished: true,
            status: 'critical',
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          status: newStatus,
        };
      });
    }, 1000);
  }, [clearTimerInterval]);

  // -------------------------------------------------------------------------
  // Timer Actions
  // -------------------------------------------------------------------------

  /**
   * Starts the timer or resumes from paused state.
   */
  const start = useCallback(() => {
    setTimerState((prev) => {
      if (prev.isFinished) return prev;
      if (prev.isRunning && !prev.isPaused) return prev;

      return {
        ...prev,
        isRunning: true,
        isPaused: false,
      };
    });
  }, []);

  /**
   * Pauses the timer, preserving current time.
   */
  const pause = useCallback(() => {
    clearTimerInterval();
    
    setTimerState((prev) => {
      if (!prev.isRunning || prev.isFinished) return prev;

      return {
        ...prev,
        isRunning: false,
        isPaused: true,
      };
    });
  }, [clearTimerInterval]);

  /**
   * Toggles between running and paused states.
   */
  const toggle = useCallback(() => {
    setTimerState((prev) => {
      if (prev.isFinished) return prev;
      
      if (prev.isRunning) {
        clearTimerInterval();
        return {
          ...prev,
          isRunning: false,
          isPaused: true,
        };
      } else {
        return {
          ...prev,
          isRunning: true,
          isPaused: false,
        };
      }
    });
  }, [clearTimerInterval]);

  /**
   * Resets the timer to initial duration.
   */
  const reset = useCallback(() => {
    clearTimerInterval();
    
    setTimerState({
      timeRemaining: initialDuration,
      isRunning: false,
      isPaused: false,
      isFinished: false,
      status: getTimerStatus(initialDuration, warningThreshold, criticalThreshold),
    });
  }, [initialDuration, warningThreshold, criticalThreshold, clearTimerInterval]);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  /**
   * Effect to start/stop interval based on running state.
   */
  useEffect(() => {
    if (timerState.isRunning && !timerState.isFinished) {
      startInterval();
    }
    
    return () => {
      clearTimerInterval();
    };
  }, [timerState.isRunning, timerState.isFinished, startInterval, clearTimerInterval]);

  /**
   * Cleanup effect - marks component as unmounted.
   */
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  /**
   * Update timer when duration changes (only if not started).
   */
  useEffect(() => {
    if (!timerState.isRunning && !timerState.isPaused && !timerState.isFinished) {
      setTimerState({
        timeRemaining: initialDuration,
        isRunning: false,
        isPaused: false,
        isFinished: false,
        status: getTimerStatus(initialDuration, warningThreshold, criticalThreshold),
      });
    }
  }, [initialDuration, warningThreshold, criticalThreshold, timerState.isRunning, timerState.isPaused, timerState.isFinished]);

  // -------------------------------------------------------------------------
  // Return Value
  // -------------------------------------------------------------------------

  return {
    timeRemaining: timerState.timeRemaining,
    isRunning: timerState.isRunning,
    isPaused: timerState.isPaused,
    isFinished: timerState.isFinished,
    status: timerState.status,
    start,
    pause,
    toggle,
    reset,
  };
}

export default useTimer;
