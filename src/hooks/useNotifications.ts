import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertConfig, TimerStatus } from '../types';
import { isNotificationSupported } from '../utils';

interface UseNotificationsProps {
  timeRemaining: number;
  status: TimerStatus;
  isRunning: boolean;
  isFinished: boolean;
  warningThreshold: number;
  criticalThreshold: number;
}

interface UseNotificationsReturn {
  config: AlertConfig;
  requestPermission: () => Promise<void>;
  toggleSound: () => void;
  isSupported: boolean;
}

export function useNotifications({
  timeRemaining,
  status,
  isRunning,
  isFinished,
  warningThreshold,
  criticalThreshold,
}: UseNotificationsProps): UseNotificationsReturn {
  const isSupported = isNotificationSupported();

  const getInitialPermission = (): boolean => {
    return isSupported && Notification.permission === 'granted';
  };

  const [config, setConfig] = useState<AlertConfig>(() => {
    const granted = getInitialPermission();
    return {
      notificationsEnabled: granted,
      soundEnabled: true,
      permissionGranted: granted,
    };
  });

  const alertsShownRef = useRef<Set<string>>(new Set());

  const prevTimeRef = useRef<number>(timeRemaining);

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

  const toggleSound = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

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

  useEffect(() => {
    if (!isRunning || isFinished) {
      prevTimeRef.current = timeRemaining;
      return;
    }

    const prevTime = prevTimeRef.current;

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
