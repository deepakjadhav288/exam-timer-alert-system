/**
 * Exam Timer & Alert System - Utility Functions
 * 
 * This file contains pure utility functions used throughout the application.
 * All functions are stateless and side-effect free for easy testing.
 */

import { TimerStatus, ALERT_THRESHOLDS } from '../types';

/**
 * Formats seconds into MM:SS display format.
 * 
 * @param seconds - Total seconds to format
 * @returns Formatted string in MM:SS format
 * 
 * @example
 * formatTime(125) // Returns "02:05"
 * formatTime(3600) // Returns "60:00"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Determines the timer status based on remaining time.
 * Used for applying visual styles and triggering alerts.
 * 
 * @param timeRemaining - Remaining time in seconds
 * @returns Current timer status
 */
export function getTimerStatus(timeRemaining: number): TimerStatus {
  if (timeRemaining <= ALERT_THRESHOLDS.CRITICAL) {
    return 'critical';
  }
  if (timeRemaining <= ALERT_THRESHOLDS.WARNING) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Generates a unique ID for violations.
 * Uses timestamp + random string for uniqueness.
 * 
 * @returns A unique string identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats a Date object to a readable time string.
 * 
 * @param date - Date to format
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Calculates elapsed time between two dates in seconds.
 * 
 * @param start - Start date
 * @param end - End date
 * @returns Elapsed time in seconds
 */
export function calculateElapsedTime(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/**
 * Checks if browser notifications are supported.
 * 
 * @returns Boolean indicating notification support
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Requests notification permission from the browser.
 * Returns the permission status after request.
 * 
 * @returns Promise resolving to permission status
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.requestPermission();
}

