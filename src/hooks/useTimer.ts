import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerState,
  TimerStatus,
  UseTimerReturn,
  DEFAULT_EXAM_DURATION,
} from '../types';

interface UseTimerConfig {
  duration?: number;
  warningAt?: number;
  criticalAt?: number;
}

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

export function useTimer(config: UseTimerConfig = {}): UseTimerReturn {
  const {
    duration = DEFAULT_EXAM_DURATION / 60,
    warningAt = 5,
    criticalAt = 1,
  } = config;

  const initialDuration = duration * 60;
  const warningThreshold = warningAt * 60;
  const criticalThreshold = criticalAt * 60;

  const [timerState, setTimerState] = useState<TimerState>(() => ({
    timeRemaining: initialDuration,
    isRunning: false,
    isPaused: false,
    isFinished: false,
    status: getTimerStatus(initialDuration, warningThreshold, criticalThreshold),
  }));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const isMountedRef = useRef<boolean>(true);

  const warningThresholdRef = useRef(warningThreshold);
  const criticalThresholdRef = useRef(criticalThreshold);

  useEffect(() => {
    warningThresholdRef.current = warningThreshold;
    criticalThresholdRef.current = criticalThreshold;
  }, [warningThreshold, criticalThreshold]);


  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);


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


  useEffect(() => {
    if (timerState.isRunning && !timerState.isFinished) {
      startInterval();
    }
    
    return () => {
      clearTimerInterval();
    };
  }, [timerState.isRunning, timerState.isFinished, startInterval, clearTimerInterval]);


  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearTimerInterval();
    };
  }, [clearTimerInterval]);


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
