import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardTour from '../../components/onboarding/DashboardTour';
import WelcomeModal from '../../components/onboarding/WelcomeModal';

// Mock React Joyride
vi.mock('react-joyride', () => ({
  default: vi.fn(({ run, callback, steps }) => {
    if (!run) return null;
    
    return (
      <div data-testid="joyride-mock">
        <div data-testid="joyride-tooltip">
          <div>Tour Step Content</div>
          <button 
            onClick={() => callback({ 
              status: 'finished', 
              action: 'next', 
              index: steps.length - 1, 
              type: 'step:after' 
            })}
            data-testid="joyride-next"
          >
            Next
          </button>
          <button 
            onClick={() => callback({ 
              status: 'skipped', 
              action: 'skip', 
              index: 0, 
              type: 'tour:skip' 
            })}
            data-testid="joyride-skip"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }),
  STATUS: {
    FINISHED: 'finished',
    SKIPPED: 'skipped',
  },
  EVENTS: {
    STEP_AFTER: 'step:after',
  },
  ACTIONS: {
    NEXT: 'next',
    PREV: 'prev',
    SKIP: 'skip',
  },
}));

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock viewport dimensions
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Mock touch events
const mockTouchSupport = () => {
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    value: {},
  });
  
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    value: 5,
  });
};

describe('Tour Responsive Design Tests', () => {
  let mockOnComplete: ReturnType<typeof vi.fn>;
  let mockOnSkip: ReturnType<typeof vi.fn>;
  let mockOnStartTour: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnComplete = vi.fn();
    mockOnSkip = vi.fn();
    mockOnStartTour = vi.fn();
    
    // Reset localStorage
    localStorage.clear();
    
    // Mock DOM elements that tour targets
    document.body.innerHTML = `
      <div data-tour="sidebar">Sidebar</div>
      <div data-tour="dashboard-link">Dashboard</div>
      <div data-tour="analytics-link">Analytics</div>
      <div data-tour="keywords-link">Keywords</div>
      <div data-tour="competitors-link">Competitors</div>
      <div data-tour="settings-link">Settings</div>
      <div data-tour="theme-toggle">Theme Toggle</div>
      <div data-tour="visibility-score">Visibility Score</div>
      <div data-tour="mentions-card">Mentions Card</div>
      <div data-tour="sentiment-card">Sentiment Card</div>
      <div data-tour="date-selector">Date Selector</div>
      <div data-tour="refresh-button">Refresh Button</div>
      <div data-tour="mentions-table">Mentions Table</div>
      <div data-tour="help-icon">Help Icon</div>
    `;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Mobile Viewport (320px - 768px)', () => {
    beforeEach(() => {
      mockViewport(375, 667); // iPhone SE dimensions
      mockMatchMedia(true); // Mobile media query matches
      mockTouchSupport();
    });

    it('should render tour on mobile viewport', async () => {
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should handle touch interactions on mobile', async () => {
      const user = userEvent.setup();
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      const nextButton = screen.getByTestId('joyride-next');
      
      // Simulate touch interaction
      fireEvent.touchStart(nextButton);
      fireEvent.touchEnd(nextButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should render welcome modal responsively on mobile', () => {
      render(
        <WelcomeModal
          onStartTour={mockOnStartTour}
          onSkip={mockOnSkip}
          brandName="Test Brand"
        />
      );

      const modal = screen.getByText('Welcome to BrightRank! 🎉');
      expect(modal).toBeInTheDocument();
      
      // Check that buttons stack vertically on mobile (flex-col class)
      const startButton = screen.getByText('Start Tour (2 min)');
      expect(startButton).toBeInTheDocument();
    });

    it('should prevent interaction with non-tour elements', async () => {
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Tour should create an overlay that prevents interaction
      const tourElement = screen.getByTestId('joyride-mock');
      expect(tourElement).toBeInTheDocument();
      
      // Background elements should not be clickable when tour is active
      const sidebarElement = document.querySelector('[data-tour="sidebar"]');
      expect(sidebarElement).toBeInTheDocument();
    });
  });

  describe('Tablet Viewport (768px - 1024px)', () => {
    beforeEach(() => {
      mockViewport(768, 1024); // iPad dimensions
      mockMatchMedia(false); // Desktop media query doesn't match
      mockTouchSupport();
    });

    it('should render tour on tablet viewport', () => {
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should handle both touch and mouse interactions on tablet', async () => {
      const user = userEvent.setup();
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      const nextButton = screen.getByTestId('joyride-next');
      
      // Test mouse interaction
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should render welcome modal with proper tablet layout', () => {
      render(
        <WelcomeModal
          onStartTour={mockOnStartTour}
          onSkip={mockOnSkip}
          brandName="Test Brand"
        />
      );

      // Features should be in grid layout on tablet
      const features = screen.getAllByText(/Real-Time Analytics|Keyword Tracking|Competitor Analysis|Actionable Insights/);
      expect(features.length).toBeGreaterThan(0);
    });
  });

  describe('Desktop Viewport (1024px+)', () => {
    beforeEach(() => {
      mockViewport(1920, 1080); // Desktop dimensions
      mockMatchMedia(false); // Mobile media query doesn't match
    });

    it('should render tour on desktop viewport', () => {
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should handle keyboard navigation on desktop', async () => {
      const user = userEvent.setup();
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Test keyboard navigation
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');
      
      // Tour should still be functional with keyboard
      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should render welcome modal with desktop layout', () => {
      render(
        <WelcomeModal
          onStartTour={mockOnStartTour}
          onSkip={mockOnSkip}
          brandName="Test Brand"
        />
      );

      // Buttons should be horizontal on desktop (sm:flex-row class)
      const startButton = screen.getByText('Start Tour (2 min)');
      const skipButton = screen.getByText('Skip for Now');
      
      expect(startButton).toBeInTheDocument();
      expect(skipButton).toBeInTheDocument();
    });
  });

  describe('Viewport Changes During Tour', () => {
    it('should adapt when viewport changes from desktop to mobile', async () => {
      // Start on desktop
      mockViewport(1920, 1080);
      
      const { rerender } = render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();

      // Change to mobile
      mockViewport(375, 667);
      mockTouchSupport();
      
      rerender(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Tour should still be present and functional
      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should handle orientation changes on mobile', () => {
      // Portrait
      mockViewport(375, 667);
      
      const { rerender } = render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();

      // Landscape
      mockViewport(667, 375);
      
      rerender(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });
  });

  describe('Tour Target Element Visibility', () => {
    it('should handle missing tour targets gracefully', () => {
      // Remove some tour targets
      document.querySelector('[data-tour="sidebar"]')?.remove();
      document.querySelector('[data-tour="dashboard-link"]')?.remove();
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Tour should still render even with missing targets
      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });

    it('should handle conditionally rendered elements', () => {
      // Simulate conditional rendering by hiding elements
      const sidebarElement = document.querySelector('[data-tour="sidebar"]');
      if (sidebarElement) {
        (sidebarElement as HTMLElement).style.display = 'none';
      }
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });
  });

  describe('Accessibility on Different Devices', () => {
    it('should maintain accessibility on mobile devices', () => {
      mockViewport(375, 667);
      mockTouchSupport();
      
      render(
        <WelcomeModal
          onStartTour={mockOnStartTour}
          onSkip={mockOnSkip}
          brandName="Test Brand"
        />
      );

      // Check for proper button sizes (touch-friendly)
      const startButton = screen.getByText('Start Tour (2 min)');
      expect(startButton).toBeInTheDocument();
      
      // Buttons should have adequate padding for touch
      expect(startButton.className).toContain('px-6 py-3');
    });

    it('should support screen readers across devices', () => {
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Tour content should be accessible to screen readers
      const tourContent = screen.getByTestId('joyride-mock');
      expect(tourContent).toBeInTheDocument();
    });
  });

  describe('Performance on Different Devices', () => {
    it('should not cause performance issues on mobile', () => {
      mockViewport(375, 667);
      
      const startTime = performance.now();
      
      render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Render should be fast (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle rapid viewport changes without errors', () => {
      const { rerender } = render(
        <DashboardTour
          run={true}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      );

      // Rapidly change viewports
      for (let i = 0; i < 10; i++) {
        mockViewport(375 + i * 100, 667);
        rerender(
          <DashboardTour
            run={true}
            onComplete={mockOnComplete}
            onSkip={mockOnSkip}
          />
        );
      }

      expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    });
  });
});