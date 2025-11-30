/**
 * useTimer - Custom hook for managing exam countdown timer
 * 
 * Features:
 * - Countdown from configurable duration (default: 45 minutes)
 * - Pause/Resume functionality
 * - Automatic status updates (normal → warning → critical)
 * - Clean interval cleanup on unmount
 * 
 * @example
 * const { timeRemaining, isRunning, isPaused, status, start, pause, toggle, reset } = useTimer();
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerState,
  TimerActions,
  UseTimerReturn,
  DEFAULT_EXAM_DURATION,
} from '../types';
import { getTimerStatus } from '../utils';

/**
 * Custom hook for exam timer functionality.
 * 
 * @param initialDuration - Starting duration in seconds (default: 45 minutes)
 * @returns Timer state and control actions
 */
export function useTimer(initialDuration: number = DEFAULT_EXAM_DURATION): UseTimerReturn {
  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------
  
  const [timerState, setTimerState] = useState<TimerState>(() => ({
    timeRemaining: initialDuration,
    isRunning: false,
    isPaused: false,
    isFinished: false,
    status: getTimerStatus(initialDuration),
  }));

  // Ref to store interval ID - prevents stale closure issues
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track if component is mounted - prevents state updates after unmount
  const isMountedRef = useRef<boolean>(true);

  // -------------------------------------------------------------------------
  // Interval Management
  // -------------------------------------------------------------------------

  /**
   * Clears the active interval if one exists.
   * Called on pause, reset, completion, and cleanup.
   */
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Starts the countdown interval.
   * Decrements time every second and updates status.
   */
  const startInterval = useCallback(() => {
    // Clear any existing interval first
    clearTimerInterval();

    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      setTimerState((prev) => {
        // Timer already finished
        if (prev.timeRemaining <= 0) {
          clearTimerInterval();
          return {
            ...prev,
            isRunning: false,
            isFinished: true,
          };
        }

        const newTimeRemaining = prev.timeRemaining - 1;
        const newStatus = getTimerStatus(newTimeRemaining);

        // Check if timer just finished
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
      // Don't start if already finished
      if (prev.isFinished) return prev;
      
      // Don't start if already running
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
      // Can only pause if running
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
        // Will pause
        clearTimerInterval();
        return {
          ...prev,
          isRunning: false,
          isPaused: true,
        };
      } else {
        // Will start/resume
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
      status: getTimerStatus(initialDuration),
    });
  }, [initialDuration, clearTimerInterval]);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  /**
   * Effect to start/stop interval based on running state.
   * This is the primary mechanism for timer operation.
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
   * Prevents state updates after component is destroyed.
   */
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  // -------------------------------------------------------------------------
  // Return Value
  // -------------------------------------------------------------------------

  return {
    // State
    timeRemaining: timerState.timeRemaining,
    isRunning: timerState.isRunning,
    isPaused: timerState.isPaused,
    isFinished: timerState.isFinished,
    status: timerState.status,
    // Actions
    start,
    pause,
    toggle,
    reset,
  };
}

export default useTimer;

