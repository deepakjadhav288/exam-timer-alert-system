/**
 * useNotifications - Custom hook for browser notifications
 * 
 * Manages browser notification permissions and triggers notifications
 * at configurable time thresholds.
 * 
 * Features:
 * - Permission request handling
 * - Notification cooldown to prevent spam
 * - Sound alerts (optional)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertConfig, TimerStatus } from '../types';
import { isNotificationSupported } from '../utils';

interface UseNotificationsProps {
  /** Current remaining time in seconds */
  timeRemaining: number;
  /** Current timer status */
  status: TimerStatus;
  /** Whether the timer is running */
  isRunning: boolean;
  /** Whether the timer has finished */
  isFinished: boolean;
  /** Warning threshold in seconds */
  warningThreshold: number;
  /** Critical threshold in seconds */
  criticalThreshold: number;
}

interface UseNotificationsReturn {
  /** Current alert configuration */
  config: AlertConfig;
  /** Request notification permission from browser */
  requestPermission: () => Promise<void>;
  /** Toggle sound alerts on/off */
  toggleSound: () => void;
  /** Whether notifications are supported in this browser */
  isSupported: boolean;
}

/**
 * Custom hook for managing browser notifications and sound alerts.
 */
export function useNotifications({
  timeRemaining,
  status,
  isRunning,
  isFinished,
  warningThreshold,
  criticalThreshold,
}: UseNotificationsProps): UseNotificationsReturn {
  // Check if notifications are supported
  const isSupported = isNotificationSupported();

  // Get initial permission status
  const getInitialPermission = (): boolean => {
    return isSupported && Notification.permission === 'granted';
  };

  // Track notification permission and settings
  const [config, setConfig] = useState<AlertConfig>(() => {
    const granted = getInitialPermission();
    return {
      notificationsEnabled: granted, // Enable if already granted
      soundEnabled: true,
      permissionGranted: granted,
    };
  });

  // Track which alerts have been shown (to prevent duplicates)
  const alertsShownRef = useRef<Set<string>>(new Set());
  
  // Track previous time to detect threshold crossings
  const prevTimeRef = useRef<number>(timeRemaining);

  /**
   * Play alert sound using Web Audio API.
   */
  const playAlertSound = useCallback(() => {
    if (!config.soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  }, [config.soundEnabled]);

  /**
   * Request notification permission from browser.
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setConfig(prev => ({
        ...prev,
        permissionGranted: granted,
        notificationsEnabled: granted,
      }));
      
      // Show a test notification if granted
      if (granted) {
        new Notification('✅ Notifications Enabled', {
          body: 'You will receive alerts at warning and critical times.',
          icon: '/favicon.ico',
        });
      }
    } catch (error) {
      console.warn('Could not request notification permission:', error);
    }
  }, [isSupported]);

  /**
   * Toggle sound alerts on/off.
   */
  const toggleSound = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  /**
   * Show a browser notification.
   */
  const showNotification = useCallback((title: string, body: string) => {
    if (!config.permissionGranted) {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `exam-timer-${Date.now()}`, // Unique tag to allow multiple notifications
        requireInteraction: false,
      });

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.warn('Could not show notification:', error);
    }
  }, [config.permissionGranted]);

  /**
   * Effect to trigger alerts at specific thresholds.
   * Uses threshold crossing detection for more reliable triggering.
   */
  useEffect(() => {
    if (!isRunning || isFinished) {
      prevTimeRef.current = timeRemaining;
      return;
    }

    const prevTime = prevTimeRef.current;
    
    // Check for warning threshold crossing (went from above to at/below)
    if (
      prevTime > warningThreshold &&
      timeRemaining <= warningThreshold &&
      !alertsShownRef.current.has('warning')
    ) {
      alertsShownRef.current.add('warning');
      const mins = Math.floor(warningThreshold / 60);
      showNotification(
        `⏰ ${mins} Minute${mins > 1 ? 's' : ''} Remaining`,
        `You have ${mins} minute${mins > 1 ? 's' : ''} left to complete your exam.`
      );
    }

    // Check for critical threshold crossing
    if (
      prevTime > criticalThreshold &&
      timeRemaining <= criticalThreshold &&
      !alertsShownRef.current.has('critical')
    ) {
      alertsShownRef.current.add('critical');
      const mins = Math.floor(criticalThreshold / 60);
      const secs = criticalThreshold % 60;
      const timeStr = mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : `${secs} seconds`;
      showNotification(
        `⚠️ ${timeStr} Remaining!`,
        `Only ${timeStr} left! Please submit your exam soon.`
      );
      playAlertSound();
    }

    // Timer finished
    if (
      prevTime > 0 &&
      timeRemaining === 0 &&
      !alertsShownRef.current.has('finished')
    ) {
      alertsShownRef.current.add('finished');
      showNotification(
        "🔔 Time's Up!",
        'Your exam time has ended.'
      );
      playAlertSound();
    }

    // Update previous time
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, isRunning, isFinished, warningThreshold, criticalThreshold, showNotification, playAlertSound]);

  /**
   * Reset alerts when timer is reset.
   */
  useEffect(() => {
    if (!isRunning && !isFinished && timeRemaining > warningThreshold) {
      alertsShownRef.current.clear();
      prevTimeRef.current = timeRemaining;
    }
  }, [timeRemaining, isRunning, isFinished, warningThreshold]);

  /**
   * Sync permission status on mount and when tab becomes visible.
   */
  useEffect(() => {
    const checkPermission = () => {
      const granted = getInitialPermission();
      setConfig(prev => {
        if (prev.permissionGranted !== granted) {
          return {
            ...prev,
            permissionGranted: granted,
            notificationsEnabled: granted,
          };
        }
        return prev;
      });
    };

    // Check on visibility change (user might have changed permission in browser settings)
    document.addEventListener('visibilitychange', checkPermission);
    
    return () => {
      document.removeEventListener('visibilitychange', checkPermission);
    };
  }, []);

  return {
    config,
    requestPermission,
    toggleSound,
    isSupported,
  };
}

export default useNotifications;
