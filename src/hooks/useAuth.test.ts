import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { createMockOnboardingData } from '../test/test-utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with no authentication data', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.appData).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load data from localStorage on initialization', () => {
    const mockData = createMockOnboardingData();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));

    const { result } = renderHook(() => useAuth());

    expect(result.current.appData).toEqual(mockData);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');

    const { result } = renderHook(() => useAuth());

    expect(result.current.appData).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('brightRankData');
  });

  it('should set app data and store in localStorage', () => {
    const { result } = renderHook(() => useAuth());
    const mockData = createMockOnboardingData();

    act(() => {
      result.current.setAppData(mockData);
    });

    expect(result.current.appData).toEqual(mockData);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'brightRankData',
      JSON.stringify(mockData)
    );
  });

  it('should logout and clear data', () => {
    const mockOnLogout = vi.fn();
    const { result } = renderHook(() => useAuth(mockOnLogout));
    const mockData = createMockOnboardingData();

    // Set data first
    act(() => {
      result.current.setAppData(mockData);
    });

    // Then logout
    act(() => {
      result.current.logout('Test logout', 'success');
    });

    expect(result.current.appData).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('brightRankData');
    expect(mockOnLogout).toHaveBeenCalledWith('Test logout', 'success');
  });

  it('should add missing competitors array to legacy data', () => {
    const mockDataWithoutCompetitors = {
      brandName: 'Test Brand',
      keywords: 'test, keywords',
      // competitors missing
    };
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(mockDataWithoutCompetitors)
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.appData).toEqual({
      ...mockDataWithoutCompetitors,
      competitors: [],
    });
  });
});
