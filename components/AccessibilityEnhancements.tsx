import React, { useState, useEffect, useRef, useCallback } from 'react';

// Skip to content link for keyboard navigation
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-brand-purple text-white px-4 py-2 rounded-md font-medium transition-all"
    >
      Skip to main content
    </a>
  );
};

// Screen reader only content
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <span className="sr-only">
    {children}
  </span>
);

// Focus trap for modals and dropdowns
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // You can dispatch a custom event or call a callback here
        container.dispatchEvent(new CustomEvent('escape-pressed'));
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus the first element when trap becomes active
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
};

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (item: string, index: number) => void,
  options: {
    wrap?: boolean;
    homeEndKeys?: boolean;
    typeahead?: boolean;
  } = {}
) => {
  const { wrap = true, homeEndKeys = true, typeahead = true } = options;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => {
            const next = prev + 1;
            return wrap && next >= items.length ? 0 : Math.min(next, items.length - 1);
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => {
            const next = prev - 1;
            return wrap && next < 0 ? items.length - 1 : Math.max(next, 0);
          });
          break;

        case 'Home':
          if (homeEndKeys) {
            e.preventDefault();
            setActiveIndex(0);
          }
          break;

        case 'End':
          if (homeEndKeys) {
            e.preventDefault();
            setActiveIndex(items.length - 1);
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < items.length) {
            onSelect(items[activeIndex], activeIndex);
          }
          break;

        default:
          if (typeahead && e.key.length === 1) {
            e.preventDefault();
            const newQuery = searchQuery + e.key.toLowerCase();
            setSearchQuery(newQuery);

            const matchingIndex = items.findIndex(item =>
              item.toLowerCase().startsWith(newQuery)
            );

            if (matchingIndex !== -1) {
              setActiveIndex(matchingIndex);
            }

            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
              setSearchQuery('');
            }, 1000);
          }
          break;
      }
    },
    [items, activeIndex, searchQuery, onSelect, wrap, homeEndKeys, typeahead]
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
};

// Live region for announcing dynamic content
export const LiveRegion: React.FC<{
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}> = ({ message, politeness = 'polite', atomic = false }) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Clear previous announcement then set new one
    setAnnouncement('');
    const timeout = setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div
      className="sr-only"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant="additions text"
    >
      {announcement}
    </div>
  );
};

// High contrast mode toggle
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('high-contrast-mode');
    if (saved === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = useCallback(() => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast-mode', String(newValue));

    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return { isHighContrast, toggleHighContrast };
};

// Reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Font size adjustment
export const useFontSizeAdjustment = () => {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const saved = localStorage.getItem('font-size-adjustment');
    if (saved) {
      const size = parseInt(saved, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
  }, []);

  const adjustFontSize = useCallback((adjustment: number) => {
    const newSize = Math.max(75, Math.min(150, fontSize + adjustment));
    setFontSize(newSize);
    localStorage.setItem('font-size-adjustment', String(newSize));
    document.documentElement.style.fontSize = `${newSize}%`;
  }, [fontSize]);

  const resetFontSize = useCallback(() => {
    setFontSize(100);
    localStorage.removeItem('font-size-adjustment');
    document.documentElement.style.fontSize = '100%';
  }, []);

  return { fontSize, adjustFontSize, resetFontSize };
};

// Accessible button component with proper focus management
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
}> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  ariaLabel,
  ariaDescribedBy,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple/90 focus:ring-brand-purple disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Accessible dropdown/select component
export const AccessibleDropdown: React.FC<{
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
}> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  helpText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const containerRef = useFocusTrap(isOpen);

  const selectedOption = options.find(opt => opt.value === value);

  const { handleKeyDown } = useKeyboardNavigation(
    options.map(opt => opt.label),
    (_, index) => {
      const option = options[index];
      if (!option.disabled) {
        onChange(option.value);
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        break;
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else {
      handleKeyDown(e.nativeEvent);
    }
  };

  const helpId = helpText ? `${label.replace(/\s+/g, '-').toLowerCase()}-help` : undefined;
  const errorId = error ? `${label.replace(/\s+/g, '-').toLowerCase()}-error` : undefined;

  return (
    <div ref={dropdownRef} className="relative">
      <label 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        id={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
        aria-describedby={`${helpId || ''} ${errorId || ''}`.trim() || undefined}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 text-left bg-white dark:bg-dark-card border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent ${
          error
            ? 'border-red-500'
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}`}
      >
        <span className="block truncate">
          {selectedOption?.label || placeholder || 'Select an option...'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div ref={containerRef}>
          <ul
            ref={listboxRef}
            role="listbox"
            aria-labelledby={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
            onKeyDown={handleListKeyDown}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }
                }}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                  option.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : focusedIndex === index
                    ? 'bg-brand-purple text-white'
                    : option.value === value
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="block truncate">{option.label}</span>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {helpText && (
        <p id={helpId} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessibility settings panel
export const AccessibilitySettings: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const { fontSize, adjustFontSize, resetFontSize } = useFontSizeAdjustment();
  const prefersReducedMotion = useReducedMotion();
  
  const containerRef = useFocusTrap(true);

  useEffect(() => {
    const handleEscape = (e: CustomEvent) => {
      onClose();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('escape-pressed' as any, handleEscape);
      return () => container.removeEventListener('escape-pressed' as any, handleEscape);
    }
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={containerRef}
        className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-settings-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="accessibility-settings-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              Accessibility Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              aria-label="Close accessibility settings"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  High Contrast Mode
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Increase color contrast for better visibility
                </p>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 ${
                  isHighContrast ? 'bg-brand-purple' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={isHighContrast}
                aria-labelledby="high-contrast-label"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isHighContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size Adjustment */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Font Size
              </h3>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => adjustFontSize(-25)}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  disabled={fontSize <= 75}
                >
                  A-
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {fontSize}%
                </span>
                <button
                  onClick={() => adjustFontSize(25)}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  disabled={fontSize >= 150}
                >
                  A+
                </button>
              </div>
              {fontSize !== 100 && (
                <button
                  onClick={resetFontSize}
                  className="mt-2 text-sm text-brand-purple hover:text-brand-purple/80 underline"
                >
                  Reset to default
                </button>
              )}
            </div>

            {/* Motion Preference Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Animation Preferences
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {prefersReducedMotion 
                  ? 'Reduced motion is enabled in your system settings'
                  : 'Normal animations are enabled'
                }
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in form elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = [
        e.ctrlKey && 'ctrl',
        e.metaKey && 'meta',
        e.altKey && 'alt',
        e.shiftKey && 'shift',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};