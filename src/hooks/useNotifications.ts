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
import { isNotificationSupported, formatTime } from '../utils';

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
  // Track notification permission and settings
  const [config, setConfig] = useState<AlertConfig>(() => ({
    notificationsEnabled: false,
    soundEnabled: true,
    permissionGranted: isNotificationSupported() && Notification.permission === 'granted',
  }));

  // Track which alerts have been shown (to prevent duplicates)
  const alertsShownRef = useRef<Set<string>>(new Set());
  
  // Audio reference for sound alerts
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if notifications are supported
  const isSupported = isNotificationSupported();

  /**
   * Initialize audio element for sound alerts.
   */
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
      setConfig(prev => ({
        ...prev,
        permissionGranted: permission === 'granted',
        notificationsEnabled: permission === 'granted',
      }));
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
    if (!config.permissionGranted || !config.notificationsEnabled) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'exam-timer-alert',
        requireInteraction: false,
      });

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.warn('Could not show notification:', error);
    }
  }, [config.permissionGranted, config.notificationsEnabled]);

  /**
   * Effect to trigger alerts at specific thresholds.
   */
  useEffect(() => {
    if (!isRunning || isFinished) return;

    // Warning alert
    if (
      timeRemaining === warningThreshold &&
      !alertsShownRef.current.has('warning')
    ) {
      alertsShownRef.current.add('warning');
      const mins = Math.floor(warningThreshold / 60);
      showNotification(
        `⏰ ${mins} Minute${mins > 1 ? 's' : ''} Remaining`,
        `You have ${mins} minute${mins > 1 ? 's' : ''} left to complete your exam.`
      );
    }

    // Critical alert
    if (
      timeRemaining === criticalThreshold &&
      !alertsShownRef.current.has('critical')
    ) {
      alertsShownRef.current.add('critical');
      const mins = Math.floor(criticalThreshold / 60);
      showNotification(
        `⚠️ ${mins} Minute${mins > 1 ? 's' : ''} Remaining!`,
        `Only ${mins} minute${mins > 1 ? 's' : ''} left! Please submit your exam soon.`
      );
      playAlertSound();
    }

    // Timer finished
    if (timeRemaining === 0 && !alertsShownRef.current.has('finished')) {
      alertsShownRef.current.add('finished');
      showNotification(
        "🔔 Time's Up!",
        'Your exam time has ended.'
      );
      playAlertSound();
    }
  }, [timeRemaining, isRunning, isFinished, warningThreshold, criticalThreshold, showNotification, playAlertSound]);

  /**
   * Reset alerts when timer is reset.
   */
  useEffect(() => {
    if (!isRunning && !isFinished && timeRemaining > warningThreshold) {
      alertsShownRef.current.clear();
    }
  }, [timeRemaining, isRunning, isFinished, warningThreshold]);

  return {
    config,
    requestPermission,
    toggleSound,
    isSupported,
  };
}

export default useNotifications;
