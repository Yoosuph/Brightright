# Implementation Plan

- [x] 1. Add data-tour attributes to existing components
  - Add `data-tour="sidebar"` to the main sidebar container in Sidebar.tsx
  - Add individual `data-tour` attributes to navigation links (dashboard-link, analytics-link, keywords-link, competitors-link, settings-link)
  - Add `data-tour="theme-toggle"` to the theme toggle section in Sidebar.tsx
  - Add `data-tour="help-icon"` to the HelpMenu component container
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 2. Add data-tour attributes to dashboard page elements
  - Add `data-tour="visibility-score"` to the VisibilityScoreCard container in DashboardPage.tsx
  - Add `data-tour="mentions-card"` to the TotalMentionsCard container in DashboardPage.tsx
  - Add `data-tour="sentiment-card"` to the SentimentChartCard container in DashboardPage.tsx
  - Add `data-tour="date-selector"` to the DateSelector component in DashboardPage.tsx
  - Add `data-tour="refresh-button"` to the refresh button in DashboardPage.tsx
  - Add `data-tour="mentions-table"` to the mentions table Card container in DashboardPage.tsx
  - _Requirements: 4.4, 4.5, 4.6, 6.1, 6.2_

- [x] 3. Integrate tour state management into App.tsx
  - Import WelcomeModal and DashboardTour components
  - Add tour-related state variables (showWelcomeModal, runTour)
  - Implement useEffect to check tour completion status and show welcome modal for first-time dashboard visitors
  - Create handleStartTour, handleSkipTour, handleTourComplete, and handleTourSkip callback functions
  - Add conditional rendering for WelcomeModal and always-present DashboardTour components
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.4, 2.5, 7.1, 7.2, 7.3_

- [x] 4. Implement tour restart functionality in TopBar and HelpMenu
  - Add onRestartTour prop to TopBar component interface
  - Pass onRestartTour prop from App.tsx to TopBar component
  - Update HelpMenu component to receive and use onRestartTour callback
  - Implement handleRestartTour function in App.tsx that navigates to dashboard if needed and starts tour
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Verify tour step targeting and flow
  - Test that all 14 tour steps can find their target elements using data-tour attributes
  - Verify tour step sequence follows the logical flow: sidebar → navigation → theme → cards → controls → table → help
  - Ensure tour content matches the step descriptions in DashboardTour.tsx
  - Validate tour placement positioning works correctly for each step
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.3_

- [x] 6. Implement localStorage persistence for tour preferences
  - Verify TOUR_STORAGE_KEY constant is properly exported from DashboardTour.tsx
  - Test localStorage operations for tour completion and skip states
  - Ensure tour completion status prevents welcome modal from showing on subsequent visits
  - Validate that tour restart from help menu works regardless of completion status
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Add responsive design testing and mobile optimization
  - Test tour functionality on mobile, tablet, and desktop viewports
  - Verify tooltip positioning adjusts correctly on different screen sizes
  - Ensure touch interactions work properly on mobile devices
  - Test tour overlay prevents interaction with non-tour elements
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 8. Implement error handling for missing tour targets
  - Add error handling for cases where tour target elements are not found
  - Implement graceful degradation when tour steps fail to locate targets
  - Add console logging for debugging tour target issues
  - Test tour behavior when components are conditionally rendered
  - _Requirements: 6.3, 6.5_

- [x] 9. Final integration testing and validation
  - Test complete first-time user flow: onboarding → dashboard → welcome modal → tour completion
  - Verify tour skip functionality works from both welcome modal and during tour execution
  - Test tour restart functionality from help menu
  - Validate localStorage persistence across browser sessions
  - Ensure tour doesn't interfere with normal dashboard functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5_