# Dashboard Onboarding Tour

An interactive, guided tour system for first-time users built with React Joyride.

## 🎯 Features

✨ **Welcome Modal** - Greets new users and explains key features  
🎓 **14-Step Guided Tour** - Walks through all dashboard features  
❓ **Help Menu** - Restart tour anytime from the help icon  
💾 **Persistent State** - Remembers if user completed or skipped tour  
📱 **Fully Responsive** - Works on all devices and screen sizes  
🎨 **Brand Colors** - Matches your design system  
🔄 **Restart Capability** - Users can replay tour from help menu  

## 📂 Files Created

```
components/
├── onboarding/
│   ├── WelcomeModal.tsx      # Welcome screen with feature highlights
│   ├── DashboardTour.tsx     # Main tour component with Joyride
│   └── README.md             # This file
├── HelpMenu.tsx              # Help dropdown with tour restart
└── TopBar.tsx                # Updated to include HelpMenu
```

## 🚀 Quick Start

### 1. Import Components

```tsx
import WelcomeModal from './components/onboarding/WelcomeModal';
import DashboardTour, { TOUR_STORAGE_KEY } from './components/onboarding/DashboardTour';
```

### 2. Add State Management

```tsx
const [showWelcomeModal, setShowWelcomeModal] = useState(false);
const [runTour, setRunTour] = useState(false);
```

### 3. Add Tour Logic

```tsx
// Check for first-time user
useEffect(() => {
  const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
  if (!tourCompleted && currentPage === 'dashboard') {
    setShowWelcomeModal(true);
  }
}, [currentPage]);

// Tour handlers
const handleStartTour = () => {
  setShowWelcomeModal(false);
  setRunTour(true);
};

const handleSkipTour = () => {
  setShowWelcomeModal(false);
  localStorage.setItem(TOUR_STORAGE_KEY, 'skipped');
};
```

### 4. Add Components to JSX

```tsx
{showWelcomeModal && (
  <WelcomeModal
    onStartTour={handleStartTour}
    onSkip={handleSkipTour}
    brandName={appData?.brandName}
  />
)}

<DashboardTour
  run={runTour}
  onComplete={() => setRunTour(false)}
  onSkip={() => setRunTour(false)}
/>
```

## 🏷️ Required data-tour Attributes

Add these attributes to your components for tour highlighting:

### Sidebar
```tsx
<aside data-tour="sidebar">
<button data-tour="dashboard-link">
<button data-tour="analytics-link">
<button data-tour="keywords-link">
<button data-tour="competitors-link">
<button data-tour="settings-link">
<div data-tour="theme-toggle">
```

### Dashboard
```tsx
<div data-tour="visibility-score">
<div data-tour="mentions-card">
<div data-tour="sentiment-card">
<div data-tour="date-selector">
<button data-tour="refresh-button">
<div data-tour="mentions-table">
```

### TopBar
```tsx
<div data-tour="help-icon">
```

## 🎨 Customization

### Change Colors

Edit `DashboardTour.tsx`:

```tsx
styles={{
  options: {
    primaryColor: '#6366f1',  // Your brand color
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
  }
}}
```

### Modify Steps

Edit the `steps` array in `DashboardTour.tsx`:

```tsx
const steps: Step[] = [
  {
    target: '[data-tour="your-element"]',
    content: <div>Your content</div>,
    placement: 'right',
  },
];
```

### Update Welcome Message

Edit `WelcomeModal.tsx` to change features, text, or styling.

## 📋 Tour Steps

1. **Navigation Sidebar** - Overview of main navigation
2. **Dashboard Link** - Main analytics hub
3. **Analytics Link** - Advanced metrics
4. **Keywords Link** - Keyword tracking
5. **Competitors Link** - Competitor analysis
6. **Settings Link** - Configuration options
7. **Theme Toggle** - Dark/light mode
8. **Visibility Score** - Overall rating
9. **Total Mentions** - Mention count
10. **Sentiment Breakdown** - Sentiment distribution
11. **Date Selector** - Time range selection
12. **Refresh Button** - Data refresh
13. **Mentions Table** - Detailed mentions
14. **Help Icon** - Support & tour restart

## 💾 LocalStorage

- **Key**: `brightrank_tour_completed`
- **Values**:
  - `'true'` - Tour completed
  - `'skipped'` - User skipped
  - `null` - Tour not started

### Reset Tour

```javascript
localStorage.removeItem('brightrank_tour_completed');
```

## 🧪 Testing

```javascript
// Test first-time flow
localStorage.clear();
// Complete onboarding
// Navigate to dashboard
// Welcome modal should appear

// Test restart
// Click help icon
// Click "Start Dashboard Tour"
// Tour should begin
```

## 📱 Responsive Behavior

- **Desktop**: Standard tooltips with arrows
- **Tablet**: Adjusted positioning
- **Mobile**: Touch-friendly navigation
- **All Devices**: Prevents interaction with other elements during tour

## 🎭 User Flow

```
First Visit → Welcome Modal → Start Tour / Skip
    ↓                           ↓
14 Steps              Save "skipped" status
    ↓                           ↓
Complete              Can restart from help menu
    ↓
Save "true" status
```

## 🔧 Dependencies

```json
{
  "react-joyride": "^2.8.2"
}
```

## 📖 Documentation

See `ONBOARDING_TOUR_INTEGRATION.md` for complete integration guide.

## 🎯 Best Practices

1. ✅ Always wrap callbacks in `useCallback`
2. ✅ Test on all screen sizes
3. ✅ Keep tour steps focused and concise
4. ✅ Use emojis for visual appeal
5. ✅ Provide skip option
6. ✅ Allow tour restart
7. ✅ Save completion state

## 🐛 Common Issues

**Tour not starting?**
- Check `data-tour` attributes are present
- Verify `run` prop is `true`
- Check console for errors

**Elements not highlighting?**
- Ensure element is visible
- Check selector matches
- Verify element isn't inside modal/overlay

**Tour skipping steps?**
- Check `continuous` prop is `true`
- Verify all targets exist
- Ensure stepIndex is updating

## 🚀 Future Enhancements

- [ ] Multiple tours for different pages
- [ ] Video tutorials in tooltips
- [ ] Analytics tracking
- [ ] A/B testing different flows
- [ ] Interactive elements (try features during tour)
- [ ] Role-based tours
- [ ] Progress indicators
- [ ] Tour branching based on user actions

## 📞 Support

For questions or issues, refer to:
- Integration Guide: `ONBOARDING_TOUR_INTEGRATION.md`
- React Joyride Docs: https://docs.react-joyride.com/
