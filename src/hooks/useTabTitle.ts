import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils';

interface UseTabTitleProps {
  timeRemaining: number;
  isRunning: boolean;
  isFinished: boolean;
}

interface UseTabTitleReturn {
  isTabHidden: boolean;
}

export function useTabTitle({
  timeRemaining,
  isRunning,
  isFinished,
}: UseTabTitleProps): UseTabTitleReturn {

  const originalTitleRef = useRef<string>(document.title);

  const [isTabHidden, setIsTabHidden] = useState<boolean>(document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);

      if (!document.hidden) {
        document.title = originalTitleRef.current;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isTabHidden) {
      return;
    }

    if (isFinished) {
      document.title = "⏰ Time's Up! - Exam Timer";
      return;
    }

    if (isRunning) {
      const timeDisplay = formatTime(timeRemaining);
      
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
