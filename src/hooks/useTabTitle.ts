/**
 * useTabTitle - Custom hook for dynamic tab title updates
 * 
 * Updates the browser tab title with remaining time ONLY when:
 * - Timer is running AND
 * - Tab is INACTIVE (user switched to another tab)
 * 
 * Restores the original title when tab becomes active again.
 */

import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils';

interface UseTabTitleProps {
  /** Current remaining time in seconds */
  timeRemaining: number;
  /** Whether the timer is running */
  isRunning: boolean;
  /** Whether the timer has finished */
  isFinished: boolean;
}

interface UseTabTitleReturn {
  /** Whether the tab is currently hidden/inactive */
  isTabHidden: boolean;
}

/**
 * Custom hook for updating browser tab title with timer status.
 * Only updates when tab is inactive (per requirements).
 */
export function useTabTitle({
  timeRemaining,
  isRunning,
  isFinished,
}: UseTabTitleProps): UseTabTitleReturn {
  // Store the original page title
  const originalTitleRef = useRef<string>(document.title);
  
  // Track if tab is hidden (inactive)
  const [isTabHidden, setIsTabHidden] = useState<boolean>(document.hidden);

  /**
   * Effect to handle visibility change events.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
      
      // Restore original title when tab becomes active
      if (!document.hidden) {
        document.title = originalTitleRef.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Effect to update tab title based on timer state.
   * Only updates when tab is INACTIVE (hidden).
   */
  useEffect(() => {
    // Only update title if tab is hidden
    if (!isTabHidden) {
      return;
    }

    // Show "Time's Up!" when finished (even if tab is hidden)
    if (isFinished) {
      document.title = "⏰ Time's Up! - Exam Timer";
      return;
    }

    // Update title with remaining time when timer is running AND tab is hidden
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
  }, [timeRemaining, isRunning, isFinished, isTabHidden]);

  /**
   * Cleanup: Restore original title on unmount.
   */
  useEffect(() => {
    return () => {
      document.title = originalTitleRef.current;
    };
  }, []);

  return {
    isTabHidden,
  };
}

export default useTabTitle;
