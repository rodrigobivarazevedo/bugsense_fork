import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TestSelectModal from './TestSelectModal';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key: string) => {
            const translations: { [key: string]: string } = {
                'select_test_kit': 'Select Test Kit',
                'choose_which_test_kit_to_upload_the_picture_for': 'Choose which test kit to upload the picture for',
                'search_test_kits_by_qr_data': 'Search test kits by QR data',
                'no_ongoing_test_kits_found_for_this_patient_please_scan_a_new_test_kit_first': 'No test kits found for this patient',
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
        messageSubtitle: { fontSize: 14 },
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

jest.mock('../../api/Client', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
}));

describe('TestSelectModal', () => {
    const mockTestKits = [
        {
            id: 1,
            qr_data: 'QR-001-ABC123',
            created_at: '2024-01-15T10:30:00Z',
            status: 'active',
            user_id: 123,
            result_status: 'pending'
        },
        {
            id: 2,
            qr_data: 'QR-002-DEF456',
            created_at: '2024-01-16T14:45:00Z',
            status: 'active',
            user_id: 123,
            result_status: 'pending'
        },
        {
            id: 3,
            qr_data: 'QR-003-GHI789',
            created_at: '2024-01-17T09:15:00Z',
            status: 'completed',
            user_id: 123,
            result_status: 'closed'
        }
    ];

    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        patientId: 123
    };

    let mockApiGet: jest.MockedFunction<any>;

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        mockApiGet = require('../../api/Client').default.get;
    });

    describe('Modal visibility', () => {
        it('should render when isOpen is true', async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });

            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Select Test Kit')).toBeTruthy();
            });
        });

        it('should not render when isOpen is false', () => {
            const { queryByText } = render(
                <TestSelectModal {...defaultProps} isOpen={false} />
            );

            expect(queryByText('Select Test Kit')).toBeNull();
        });
    });

    describe('API integration', () => {
        it('should fetch test kits when modal opens with patientId', async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });

            render(<TestSelectModal {...defaultProps} />);

            await act(async () => {
                expect(mockApiGet).toHaveBeenCalledWith('qr-codes/list/?user_id=123');
            });
        });

        it('should not fetch test kits when patientId is not provided', async () => {
            const { getByText } = render(
                <TestSelectModal {...defaultProps} patientId={0} />
            );

            await act(async () => {
                expect(getByText('Select Test Kit')).toBeTruthy();
            });

            expect(mockApiGet).not.toHaveBeenCalled();
        });

        it('should filter out closed test kits', async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });

            const { getByText, queryByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(getByText('QR-002-DEF456')).toBeTruthy();
                expect(queryByText('QR-003-GHI789')).toBeNull();
            }, { timeout: 3000 });
        });

        it('should display loading indicator while fetching test kits', async () => {
            mockApiGet.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ data: mockTestKits }), 100))
            );

            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Select Test Kit')).toBeTruthy();
            });
        });

        it('should handle API error gracefully', async () => {
            const originalError = console.error;
            console.error = jest.fn();

            mockApiGet.mockRejectedValue(new Error('API Error'));

            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('No test kits found for this patient')).toBeTruthy();
            }, { timeout: 5000 });

            console.error = originalError;
        });
    });

    describe('Test kit list display', () => {
        it('should display all active test kits when API call succeeds', async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });

            const { getByText, queryByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(getByText('QR-002-DEF456')).toBeTruthy();
                expect(queryByText('QR-003-GHI789')).toBeNull();
            }, { timeout: 3000 });
        });

        it('should display test kit details correctly', async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });

            const { getAllByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                const dateElements = getAllByText(/Created at: \d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
                expect(dateElements).toHaveLength(2);
            }, { timeout: 3000 });
        });

        it('should show no test kits message when list is empty', async () => {
            mockApiGet.mockResolvedValue({ data: [] });

            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('No test kits found for this patient')).toBeTruthy();
            }, { timeout: 3000 });
        });
    });

    describe('Search functionality', () => {
        beforeEach(async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });
        });

        it('should filter test kits by QR data', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <TestSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            }, { timeout: 3000 });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'ABC123');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(queryByText('QR-002-DEF456')).toBeNull();
            }, { timeout: 3000 });
        });

        it('should show all test kits when search is cleared', async () => {
            const { getByPlaceholderText, getByText } = render(
                <TestSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            }, { timeout: 3000 });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'ABC123');
                fireEvent.changeText(searchInput, '');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(getByText('QR-002-DEF456')).toBeTruthy();
            }, { timeout: 3000 });
        });

        it('should be case insensitive', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <TestSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            }, { timeout: 3000 });

            const searchInput = getByPlaceholderText('Search test kits by QR data');
            await act(async () => {
                fireEvent.changeText(searchInput, 'abc123');
            });

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
                expect(queryByText('QR-002-DEF456')).toBeNull();
            }, { timeout: 3000 });
        });
    });

    describe('Test kit selection', () => {
        beforeEach(async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });
        });

        it('should select a test kit when tapped', async () => {
            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            }, { timeout: 3000 });

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
                <TestSelectModal {...defaultProps} onConfirm={onConfirm} />
            );

            await waitFor(() => {
                expect(getByText('QR-001-ABC123')).toBeTruthy();
            }, { timeout: 3000 });

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
                <TestSelectModal {...defaultProps} onConfirm={onConfirm} />
            );

            await act(async () => {
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
            mockApiGet.mockResolvedValue({ data: mockTestKits });
        });

        it('should call onClose when cancel button is pressed', async () => {
            const onClose = jest.fn();
            const { getByText } = render(
                <TestSelectModal {...defaultProps} onClose={onClose} />
            );

            await act(async () => {
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
                <TestSelectModal {...defaultProps} />
            );

            await act(async () => {
                expect(getByPlaceholderText('Search test kits by QR data')).toBeTruthy();
            });

            await act(async () => {
                rerender(<TestSelectModal {...defaultProps} isOpen={false} />);
            });

            await act(async () => {
                rerender(<TestSelectModal {...defaultProps} isOpen={true} />);
            });

            await act(async () => {
                const searchInput = getByPlaceholderText('Search test kits by QR data');
                expect(searchInput.props.value).toBe('');
            });
        });
    });

    describe('Modal structure', () => {
        beforeEach(async () => {
            mockApiGet.mockResolvedValue({ data: mockTestKits });
        });

        it('should render both buttons', async () => {
            const { getByText } = render(<TestSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Cancel')).toBeTruthy();
                expect(getByText('Confirm')).toBeTruthy();
            });
        });

        it('should render title, subtitle and search input', async () => {
            const { getByText, getByPlaceholderText } = render(<TestSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Select Test Kit')).toBeTruthy();
                expect(getByText('Choose which test kit to upload the picture for')).toBeTruthy();
                expect(getByPlaceholderText('Search test kits by QR data')).toBeTruthy();
            });
        });
    });
});
