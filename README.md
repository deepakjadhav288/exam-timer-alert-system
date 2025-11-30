# Exam Timer & Alert System

A React-based exam timer component with proctoring violation detection simulation, built as a take-home coding challenge.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.4.2-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### ⏱️ Countdown Timer
- 45-minute countdown in MM:SS format
- Pause/Resume functionality
- Visual warning at 5 minutes (yellow)
- Critical alert at 1 minute (red)
- Circular progress indicator

### 🔔 Alert System
- Browser notifications at 5 min and 1 min
- Sound alert at 1 minute (toggleable)
- Dynamic tab title shows remaining time
- Permission request handling

### 🚨 Violation Detection Simulation
- Three violation types:
  - Multiple Faces Detected
  - Tab Switch Detected
  - Prohibited Application Detected
- Timestamped violation log
- Violation count badges with severity styling

### 📊 Session Summary
- Displayed when timer ends
- Total time spent
- Violations grouped by type
- Chronological violation timeline
- Clean record celebration for no violations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/exam-timer-alert-system.git
cd exam-timer-alert-system

# Install dependencies
yarn install
# or
npm install
```

### Running the Application

```bash
# Start development server
yarn start
# or
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
yarn build
# or
npm run build
```

### Running Tests

```bash
yarn test
# or
npm test
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ExamTimer.tsx   # Main timer container
│   ├── TimerDisplay.tsx # Countdown display
│   ├── TimerControls.tsx # Control buttons
│   ├── AlertSettings.tsx # Notification settings
│   ├── ViolationPanel.tsx # Violation buttons
│   ├── ViolationBadge.tsx # Count badge
│   ├── ViolationLog.tsx  # Timeline log
│   ├── SessionSummary.tsx # End summary
│   └── index.ts         # Barrel exports
├── hooks/               # Custom React hooks
│   ├── useTimer.ts     # Timer logic
│   ├── useNotifications.ts # Browser notifications
│   ├── useTabTitle.ts  # Tab title updates
│   ├── useViolations.ts # Violation state
│   └── index.ts        # Barrel exports
├── types/               # TypeScript definitions
│   └── index.ts        # All interfaces & types
├── utils/               # Utility functions
│   └── index.ts        # Helper functions
├── App.tsx              # Root component
├── App.css              # App styles
├── index.tsx            # Entry point
└── index.css            # Global styles & CSS variables
```

## 🏗️ Architecture & Design Decisions

### Component Architecture

**Composition over Inheritance**: Components are composed of smaller, focused pieces:
- `ExamTimer` composes `TimerDisplay` + `TimerControls`
- State is lifted to `App.tsx` for cross-component integration

**Custom Hooks Pattern**: Business logic is extracted into reusable hooks:
- `useTimer` - All timer logic with interval management
- `useNotifications` - Browser notification handling
- `useViolations` - Violation state management
- `useTabTitle` - Document title updates

### State Management

**Local State with Hooks**: Chose `useState` + custom hooks over Redux/Context for:
- Simplicity - app scope doesn't require global state
- Performance - no unnecessary re-renders
- Testability - hooks are easily unit tested

**Refs for Mutable Values**: Used `useRef` for:
- Interval IDs (avoid stale closures)
- Alert tracking (prevent duplicate notifications)
- Mounted state (prevent memory leaks)

### TypeScript Strategy

- **Strict typing** for all props, state, and return values
- **Union types** for violation types (`ViolationType`)
- **Interface segregation** - separate interfaces for state vs actions
- **Constants as const** - `ALERT_THRESHOLDS`, `VIOLATION_LABELS`

### Styling Approach

**CSS Modules Alternative**: Chose BEM-style CSS with:
- CSS custom properties for theming
- Component-scoped CSS files
- No runtime overhead (vs CSS-in-JS)

**Mobile-First Responsive**: 
- Base styles for mobile
- Progressive enhancement for larger screens
- Landscape mobile breakpoint for edge cases

## ⚖️ Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| No state library | Simpler, fewer dependencies | Would need refactor for complex state |
| CSS files over CSS-in-JS | Zero runtime cost, familiar | No dynamic styling, potential conflicts |
| Web Audio API for sound | No audio file needed | Browser compatibility varies |
| Single component file | Co-located logic | Larger files for complex components |

## 🔮 Future Improvements

With more time, I would add:

### Features
- [ ] **Persist session to localStorage** - Resume after browser close
- [ ] **Custom timer duration** - User-configurable exam length
- [ ] **Multiple exam profiles** - Save/load different configurations
- [ ] **Export session report** - PDF/JSON export of results
- [ ] **Real violation detection** - Webcam face detection, tab visibility API

### Technical
- [ ] **Unit tests** - Jest tests for hooks and components
- [ ] **E2E tests** - Playwright/Cypress for full flows
- [ ] **Dark mode** - CSS variables are ready, need toggle
- [ ] **i18n** - Multi-language support
- [ ] **PWA** - Offline support, install prompt
- [ ] **Performance** - React.memo for heavy components

### UX
- [ ] **Keyboard shortcuts** - Space for pause, R for reset
- [ ] **Better sounds** - Multiple alert tones, volume control
- [ ] **Animations** - Page transitions with Framer Motion
- [ ] **Accessibility audit** - WCAG 2.1 AA compliance

## ⏱️ Time Spent

| Task | Time |
|------|------|
| Project setup & TypeScript types | ~30 min |
| Timer hook implementation | ~45 min |
| Timer display components | ~45 min |
| Alert system & Browser APIs | ~40 min |
| Violation detection system | ~40 min |
| Session summary screen | ~30 min |
| Responsive design & polish | ~45 min |
| Documentation | ~20 min |
| **Total** | **~5 hours** |

## 🛠️ Technologies Used

- **React 19.2** - UI framework
- **TypeScript 4.4** - Type safety
- **Create React App** - Build tooling
- **CSS Custom Properties** - Theming
- **Web APIs** - Notifications, Audio, Visibility

## 📄 License

MIT License - feel free to use this code for your own projects.

---

Built with ❤️ as a coding challenge submission.
