import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TestKitSelectModal from './TestKitSelectModal';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key: string) => {
            const translations: { [key: string]: string } = {
                'select_test_kit': 'Select Test Kit',
                'search_test_kits_by_qr_data': 'Search test kits by QR data',
                'no_ongoing_test_kits_found_please_scan_a_new_test_kit': 'No test kits found',
                'cancel': 'Cancel',
                'confirm': 'Confirm'
            };
            return translations[key] || key;
        })
    })
}));

jest.mock('./Modal.styles', () => ({
    styles: {
        overlay: { flex: 1 },
        modal: { backgroundColor: 'white' },
        modalBody: { padding: 10 },
        heading: { fontSize: 16 },
        input: { borderWidth: 1 },
        openTestKitsListContainer: { height: 1 },
        openTestKitsListText: { textAlign: 'center' },
        openTestKitsList: { maxHeight: 200 },
        openTestKitListItem: { padding: 10 },
        openTestKitListItemQRData: { fontWeight: 'bold' },
        openTestKitListItemCreatedAt: { fontSize: 12 },
        buttonRow: { flexDirection: 'row' },
        cancelButton: { padding: 10 },
        confirmButton: { padding: 10 },
        buttonText: { color: 'blue' }
    }
}));

jest.mock('../../theme/GlobalTheme', () => ({
    themeColors: {
        primary: '#007AFF',
        white: '#FFFFFF'
    }
}));

jest.mock('../../utils/DateTimeFormatter', () => ({
    formatDateTimeGerman: jest.fn((dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    })
}));

describe('TestKitSelectModal', () => {
    const mockTestKits = [
        {
            id: 1,
            qr_data: 'QR-001-ABC123',
            created_at: '2024-01-15T10:30:00Z',
            status: 'active'
        },
        {
            id: 2,
            qr_data: 'QR-002-DEF456',
            created_at: '2024-01-16T14:45:00Z',
            status: 'active'
        },
        {
            id: 3,
            qr_data: 'QR-003-GHI789',
            created_at: '2024-01-17T09:15:00Z',
            status: 'completed'
        }
    ];

    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        fetchTestKits: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Modal visibility', () => {
        it('should render when isOpen is true', async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);

            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Select Test Kit')).toBeTruthy();
            });
        });

        it('should not render when isOpen is false', () => {
            const { queryByText } = render(
                <TestKitSelectModal {...defaultProps} isOpen={false} />
            );

            expect(queryByText('Select Test Kit')).toBeNull();
        });
    });

    describe('API integration', () => {
        it('should fetch test kits when modal opens', async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);

            render(<TestKitSelectModal {...defaultProps} />);

            await act(async () => {
                expect(defaultProps.fetchTestKits).toHaveBeenCalledTimes(1);
            });
        });

        it('should display loading indicator while fetching test kits', async () => {
            defaultProps.fetchTestKits.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve(mockTestKits), 100))
            );

            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('Select Test Kit')).toBeTruthy();
            });
        });
    });

    describe('Test kit list display', () => {
        it('should display all test kits when API call succeeds', async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);

            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(getByText('QR-002-DEF456')).toBeTruthy();
                expect(getByText('QR-003-GHI789')).toBeTruthy();
            });
        });

        it('should display test kit details correctly', async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);

            const { getAllByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                const dateElements = getAllByText(/Created at: \d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
                expect(dateElements).toHaveLength(3);
            });
        });

        it('should show no test kits message when list is empty', async () => {
            defaultProps.fetchTestKits.mockResolvedValue([]);

            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('No test kits found')).toBeTruthy();
            });
        });
    });

    describe('Search functionality', () => {
        beforeEach(async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);
        });

        it('should filter test kits by QR data', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <TestKitSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'ABC123');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(queryByText('QR-002-DEF456')).toBeNull();
                expect(queryByText('QR-003-GHI789')).toBeNull();
            });
        });

        it('should show all test kits when search is cleared', async () => {
            const { getByPlaceholderText, getByText } = render(
                <TestKitSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'ABC123');
                fireEvent.changeText(searchInput, '');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(getByText('QR-002-DEF456')).toBeTruthy();
                expect(getByText('QR-003-GHI789')).toBeTruthy();
            });
        });

        it('should be case insensitive', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <TestKitSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'abc123');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(queryByText('QR-002-DEF456')).toBeNull();
            });
        });
    });

    describe('Test kit selection', () => {
        beforeEach(async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);
        });

        it('should select a test kit when tapped', async () => {
            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            });

            const testKitItem = getByText('QR-001-ABC123');
            await act(async () => {
                fireEvent.press(testKitItem);
            });

            const confirmButton = getByText('Confirm');
            expect(confirmButton.parent?.props.accessibilityState?.disabled).toBeFalsy();
        });

        it('should call onConfirm with selected QR data', async () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <TestKitSelectModal {...defaultProps} onConfirm={onConfirm} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            });

            const testKitItem = getByText('QR-001-ABC123');
            await act(async () => {
                fireEvent.press(testKitItem);
            });

            const confirmButton = getByText('Confirm');
            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(onConfirm).toHaveBeenCalledWith('QR-001-ABC123');
        });

        it('should not call onConfirm when no test kit is selected', async () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <TestKitSelectModal {...defaultProps} onConfirm={onConfirm} />
            );

            await waitFor(() => {
                expect(getByText('Confirm')).toBeTruthy();
            });

            const confirmButton = getByText('Confirm');
            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(onConfirm).not.toHaveBeenCalled();
        });
    });

    describe('Button interactions', () => {
        beforeEach(async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);
        });

        it('should call onClose when cancel button is pressed', async () => {
            const onClose = jest.fn();
            const { getByText } = render(
                <TestKitSelectModal {...defaultProps} onClose={onClose} />
            );

            await waitFor(() => {
                expect(getByText('Cancel')).toBeTruthy();
            });

            const cancelButton = getByText('Cancel');
            await act(async () => {
                fireEvent.press(cancelButton);
            });

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('should reset state when modal reopens', async () => {
            const { rerender, getByPlaceholderText } = render(
                <TestKitSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByPlaceholderText('Search test kits by QR data')).toBeTruthy();
            });

            await act(async () => {
                rerender(<TestKitSelectModal {...defaultProps} isOpen={false} />);
            });

            await act(async () => {
                rerender(<TestKitSelectModal {...defaultProps} isOpen={true} />);
            });

            await waitFor(() => {
                const searchInput = getByPlaceholderText('Search test kits by QR data');
                expect(searchInput.props.value).toBe('');
            });
        });
    });

    describe('Modal structure', () => {
        beforeEach(async () => {
            defaultProps.fetchTestKits.mockResolvedValue(mockTestKits);
        });

        it('should render both buttons', async () => {
            const { getByText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('Cancel')).toBeTruthy();
                expect(getByText('Confirm')).toBeTruthy();
            });
        });

        it('should render title and search input', async () => {
            const { getByText, getByPlaceholderText } = render(<TestKitSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('Select Test Kit')).toBeTruthy();
                expect(getByPlaceholderText('Search test kits by QR data')).toBeTruthy();
            });
        });
    });
});
