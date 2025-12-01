import { TimerStatus, ALERT_THRESHOLDS } from '../types';

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getTimerStatus(timeRemaining: number): TimerStatus {
  if (timeRemaining <= ALERT_THRESHOLDS.CRITICAL) {
    return 'critical';
  }
  if (timeRemaining <= ALERT_THRESHOLDS.WARNING) {
    return 'warning';
  }
  return 'normal';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function calculateElapsedTime(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.requestPermission();
}

