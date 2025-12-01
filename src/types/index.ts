export type TimerStatus = 'normal' | 'warning' | 'critical';
export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  status: TimerStatus;
}
export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
}

export interface UseTimerReturn extends TimerState, TimerActions {}

export type ViolationType = 
  | 'MULTIPLE_FACES'
  | 'TAB_SWITCH'
  | 'PROHIBITED_APP';

export const VIOLATION_LABELS: Record<ViolationType, string> = {
  MULTIPLE_FACES: 'Multiple Faces Detected',
  TAB_SWITCH: 'Tab Switch Detected',
  PROHIBITED_APP: 'Prohibited Application Detected',
};

export interface Violation {
  id: string;
  type: ViolationType;
  timestamp: Date;
  message: string;
}

export interface ViolationState {
  violations: Violation[];
  countByType: Record<ViolationType, number>;
  totalCount: number;
}
export interface SessionSummary {
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  actualTimeSpent: number;
  violations: Violation[];
  violationsByType: Record<ViolationType, number>;
  wasCompleted: boolean;
}

export interface AlertConfig {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  permissionGranted: boolean;
}

export const ALERT_THRESHOLDS = {
  WARNING: 5 * 60,
  CRITICAL: 1 * 60,
} as const;

export const DEFAULT_EXAM_DURATION = 45 * 60;

export const NOTIFICATION_COOLDOWN = 1000;

