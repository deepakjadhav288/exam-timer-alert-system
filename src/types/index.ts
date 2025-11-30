/**
 * Exam Timer & Alert System - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application. Centralizing types improves maintainability and
 * provides a clear contract for data structures.
 */

// ============================================================================
// Timer Types
// ============================================================================

/**
 * Visual status of the timer based on remaining time.
 * Used for applying different styles/alerts at different thresholds.
 */
export type TimerStatus = 'normal' | 'warning' | 'critical';

/**
 * State managed by the useTimer hook.
 * Represents the complete timer state at any point in time.
 */
export interface TimerState {
  /** Remaining time in seconds */
  timeRemaining: number;
  /** Whether the timer is currently counting down */
  isRunning: boolean;
  /** Whether the timer has been paused by user */
  isPaused: boolean;
  /** Whether the timer has reached zero */
  isFinished: boolean;
  /** Current visual status based on time thresholds */
  status: TimerStatus;
}

/**
 * Actions returned by the useTimer hook for controlling the timer.
 */
export interface TimerActions {
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset the timer to initial duration */
  reset: () => void;
  /** Toggle between pause and resume */
  toggle: () => void;
}

/**
 * Complete return type of the useTimer hook.
 */
export interface UseTimerReturn extends TimerState, TimerActions {}

// ============================================================================
// Violation Types
// ============================================================================

/**
 * Types of proctoring violations that can be detected.
 * Each type represents a different security concern.
 */
export type ViolationType = 
  | 'MULTIPLE_FACES'
  | 'TAB_SWITCH'
  | 'PROHIBITED_APP';

/**
 * Human-readable labels for violation types.
 * Used for display purposes in the UI.
 */
export const VIOLATION_LABELS: Record<ViolationType, string> = {
  MULTIPLE_FACES: 'Multiple Faces Detected',
  TAB_SWITCH: 'Tab Switch Detected',
  PROHIBITED_APP: 'Prohibited Application Detected',
};

/**
 * A single violation entry logged during the exam session.
 */
export interface Violation {
  /** Unique identifier for this violation */
  id: string;
  /** Type of violation detected */
  type: ViolationType;
  /** Timestamp when the violation occurred */
  timestamp: Date;
  /** Human-readable message describing the violation */
  message: string;
}

/**
 * State for the violation detection system.
 */
export interface ViolationState {
  /** List of all violations logged during the session */
  violations: Violation[];
  /** Count of violations grouped by type */
  countByType: Record<ViolationType, number>;
  /** Total number of violations */
  totalCount: number;
}

// ============================================================================
// Session Types
// ============================================================================

/**
 * Summary data displayed when the exam session ends.
 * Contains aggregated statistics and timeline of events.
 */
export interface SessionSummary {
  /** When the exam session started */
  startTime: Date;
  /** When the exam session ended */
  endTime: Date;
  /** Total duration in seconds (may differ from timer if paused) */
  totalDuration: number;
  /** Time actually spent on exam (excluding pauses) */
  actualTimeSpent: number;
  /** All violations that occurred during the session */
  violations: Violation[];
  /** Violation counts grouped by type */
  violationsByType: Record<ViolationType, number>;
  /** Whether the exam was completed (timer reached zero) */
  wasCompleted: boolean;
}

// ============================================================================
// Alert Types
// ============================================================================

/**
 * Configuration for the alert system.
 */
export interface AlertConfig {
  /** Whether browser notifications are enabled */
  notificationsEnabled: boolean;
  /** Whether sound alerts are enabled */
  soundEnabled: boolean;
  /** Whether notification permission has been granted */
  permissionGranted: boolean;
}

/**
 * Threshold values for timer alerts (in seconds).
 */
export const ALERT_THRESHOLDS = {
  /** Warning threshold - 5 minutes */
  WARNING: 5 * 60,
  /** Critical threshold - 1 minute */
  CRITICAL: 1 * 60,
} as const;

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Default exam duration in seconds (45 minutes).
 */
export const DEFAULT_EXAM_DURATION = 8 * 60;

/**
 * Minimum time between duplicate notifications (in ms).
 * Prevents notification spam.
 */
export const NOTIFICATION_COOLDOWN = 1000;

