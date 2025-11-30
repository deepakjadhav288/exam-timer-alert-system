/**
 * AlertSettings Component
 * 
 * Provides UI controls for notification and sound alert settings.
 * Allows users to enable/disable notifications and sound alerts.
 */

import React from 'react';
import { AlertConfig } from '../types';
import './AlertSettings.css';

interface AlertSettingsProps {
  /** Current alert configuration */
  config: AlertConfig;
  /** Whether notifications are supported */
  isSupported: boolean;
  /** Request notification permission */
  onRequestPermission: () => Promise<void>;
  /** Toggle sound alerts */
  onToggleSound: () => void;
}

/**
 * Alert settings panel for configuring notifications and sounds.
 */
export function AlertSettings({
  config,
  isSupported,
  onRequestPermission,
  onToggleSound,
}: AlertSettingsProps): React.JSX.Element {
  return (
    <div className="alert-settings">
      <h3 className="alert-settings__title">Alert Settings</h3>
      
      <div className="alert-settings__options">
        {/* Notification Setting */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">🔔</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Browser Notifications
              </span>
              <span className="alert-settings__option-desc">
                Get notified at 5 min and 1 min remaining
              </span>
            </div>
          </div>
          
          {!isSupported ? (
            <span className="alert-settings__status alert-settings__status--unavailable">
              Not supported
            </span>
          ) : config.permissionGranted ? (
            <span className="alert-settings__status alert-settings__status--enabled">
              ✓ Enabled
            </span>
          ) : (
            <button 
              className="alert-settings__btn"
              onClick={onRequestPermission}
              aria-label="Enable notifications"
            >
              Enable
            </button>
          )}
        </div>

        {/* Sound Setting */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">🔊</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Sound Alerts
              </span>
              <span className="alert-settings__option-desc">
                Play sound at 1 minute remaining
              </span>
            </div>
          </div>
          
          <button 
            className={`alert-settings__toggle ${config.soundEnabled ? 'alert-settings__toggle--on' : ''}`}
            onClick={onToggleSound}
            role="switch"
            aria-checked={config.soundEnabled}
            aria-label={`Sound alerts ${config.soundEnabled ? 'enabled' : 'disabled'}`}
          >
            <span className="alert-settings__toggle-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertSettings;

