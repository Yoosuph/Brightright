# Onboarding Tour - Quick Start Code Snippets

Copy and paste these code snippets to quickly integrate the tour.

## 1. App.tsx - Add Imports

Add these at the top of your App.tsx file:

```typescript
import WelcomeModal from './components/onboarding/WelcomeModal';
import DashboardTour, { TOUR_STORAGE_KEY } from './components/onboarding/DashboardTour';
```

## 2. App.tsx - Add State

Add these state variables to your App component:

```typescript
const [showWelcomeModal, setShowWelcomeModal] = useState(false);
const [runTour, setRunTour] = useState(false);
```

## 3. App.tsx - Add Tour Detection useEffect

Add this useEffect to detect first-time dashboard visit:

```typescript
useEffect(() => {
  const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
  const storedData = localStorage.getItem('brightRankData');
  
  if (storedData && !tourCompleted && currentPage === 'dashboard') {
    // Only show on first visit to dashboard after onboarding
    setShowWelcomeModal(true);
  }
}, [currentPage]);
```

## 4. App.tsx - Add Tour Handlers

Add these callback functions:

```typescript
const handleStartTour = useCallback(() => {
  setShowWelcomeModal(false);
  setRunTour(true);
}, []);

const handleSkipTour = useCallback(() => {
  setShowWelcomeModal(false);
  localStorage.setItem(TOUR_STORAGE_KEY, 'skipped');
}, []);

const handleTourComplete = useCallback(() => {
  setRunTour(false);
}, []);

const handleTourSkip = useCallback(() => {
  setRunTour(false);
}, []);

const handleRestartTour = useCallback(() => {
  if (currentPage === 'dashboard') {
    setRunTour(true);
  } else {
    setCurrentPage('dashboard');
    setTimeout(() => setRunTour(true), 500);
  }
}, [currentPage]);
```

## 5. App.tsx - Add Components to JSX

Add these components inside your app's return statement:

```typescript
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
```

## 6. App.tsx - Pass onRestartTour to TopBar

Update your TopBar component call:

```typescript
<TopBar
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  onRestartTour={handleRestartTour}
  // ... your other props
/>
```

## 7. Sidebar.tsx - Add data-tour Attributes

Wrap your sidebar and add attributes to navigation:

```typescript
<aside data-tour="sidebar" className="...your classes...">
  {/* Logo and brand */}
  <div>...</div>

  {/* Navigation */}
  <nav>
    <button
      data-tour="dashboard-link"
      onClick={() => setCurrentPage('dashboard')}
    >
      Dashboard
    </button>

    <button
      data-tour="analytics-link"
      onClick={() => setCurrentPage('analytics')}
    >
      Analytics
    </button>

    <button
      data-tour="keywords-link"
      onClick={() => setCurrentPage('keywords')}
    >
      Keywords
    </button>

    <button
      data-tour="competitors-link"
      onClick={() => setCurrentPage('competitors')}
    >
      Competitors
    </button>

    <button
      data-tour="settings-link"
      onClick={() => setCurrentPage('settings')}
    >
      Settings
    </button>
  </nav>

  {/* Theme toggle */}
  <div data-tour="theme-toggle">
    <button onClick={toggleTheme}>
      {/* Theme icon */}
    </button>
  </div>
</aside>
```

## 8. DashboardPage.tsx - Add data-tour Attributes

Update your dashboard cards and controls:

```typescript
return (
  <div className="space-y-6">
    {/* Header with controls */}
    <div className="flex items-center justify-between">
      <h1>Dashboard</h1>
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <div data-tour="date-selector">
          <DateSelector
            selectedRange={dateRange}
            onSelectRange={setDateRange}
          />
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

    {/* Dashboard Cards Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Visibility Score */}
      <div data-tour="visibility-score">
        <VisibilityScoreCard
          score={analysisResult.overallScore}
          change={analysisResult.visibilityChange}
        />
      </div>

      {/* Total Mentions */}
      <div data-tour="mentions-card">
        <TotalMentionsCard mentions={analysisResult.totalMentions} />
      </div>

      {/* Sentiment Breakdown */}
      <div data-tour="sentiment-card">
        <SentimentChartCard data={analysisResult.sentimentBreakdown} />
      </div>
    </div>

    {/* Other charts... */}

    {/* Mentions Table */}
    <div data-tour="mentions-table">
      <Card>
        <h2>Mentions Tracker</h2>
        <MentionsTable mentions={analysisResult.mentions} />
      </Card>
    </div>
  </div>
);
```

## 9. Testing Code Snippets

### Reset Tour for Testing

```javascript
// In browser console or component
localStorage.removeItem('brightrank_tour_completed');
location.reload();
```

### Check Tour Status

```javascript
// In browser console
const status = localStorage.getItem('brightrank_tour_completed');
console.log('Tour status:', status || 'Not started');
```

### Force Tour to Start

```javascript
// In browser console (while on dashboard)
localStorage.removeItem('brightrank_tour_completed');
location.reload();
```

## 10. Complete App.tsx Example

Here's how your App.tsx should look with everything integrated:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardPage from './pages/DashboardPage';
import WelcomeModal from './components/onboarding/WelcomeModal';
import DashboardTour, { TOUR_STORAGE_KEY } from './components/onboarding/DashboardTour';
// ... other imports

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [appData, setAppData] = useState<OnboardingData | null>(null);
  
  // Tour state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [runTour, setRunTour] = useState(false);

  // Check for first-time user
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    const storedData = localStorage.getItem('brightRankData');
    
    if (storedData && !tourCompleted && currentPage === 'dashboard') {
      setShowWelcomeModal(true);
    }
  }, [currentPage]);

  // Tour handlers
  const handleStartTour = useCallback(() => {
    setShowWelcomeModal(false);
    setRunTour(true);
  }, []);

  const handleSkipTour = useCallback(() => {
    setShowWelcomeModal(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'skipped');
  }, []);

  const handleTourComplete = useCallback(() => {
    setRunTour(false);
  }, []);

  const handleTourSkip = useCallback(() => {
    setRunTour(false);
  }, []);

  const handleRestartTour = useCallback(() => {
    if (currentPage === 'dashboard') {
      setRunTour(true);
    } else {
      setCurrentPage('dashboard');
      setTimeout(() => setRunTour(true), 500);
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <TopBar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onRestartTour={handleRestartTour}
        />
        
        <main className="flex-1 p-6">
          {/* Your page content */}
        </main>
      </div>

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
    </div>
  );
};

export default App;
```

## Common Customizations

### Change Welcome Modal Colors

In `WelcomeModal.tsx`, update gradient colors:

```typescript
// Change from:
className="bg-gradient-to-r from-brand-purple to-brand-pink"

// To your colors:
className="bg-gradient-to-r from-blue-500 to-cyan-500"
```

### Add Custom Tour Step

In `DashboardTour.tsx`, add to steps array:

```typescript
{
  target: '[data-tour="your-new-element"]',
  content: (
    <div>
      <h3 className="text-lg font-bold mb-2">🎯 Your Feature</h3>
      <p className="text-sm">
        Description of your feature here.
      </p>
    </div>
  ),
  placement: 'bottom',
}
```

### Change Tour Button Colors

In `DashboardTour.tsx`, modify styles:

```typescript
buttonNext: {
  backgroundColor: '#your-color',
  borderRadius: 8,
  padding: '10px 20px',
}
```

## Troubleshooting Quick Fixes

### Tour Not Showing?

```typescript
// Force tour to show (for testing)
localStorage.removeItem('brightrank_tour_completed');
setShowWelcomeModal(true);
```

### Elements Not Highlighting?

```typescript
// Check if element exists
console.log(document.querySelector('[data-tour="sidebar"]'));

// If null, element is missing or wrong selector
```

### Tour Stuck on One Step?

```typescript
// Check continuous prop in DashboardTour.tsx
<Joyride
  continuous  // Make sure this is present
  // ... other props
/>
```

## That's It!

Follow these code snippets and you'll have a fully functional onboarding tour in minutes!

For detailed explanations, see:
- `ONBOARDING_TOUR_INTEGRATION.md`
- `components/onboarding/README.md`
