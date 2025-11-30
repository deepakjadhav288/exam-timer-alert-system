/**
 * useTabTitle - Custom hook for dynamic tab title updates
 * 
 * Updates the browser tab title with remaining time when:
 * - Timer is running
 * - Tab is inactive (user switched to another tab)
 * 
 * Restores the original title when timer stops or tab becomes active.
 */

import { useEffect, useRef } from 'react';
import { formatTime } from '../utils';

interface UseTabTitleProps {
  /** Current remaining time in seconds */
  timeRemaining: number;
  /** Whether the timer is running */
  isRunning: boolean;
  /** Whether the timer has finished */
  isFinished: boolean;
}

/**
 * Custom hook for updating browser tab title with timer status.
 */
export function useTabTitle({
  timeRemaining,
  isRunning,
  isFinished,
}: UseTabTitleProps): void {
  // Store the original page title
  const originalTitleRef = useRef<string>(document.title);
  
  // Track if tab is visible
  const isVisibleRef = useRef<boolean>(!document.hidden);

  /**
   * Effect to handle visibility change events.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Effect to update tab title based on timer state.
   */
  useEffect(() => {
    // Restore original title if timer is not running
    if (!isRunning && !isFinished) {
      document.title = originalTitleRef.current;
      return;
    }

    // Show "Time's Up!" when finished
    if (isFinished) {
      document.title = "⏰ Time's Up! - Exam Timer";
      return;
    }

    // Update title with remaining time when timer is running
    if (isRunning) {
      const timeDisplay = formatTime(timeRemaining);
      
      // Add warning emoji for low time
      if (timeRemaining <= 60) {
        document.title = `⚠️ ${timeDisplay} - Exam Timer`;
      } else if (timeRemaining <= 300) {
        document.title = `⏰ ${timeDisplay} - Exam Timer`;
      } else {
        document.title = `${timeDisplay} - Exam Timer`;
      }
    }
  }, [timeRemaining, isRunning, isFinished]);

  /**
   * Cleanup: Restore original title on unmount.
   */
  useEffect(() => {
    return () => {
      document.title = originalTitleRef.current;
    };
  }, []);
}

export default useTabTitle;

