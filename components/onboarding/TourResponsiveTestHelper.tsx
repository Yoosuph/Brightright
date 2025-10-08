import React, { useState, useEffect } from 'react';
import Button from '../Button';
import Card from '../Card';

interface TourResponsiveTestHelperProps {
  onStartTour: () => void;
  onShowWelcomeModal: () => void;
}

const TourResponsiveTestHelper: React.FC<TourResponsiveTestHelperProps> = ({
  onStartTour,
  onShowWelcomeModal,
}) => {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [deviceType, setDeviceType] = useState('');
  const [orientation, setOrientation] = useState('');
  const [touchSupport, setTouchSupport] = useState(false);

  useEffect(() => {
    const updateViewportInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({ width, height });
      
      // Determine device type
      if (width < 768) {
        setDeviceType('Mobile');
      } else if (width < 1024) {
        setDeviceType('Tablet');
      } else {
        setDeviceType('Desktop');
      }
      
      // Determine orientation
      setOrientation(width > height ? 'Landscape' : 'Portrait');
      
      // Check touch support
      setTouchSupport('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    updateViewportInfo();
    
    window.addEventListener('resize', updateViewportInfo);
    window.addEventListener('orientationchange', updateViewportInfo);
    
    return () => {
      window.removeEventListener('resize', updateViewportInfo);
      window.removeEventListener('orientationchange', updateViewportInfo);
    };
  }, []);

  const testViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  const simulateViewport = (width: number, height: number) => {
    // This is for demonstration - in real testing, you'd use browser dev tools
    console.log(`Simulating viewport: ${width}x${height}`);
    
    // Trigger a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('viewportSimulation', {
      detail: { width, height }
    }));
  };

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 max-w-sm bg-white dark:bg-gray-800 shadow-lg border">
      <div className="space-y-3">
        <h3 className="font-bold text-sm">Tour Testing Helper</h3>
        
        <div className="text-xs space-y-1">
          <div>Device: <span className="font-mono">{deviceType}</span></div>
          <div>Viewport: <span className="font-mono">{viewport.width}×{viewport.height}</span></div>
          <div>Orientation: <span className="font-mono">{orientation}</span></div>
          <div>Touch: <span className="font-mono">{touchSupport ? 'Yes' : 'No'}</span></div>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={onShowWelcomeModal}
            variant="secondary"
            className="w-full text-xs py-2"
          >
            Test Welcome Modal
          </Button>
          
          <Button
            onClick={onStartTour}
            variant="primary"
            className="w-full text-xs py-2"
          >
            Start Tour
          </Button>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-xs font-semibold mb-2">Simulate Viewports:</div>
          <div className="grid grid-cols-2 gap-1">
            {testViewports.map((vp) => (
              <button
                key={vp.name}
                onClick={() => simulateViewport(vp.width, vp.height)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {vp.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Use browser dev tools to test responsive behavior
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TourResponsiveTestHelper;