/**
 * AlertSettings Component
 * 
 * Displays the alert system configuration with uniform toggle UI.
 * - Browser Notifications: Enabled by default (disabled toggle)
 * - Tab Title Updates: Enabled by default (disabled toggle)
 * - Sound Alerts: User-configurable (active toggle)
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
  /** Whether the tab is currently hidden */
  isTabHidden: boolean;
}

/**
 * Alert settings panel with uniform toggle UI.
 * Some toggles are disabled to indicate mandatory/default settings.
 */
export function AlertSettings({
  config,
  isSupported,
  onRequestPermission,
  onToggleSound,
  isTabHidden,
}: AlertSettingsProps): React.JSX.Element {
  // Browser notifications need permission first
  const notificationsEnabled = isSupported && config.permissionGranted;

  return (
    <div className="alert-settings">
      <h3 className="alert-settings__title">Alert Settings</h3>
      
      <div className="alert-settings__options">
        {/* Browser Notifications - Default enabled, toggle disabled */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">🔔</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Browser Notifications
              </span>
              <span className="alert-settings__option-desc">
                {!isSupported 
                  ? 'Not supported in this browser'
                  : notificationsEnabled
                    ? 'Alerts at 5 min and 1 min remaining'
                    : 'Click toggle to grant permission'}
              </span>
            </div>
          </div>
          
          <button 
            className={`alert-settings__toggle ${notificationsEnabled ? 'alert-settings__toggle--on' : ''} ${notificationsEnabled ? 'alert-settings__toggle--disabled' : ''}`}
            onClick={!notificationsEnabled && isSupported ? onRequestPermission : undefined}
            role="switch"
            aria-checked={notificationsEnabled}
            aria-disabled={!isSupported || notificationsEnabled}
            aria-label={`Browser notifications ${notificationsEnabled ? 'enabled (default)' : 'disabled'}`}
            disabled={!isSupported}
          >
            <span className="alert-settings__toggle-thumb" />
          </button>
        </div>

        {/* Tab Title Update - Default enabled, toggle disabled */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">📑</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Tab Title Updates
              </span>
              <span className="alert-settings__option-desc">
                {isTabHidden 
                  ? 'Currently showing time (tab inactive)' 
                  : 'Shows time when tab is inactive'}
              </span>
            </div>
          </div>
          
          <button 
            className="alert-settings__toggle alert-settings__toggle--on alert-settings__toggle--disabled"
            role="switch"
            aria-checked={true}
            aria-disabled={true}
            aria-label="Tab title updates enabled (default)"
          >
            <span className="alert-settings__toggle-thumb" />
          </button>
        </div>

        {/* Sound Setting - Optional toggle, user can change */}
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
