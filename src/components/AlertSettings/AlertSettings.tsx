/**
 * AlertSettings Component
 * 
 * Displays the alert system configuration.
 * - Browser Notifications: Mandatory (always enabled, requires permission)
 * - Tab Title Updates: Auto-enabled (always on)
 * - Sound Alerts: Optional (user can toggle)
 */

import React from 'react';
import { AlertConfig } from '../../types';
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
 * Alert settings panel.
 */
export function AlertSettings({
  config,
  isSupported,
  onRequestPermission,
  onToggleSound,
  isTabHidden,
}: AlertSettingsProps): React.JSX.Element {
  // Check if permission needs to be granted
  const needsPermission = isSupported && !config.permissionGranted;

  return (
    <div className="alert-settings">
      <h3 className="alert-settings__title">Alert Settings</h3>
      
      <div className="alert-settings__options">
        {/* Browser Notifications - Mandatory (always ON) */}
        <div className={`alert-settings__option ${needsPermission ? 'alert-settings__option--needs-permission' : ''}`}>
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">🔔</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Browser Notifications
                <span className="alert-settings__mandatory-badge">Mandatory</span>
              </span>
              <span className="alert-settings__option-desc">
                {!isSupported 
                  ? 'Not supported in this browser'
                  : config.permissionGranted
                    ? 'Alerts at warning and critical time'
                    : 'Permission required to start exam'}
              </span>
            </div>
          </div>
          
          <div className="alert-settings__option-actions">
            {/* Grant Permission button when needed */}
            {needsPermission && (
              <button 
                className="alert-settings__permission-btn"
                onClick={onRequestPermission}
                type="button"
              >
                Grant Permission
              </button>
            )}
            
            {/* Toggle - always ON, always disabled (mandatory setting) */}
            <button 
              className="alert-settings__toggle alert-settings__toggle--on alert-settings__toggle--disabled"
              role="switch"
              aria-checked={true}
              aria-disabled={true}
              type="button"
            >
              <span className="alert-settings__toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Tab Title Update - Auto-enabled */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">📑</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Tab Title Updates
                <span className="alert-settings__auto-badge">Auto</span>
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
            type="button"
          >
            <span className="alert-settings__toggle-thumb" />
          </button>
        </div>

        {/* Sound Setting - Optional */}
        <div className="alert-settings__option">
          <div className="alert-settings__option-info">
            <span className="alert-settings__option-icon">🔊</span>
            <div className="alert-settings__option-text">
              <span className="alert-settings__option-label">
                Sound Alerts
                <span className="alert-settings__optional-badge">Optional</span>
              </span>
              <span className="alert-settings__option-desc">
                Play sound at critical time
              </span>
            </div>
          </div>
          
          <button 
            className={`alert-settings__toggle ${config.soundEnabled ? 'alert-settings__toggle--on' : ''}`}
            onClick={onToggleSound}
            role="switch"
            aria-checked={config.soundEnabled}
            type="button"
          >
            <span className="alert-settings__toggle-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertSettings;
