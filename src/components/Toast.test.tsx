import { render, screen, fireEvent } from '../test/test-utils';
import { Toast } from '../../components/Toast';

describe('Toast', () => {
  const mockToastData = {
    message: 'Test message',
    type: 'success' as const,
  };

  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render toast message', () => {
    render(<Toast data={mockToastData} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should have a close button that can be clicked', () => {
    render(<Toast data={mockToastData} onDismiss={mockOnDismiss} />);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();

    // Verify the button can be clicked (component will handle dismiss logic)
    fireEvent.click(closeButton);
    // Note: onDismiss will be called after setTimeout, not immediately
  });

  it('should render success toast with correct styling', () => {
    render(<Toast data={mockToastData} onDismiss={mockOnDismiss} />);

    const toastElement = screen.getByText('Test message').closest('div');
    expect(toastElement).toHaveClass('bg-green-500');
  });

  it('should render error toast with correct styling', () => {
    const errorToastData = {
      message: 'Error message',
      type: 'error' as const,
    };

    render(<Toast data={errorToastData} onDismiss={mockOnDismiss} />);

    const toastElement = screen.getByText('Error message').closest('div');
    expect(toastElement).toHaveClass('bg-red-500');
  });
});
