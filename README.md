# Exam Timer & Alert System

A React-based exam timer component with proctoring violation detection simulation, built as a take-home coding challenge.

🔗 **Live Demo:** [https://exam-timer-alert-system.vercel.app](https://exam-timer-alert-system.vercel.app)

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.4.2-3178C6?logo=typescript)
![Tests](https://img.shields.io/badge/Tests-34%20passed-brightgreen)
![Deploy](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### ⏱️ Countdown Timer
- Configurable exam duration (default: 45 minutes)
- MM:SS format display
- Pause/Resume functionality
- Configurable warning threshold (default: 5 minutes - yellow)
- Configurable critical threshold (default: 1 minute - red)
- Circular progress indicator
- Settings locked once exam starts

### 🔔 Alert System
- Browser notifications at warning and critical thresholds (mandatory)
- Sound alert at critical time (optional toggle)
- Dynamic tab title shows remaining time when tab is inactive
- Permission request handling with clear UI feedback

### 🚨 Violation Detection Simulation
- Three violation types:
  - Multiple Faces Detected
  - Tab Switch Detected
  - Prohibited Application Detected
- Timestamped violation log
- Violation count badges with severity styling
- Clear "+" button UX for adding violations

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
# Run tests
yarn test
# or
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

## 🧪 Testing

The project includes **34 unit tests** covering timer logic and utility functions.

### Test Coverage

| File | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| `useTimer.ts` | 96% | 92.3% | 100% | 100% |
| `utils/index.ts` | 73.3% | 66.7% | 71.4% | 73.3% |

### Test Categories

- **Timer Hook Tests** (18 tests)
  - Initial state with default/custom duration
  - Timer controls: start, pause, toggle, reset
  - Countdown behavior and interval management
  - Status updates at warning/critical thresholds
  - Edge cases: double start, actions after finish

- **Utility Function Tests** (16 tests)
  - `formatTime()` - MM:SS formatting
  - `getTimerStatus()` - threshold detection
  - `generateId()` - uniqueness
  - `formatTimestamp()` - date formatting
  - `calculateElapsedTime()` - time calculations

## 📁 Project Structure

```
src/
├── __tests__/               # Unit tests
│   ├── hooks/
│   │   └── useTimer.test.ts
│   └── utils/
│       └── index.test.ts
├── components/              # React components (co-located folders)
│   ├── AlertSettings/
│   │   ├── AlertSettings.tsx
│   │   ├── AlertSettings.css
│   │   └── index.ts
│   ├── ExamConfig/
│   │   ├── ExamConfig.tsx
│   │   ├── ExamConfig.css
│   │   └── index.ts
│   ├── ExamTimer/
│   │   ├── ExamTimer.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   └── index.ts
│   ├── SessionSummary/
│   │   └── ...
│   ├── ViolationPanel/
│   │   ├── ViolationPanel.tsx
│   │   ├── ViolationBadge.tsx
│   │   ├── ViolationLog.tsx
│   │   └── index.ts
│   └── index.ts             # Barrel exports
├── hooks/                   # Custom React hooks
│   ├── useTimer.ts          # Timer logic
│   ├── useNotifications.ts  # Browser notifications
│   ├── useTabTitle.ts       # Tab title updates
│   ├── useViolations.ts     # Violation state
│   └── index.ts
├── types/                   # TypeScript definitions
│   └── index.ts
├── utils/                   # Utility functions
│   └── index.ts
├── App.tsx                  # Root component
├── App.css
├── index.tsx                # Entry point
├── index.css                # Global styles & CSS variables
└── setupTests.ts            # Jest test setup
```

## 🏗️ Architecture & Design Decisions

### Component Architecture

**Co-located Component Folders**: Each component has its own folder with:
- Component file (`.tsx`)
- Styles (`.css`)
- Barrel export (`index.ts`)

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

## ✨ Creative Extras (Beyond Requirements)

Features added beyond the core requirements:

- **Configurable Timer Settings** - User can set custom exam duration, warning threshold, and critical threshold before starting
- **Settings Lock** - Configuration is locked once exam begins to prevent cheating
- **Unit Tests** - 34 tests with high coverage for timer logic

## ⚖️ Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| No state library | Simpler, fewer dependencies | Would need refactor for complex state |
| CSS files over CSS-in-JS | Zero runtime cost, familiar | No dynamic styling, potential conflicts |
| Web Audio API for sound | No audio file needed | Browser compatibility varies |
| Co-located component folders | Easy to find related files | More folders to navigate |

## 🔮 Future Improvements

With more time, I would add:

### Features
- [ ] **Persist session to localStorage** - Resume after browser close
- [ ] **Multiple exam profiles** - Save/load different configurations
- [ ] **Export session report** - PDF/JSON export of results
- [ ] **Real violation detection** - Webcam face detection, tab visibility API

### Technical
- [ ] **E2E tests** - Playwright/Cypress for full flows
- [ ] **Dark mode** - CSS variables are ready, need toggle
- [ ] **Performance** - React.memo for heavy components

### UX
- [ ] **Keyboard shortcuts** - Space for pause, R for reset
- [ ] **Better sounds** - Multiple alert tones, volume control
- [ ] **Animations** - Page transitions with Framer Motion

## ⏱️ Time Spent

| Phase | Task | Time |
|-------|------|------|
| **Planning** | Understanding requirements & acceptance criteria | ~1.5 hours |
| | Research (React patterns, Browser APIs, best practices) | ~1.5 hours |
| | Architecture planning & component design | ~1 hour |
| **Development** | Project setup & TypeScript types | ~1 hour |
| | Timer hook implementation | ~1.5 hours |
| | Timer display components & styling | ~1.5 hours |
| | Alert system & Browser notification APIs | ~1.5 hours |
| | Violation detection system | ~1 hour |
| | Session summary screen | ~1 hour |
| | Configurable settings & validation | ~1 hour |
| **Testing** | Unit tests for timer logic & utilities | ~1 hour |
| | Manual testing & bug fixes | ~1 hour |
| **Polish** | Responsive design & cross-browser testing | ~1 hour |
| | Folder restructuring & code cleanup | ~30 min |
| | Documentation (README, comments) | ~1 hour |
| | **Total** | **~16 hours** |

## 🛠️ Technologies Used

- **React 19.2** - UI framework
- **TypeScript 4.4** - Type safety
- **Jest + React Testing Library** - Unit testing
- **Create React App** - Build tooling
- **CSS Custom Properties** - Theming
- **Web APIs** - Notifications, Audio, Visibility
