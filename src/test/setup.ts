import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.setTimeout and clearTimeout for session timeout tests
Object.defineProperty(window, 'setTimeout', {
  value: vi.fn((_fn: () => void, _delay: number) => {
    return 123; // Mock timer ID
  }),
});

Object.defineProperty(window, 'clearTimeout', {
  value: vi.fn(),
});

// Clean up after each test
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  vi.clearAllMocks();
});
