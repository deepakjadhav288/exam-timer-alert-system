/**
 * useNotifications - Custom hook for browser notifications
 * 
 * Manages browser notification permissions and triggers notifications
 * at specific time thresholds (5 min warning, 1 min critical).
 * 
 * Features:
 * - Permission request handling
 * - Notification cooldown to prevent spam
 * - Sound alerts (optional)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertConfig, ALERT_THRESHOLDS, TimerStatus } from '../types';
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
   * Uses a simple beep sound generated via Web Audio API.
   */
  useEffect(() => {
    // Create audio context for generating beep sound
    const createBeepSound = (): string => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Create offline context to generate audio buffer
      const offlineContext = new OfflineAudioContext(1, 44100 * 0.5, 44100);
      const offlineOscillator = offlineContext.createOscillator();
      const offlineGain = offlineContext.createGain();
      
      offlineOscillator.connect(offlineGain);
      offlineGain.connect(offlineContext.destination);
      
      offlineOscillator.frequency.value = 800;
      offlineOscillator.type = 'sine';
      offlineGain.gain.setValueAtTime(0.3, 0);
      offlineGain.gain.exponentialRampToValueAtTime(0.01, 0.5);
      
      offlineOscillator.start(0);
      offlineOscillator.stop(0.5);
      
      return '';
    };

    // For simplicity, we'll use a data URL for a beep sound
    // In production, you'd use an actual audio file
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
        tag: 'exam-timer-alert', // Prevents duplicate notifications
        requireInteraction: false,
      });

      // Auto-close after 5 seconds
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

    // Warning alert at 5 minutes
    if (
      timeRemaining === ALERT_THRESHOLDS.WARNING &&
      !alertsShownRef.current.has('warning')
    ) {
      alertsShownRef.current.add('warning');
      showNotification(
        '⏰ 5 Minutes Remaining',
        'You have 5 minutes left to complete your exam.'
      );
    }

    // Critical alert at 1 minute
    if (
      timeRemaining === ALERT_THRESHOLDS.CRITICAL &&
      !alertsShownRef.current.has('critical')
    ) {
      alertsShownRef.current.add('critical');
      showNotification(
        '⚠️ 1 Minute Remaining!',
        'Only 1 minute left! Please submit your exam soon.'
      );
      playAlertSound();
    }

    // Timer finished
    if (timeRemaining === 0 && !alertsShownRef.current.has('finished')) {
      alertsShownRef.current.add('finished');
      showNotification(
        '🔔 Time\'s Up!',
        'Your exam time has ended.'
      );
      playAlertSound();
    }
  }, [timeRemaining, isRunning, isFinished, showNotification, playAlertSound]);

  /**
   * Reset alerts when timer is reset.
   */
  useEffect(() => {
    if (!isRunning && !isFinished && timeRemaining > ALERT_THRESHOLDS.WARNING) {
      alertsShownRef.current.clear();
    }
  }, [timeRemaining, isRunning, isFinished]);

  return {
    config,
    requestPermission,
    toggleSound,
    isSupported,
  };
}

export default useNotifications;

