/**
 * useTimer Hook Tests
 * 
 * Tests for the exam timer hook functionality.
 * Uses React Testing Library's renderHook for hook testing.
 */

import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../../hooks/useTimer';

// Mock timers for controlled testing
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useTimer', () => {
  describe('Initial State', () => {
    it('initializes with default 45 minute duration', () => {
      const { result } = renderHook(() => useTimer());
      
      expect(result.current.timeRemaining).toBe(2700); // 45 * 60
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isFinished).toBe(false);
      expect(result.current.status).toBe('normal');
    });

    it('initializes with custom duration', () => {
      const { result } = renderHook(() => useTimer({ duration: 10 }));
      
      expect(result.current.timeRemaining).toBe(600); // 10 * 60
    });

    it('calculates correct initial status based on thresholds', () => {
      // Duration less than warning threshold
      const { result } = renderHook(() => 
        useTimer({ duration: 3, warningAt: 5, criticalAt: 1 })
      );
      
      expect(result.current.status).toBe('warning');
    });

    it('shows critical status if duration is below critical threshold', () => {
      const { result } = renderHook(() => 
        useTimer({ duration: 0.5, warningAt: 5, criticalAt: 1 })
      );
      
      expect(result.current.status).toBe('critical');
    });
  });

  describe('Timer Controls', () => {
    it('starts the timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);
    });

    it('pauses the timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      act(() => {
        result.current.start();
      });
      
      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(true);
    });

    it('toggles between running and paused', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      // Start
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);

      // Pause
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(true);

      // Resume
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);
    });

    it('resets the timer to initial state', () => {
      const { result } = renderHook(() => useTimer({ duration: 5 }));
      
      // Start and let some time pass
      act(() => {
        result.current.start();
      });
      
      act(() => {
        jest.advanceTimersByTime(10000); // 10 seconds
      });

      expect(result.current.timeRemaining).toBe(290); // 5*60 - 10

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.timeRemaining).toBe(300); // Back to 5 minutes
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isFinished).toBe(false);
    });
  });

  describe('Countdown Behavior', () => {
    it('decrements time every second while running', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      act(() => {
        result.current.start();
      });

      expect(result.current.timeRemaining).toBe(60);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.timeRemaining).toBe(59);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.timeRemaining).toBe(58);
    });

    it('stops at 0 and sets isFinished', () => {
      const { result } = renderHook(() => 
        useTimer({ duration: 0.1, warningAt: 0.05, criticalAt: 0.02 }) // 6 seconds
      );
      
      act(() => {
        result.current.start();
      });

      // Advance past all time
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.isFinished).toBe(true);
      expect(result.current.isRunning).toBe(false);
    });

    it('does not decrement when paused', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current.timeRemaining).toBe(57);

      act(() => {
        result.current.pause();
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      // Time should not have changed while paused
      expect(result.current.timeRemaining).toBe(57);
    });
  });

  describe('Status Updates', () => {
    it('updates status to warning when crossing threshold', () => {
      // 6 minutes, warning at 5
      const { result } = renderHook(() => 
        useTimer({ duration: 6, warningAt: 5, criticalAt: 1 })
      );
      
      expect(result.current.status).toBe('normal');

      act(() => {
        result.current.start();
      });

      // Advance 61 seconds (to get below 5 min)
      act(() => {
        jest.advanceTimersByTime(61000);
      });

      expect(result.current.status).toBe('warning');
    });

    it('updates status to critical when crossing threshold', () => {
      // 2 minutes, critical at 1
      const { result } = renderHook(() => 
        useTimer({ duration: 2, warningAt: 1.5, criticalAt: 1 })
      );

      act(() => {
        result.current.start();
      });

      // Advance 61 seconds (to get below 1 min)
      act(() => {
        jest.advanceTimersByTime(61000);
      });

      expect(result.current.status).toBe('critical');
    });
  });

  describe('Edge Cases', () => {
    it('does not start if already running', () => {
      const { result } = renderHook(() => useTimer({ duration: 1 }));
      
      act(() => {
        result.current.start();
      });

      const timeAfterStart = result.current.timeRemaining;

      act(() => {
        result.current.start(); // Try to start again
      });

      expect(result.current.timeRemaining).toBe(timeAfterStart);
    });

    it('does not allow actions after finished', () => {
      const { result } = renderHook(() => 
        useTimer({ duration: 0.05, warningAt: 0.03, criticalAt: 0.01 }) // 3 seconds
      );
      
      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.isFinished).toBe(true);

      // Try to start again - should not work
      act(() => {
        result.current.start();
      });

      expect(result.current.isFinished).toBe(true);
      expect(result.current.isRunning).toBe(false);
    });

    it('handles custom thresholds correctly', () => {
      const { result } = renderHook(() => 
        useTimer({ duration: 30, warningAt: 10, criticalAt: 3 })
      );
      
      expect(result.current.timeRemaining).toBe(1800); // 30 min
      expect(result.current.status).toBe('normal');

      act(() => {
        result.current.start();
      });

      // Advance to just above warning (10 min + 1 sec remaining)
      act(() => {
        jest.advanceTimersByTime(1199000); // 19:59
      });
      expect(result.current.status).toBe('normal');

      // Cross into warning
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.status).toBe('warning');
    });
  });
});

