# Onboarding Tour Integration Guide

## ✅ Completed Steps

1. ✅ Installed `react-joyride` package
2. ✅ Created `WelcomeModal` component
3. ✅ Created `DashboardTour` component with Joyride
4. ✅ Created `HelpMenu` component
5. ✅ Updated `TopBar` to include HelpMenu

## 📋 Integration Steps

### Step 1: Add data-tour attributes to components

Add the following `data-tour` attributes to your components to enable the tour highlighting:

#### In `components/Sidebar.tsx`:
```tsx
// Main sidebar container
<aside data-tour="sidebar" className="...">

// Individual navigation links
<Link data-tour="dashboard-link" to="/dashboard">Dashboard</Link>
<Link data-tour="analytics-link" to="/analytics">Analytics</Link>
<Link data-tour="keywords-link" to="/keywords">Keywords</Link>
<Link data-tour="competitors-link" to="/competitors">Competitors</Link>
<Link data-tour="settings-link" to="/settings">Settings</Link>

// Theme toggle button
<button data-tour="theme-toggle" onClick={toggleTheme}>
  {/* Theme toggle icon */}
</button>
```

#### In `pages/DashboardPage.tsx`:
```tsx
// Visibility Score Card
<Card data-tour="visibility-score" className="...">
  {/* Visibility score content */}
</Card>

// Mentions Card
<Card data-tour="mentions-card" className="...">
  {/* Total mentions content */}
</Card>

// Sentiment Card
<Card data-tour="sentiment-card" className="...">
  {/* Sentiment breakdown content */}
</Card>

// Date Selector
<DateSelector data-tour="date-selector" ... />

// Refresh Button
<Button data-tour="refresh-button" onClick={handleRefresh}>
  Refresh Data
</Button>

// Mentions Table
<Card data-tour="mentions-table" className="...">
  {/* Mentions table content */}
</Card>
```

### Step 2: Integrate into App.tsx

Add the tour logic to your main App component:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import WelcomeModal from './components/onboarding/WelcomeModal';
import DashboardTour, { TOUR_STORAGE_KEY } from './components/onboarding/DashboardTour';

const App: React.FC = () => {
  // Existing state...
  const [appData, setAppData] = useState<OnboardingData | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  
  // Tour state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [runTour, setRunTour] = useState(false);

  // Check if this is first login after onboarding
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    const storedData = localStorage.getItem('brightRankData');
    
    if (storedData && !tourCompleted && currentPage === 'dashboard') {
      // Show welcome modal only on first visit to dashboard
      setShowWelcomeModal(true);
    }
  }, [currentPage, appData]);

  // Handle welcome modal actions
  const handleStartTour = useCallback(() => {
    setShowWelcomeModal(false);
    setRunTour(true);
  }, []);

  const handleSkipTour = useCallback(() => {
    setShowWelcomeModal(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'skipped');
  }, []);

  // Handle tour completion
  const handleTourComplete = useCallback(() => {
    setRunTour(false);
  }, []);

  const handleTourSkip = useCallback(() => {
    setRunTour(false);
  }, []);

  // Restart tour from help menu
  const handleRestartTour = useCallback(() => {
    if (currentPage === 'dashboard') {
      setRunTour(true);
    } else {
      // Navigate to dashboard first
      setCurrentPage('dashboard');
      setTimeout(() => setRunTour(true), 500);
    }
  }, [currentPage]);

  // In your JSX return:
  return (
    <div>
      {/* Your existing app content */}
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal
          onStartTour={handleStartTour}
          onSkip={handleSkipTour}
          brandName={appData?.brandName}
        />
      )}

      {/* Dashboard Tour */}
      <DashboardTour
        run={runTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />

      {/* Pass onRestartTour to TopBar */}
      <TopBar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onRestartTour={handleRestartTour}
        // ... other props
      />
    </div>
  );
};
```

### Step 3: Update Sidebar Component

Add data-tour attributes to the Sidebar component:

```tsx
// In components/Sidebar.tsx
export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, ... }) => {
  return (
    <aside data-tour="sidebar" className="w-64 bg-white dark:bg-dark-card ...">
      <nav className="mt-6">
        <button
          data-tour="dashboard-link"
          onClick={() => setCurrentPage('dashboard')}
          className={...}
        >
          Dashboard
        </button>
        
        <button
          data-tour="analytics-link"
          onClick={() => setCurrentPage('analytics')}
          className={...}
        >
          Analytics
        </button>
        
        <button
          data-tour="keywords-link"
          onClick={() => setCurrentPage('keywords')}
          className={...}
        >
          Keywords
        </button>
        
        <button
          data-tour="competitors-link"
          onClick={() => setCurrentPage('competitors')}
          className={...}
        >
          Competitors
        </button>
        
        <button
          data-tour="settings-link"
          onClick={() => setCurrentPage('settings')}
          className={...}
        >
          Settings
        </button>
      </nav>
      
      {/* Theme toggle */}
      <div data-tour="theme-toggle" className="...">
        <button onClick={toggleTheme}>
          {/* Theme icon */}
        </button>
      </div>
    </aside>
  );
};
```

### Step 4: Update DashboardPage Component

Add data-tour attributes to dashboard elements:

```tsx
// In pages/DashboardPage.tsx

// At the top of the component
return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1>Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <div data-tour="date-selector">
          <DateSelector ... />
        </div>
        
        {/* Refresh Button */}
        <Button
          data-tour="refresh-button"
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </div>
    </div>

    {/* Dashboard Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div data-tour="visibility-score">
        <VisibilityScoreCard ... />
      </div>
      
      <div data-tour="mentions-card">
        <TotalMentionsCard ... />
      </div>
      
      <div data-tour="sentiment-card">
        <SentimentChartCard ... />
      </div>
    </div>

    {/* Mentions Table */}
    <div data-tour="mentions-table">
      <Card>
        <h2>Mentions Tracker</h2>
        <MentionsTable ... />
      </Card>
    </div>
  </div>
);
```

## 🎨 Customization

### Colors
The tour uses your brand colors defined in the design system:
- Primary: `#6366f1` (brand-purple)
- Text: `#1f2937` (gray-800)
- Background: `#ffffff`

To customize, edit `components/onboarding/DashboardTour.tsx`:

```tsx
styles={{
  options: {
    primaryColor: '#your-color', // Change primary color
    textColor: '#your-text-color',
    backgroundColor: '#your-bg-color',
    // ... other options
  }
}}
```

### Tour Steps
To add, remove, or modify tour steps, edit the `steps` array in `DashboardTour.tsx`:

```tsx
const steps: Step[] = [
  {
    target: '[data-tour="your-element"]',
    content: (
      <div>
        <h3>Your Title</h3>
        <p>Your description</p>
      </div>
    ),
    placement: 'right', // 'top', 'bottom', 'left', 'right'
  },
  // ... more steps
];
```

## 🧪 Testing

### Test First-Time User Flow:
1. Clear localStorage: `localStorage.clear()`
2. Complete onboarding
3. Should see Welcome Modal
4. Click "Start Tour"
5. Tour should highlight each element sequentially

### Test Tour Restart:
1. Complete tour once
2. Click help icon (?) in top bar
3. Click "Start Dashboard Tour"
4. Tour should restart from beginning

### Test Tour Skip:
1. Start tour
2. Click "Skip Tour" button
3. Tour should close
4. Should not show again on next visit
5. Can still restart from help menu

## 📱 Responsive Design

The tour is fully responsive:
- Works on mobile, tablet, and desktop
- Tooltips automatically adjust position
- Mobile users can swipe through steps
- Overlay prevents clicking other elements

## 🔄 Tour Flow

```
User Completes Onboarding
    ↓
Navigates to Dashboard
    ↓
Welcome Modal Appears
    ↓
    ├─→ Click "Start Tour" → Tour Begins → 14 Steps → Tour Complete
    └─→ Click "Skip" → Modal Closes → Can restart from Help Menu
```

## 🎯 Tour Targets

| Step | Target | Description |
|------|--------|-------------|
| 1 | `[data-tour="sidebar"]` | Navigation sidebar |
| 2 | `[data-tour="dashboard-link"]` | Dashboard link |
| 3 | `[data-tour="analytics-link"]` | Analytics link |
| 4 | `[data-tour="keywords-link"]` | Keywords link |
| 5 | `[data-tour="competitors-link"]` | Competitors link |
| 6 | `[data-tour="settings-link"]` | Settings link |
| 7 | `[data-tour="theme-toggle"]` | Theme toggle button |
| 8 | `[data-tour="visibility-score"]` | Visibility score card |
| 9 | `[data-tour="mentions-card"]` | Total mentions card |
| 10 | `[data-tour="sentiment-card"]` | Sentiment breakdown |
| 11 | `[data-tour="date-selector"]` | Date range selector |
| 12 | `[data-tour="refresh-button"]` | Refresh data button |
| 13 | `[data-tour="mentions-table"]` | Mentions tracker table |
| 14 | `[data-tour="help-icon"]` | Help menu (final step) |

## 💾 localStorage Keys

- `brightrank_tour_completed`: Stores tour completion status
  - `'true'` = Completed
  - `'skipped'` = User skipped
  - Not set = Tour not started

To reset for a user:
```javascript
localStorage.removeItem('brightrank_tour_completed');
```

## 🐛 Troubleshooting

### Tour not starting:
1. Check `data-tour` attributes are present on elements
2. Verify `runTour` state is `true`
3. Check browser console for errors

### Element not highlighting:
1. Ensure element has correct `data-tour` attribute
2. Check element is visible (not hidden or collapsed)
3. Verify CSS selector matches

### Tour appears but doesn't navigate:
1. Check `continuous` prop is set to `true`
2. Verify callback function is properly handling steps
3. Ensure `stepIndex` state is updating

## 📚 Dependencies

- `react-joyride`: ^2.8.2 (main tour library)
- `react`: ^18.2.0
- `react-dom`: ^18.2.0

## 🚀 Next Steps

After integration, you can enhance the tour with:
1. Add more tour steps for other pages
2. Create separate tours for different user roles
3. Add video tutorials in tooltips
4. Track tour analytics (completion rate, drop-off points)
5. A/B test different tour flows
6. Add interactive elements (click to try features during tour)

## 📖 References

- [React Joyride Documentation](https://docs.react-joyride.com/)
- [BrightRank Design System](./DESIGN_SYSTEM.md)
- [Component Architecture](./ARCHITECTURE.md)
