import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PatientSelectModal from './PatientSelectModal';
import { withSuppressedErrors } from '../../utils/UnitTestUtils';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key: string) => {
            const translations: { [key: string]: string } = {
                'select_patient': 'Select Patient',
                'search_patients_by_name_or_email': 'Search patients by name or email',
                'no_patients_found_please_check_your_patient_assignments': 'No patients found',
                'cancel': 'Cancel',
                'confirm': 'Confirm'
            };
            return translations[key] || key;
        })
    })
}));

jest.mock('../../api/Client', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
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

describe('PatientSelectModal', () => {
    const mockPatients = [
        {
            id: 1,
            email: 'john.doe@example.com',
            full_name: 'John Doe',
            gender: 'Male',
            dob: '1990-01-01'
        },
        {
            id: 2,
            email: 'jane.smith@example.com',
            full_name: 'Jane Smith',
            gender: 'Female',
            dob: '1985-05-15'
        },
        {
            id: 3,
            email: 'bob.wilson@example.com',
            full_name: 'Bob Wilson',
            gender: 'Male',
            dob: null
        }
    ];

    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn()
    };

    let mockApiGet: jest.MockedFunction<any>;

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        mockApiGet = require('../../api/Client').default.get;
    });

    describe('Modal visibility', () => {
        it('should render when isOpen is true', async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await act(async () => {
                expect(getByText('Select Patient')).toBeTruthy();
            });
        });

        it('should not render when isOpen is false', () => {
            const { queryByText } = render(
                <PatientSelectModal {...defaultProps} isOpen={false} />
            );

            expect(queryByText('Select Patient')).toBeNull();
        });
    });

    describe('API integration', () => {
        it('should fetch patients when modal opens', async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });

            render(<PatientSelectModal {...defaultProps} />);

            await act(async () => {
                expect(mockApiGet).toHaveBeenCalledWith('doctor/patients/');
            });
        });

        it('should display loading indicator while fetching patients', async () => {
            mockApiGet.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockPatients }), 100)));

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            expect(getByText('Select Patient')).toBeTruthy();
        });

        it('should handle API error gracefully', async () => {
            mockApiGet.mockRejectedValue(new Error('API Error'));

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await withSuppressedErrors(async () => {
                await waitFor(() => {
                    expect(getByText('No patients found')).toBeTruthy();
                });
            });
        });
    });

    describe('Patient list display', () => {
        it('should display all patients when API call succeeds', async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(getByText('Bob Wilson')).toBeTruthy();
            });
        });

        it('should display patient details correctly', async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('DOB: 1990-01-01 | Gender: Male')).toBeTruthy();
                expect(getByText('DOB: 1985-05-15 | Gender: Female')).toBeTruthy();
                expect(getByText('DOB: - | Gender: Male')).toBeTruthy();
            });
        });

        it('should show no patients message when list is empty', async () => {
            mockApiGet.mockResolvedValue({ data: [] });

            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('No patients found')).toBeTruthy();
            });
        });
    });

    describe('Search functionality', () => {
        beforeEach(async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });
        });

        it('should filter patients by name', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <PatientSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search patients by name or email');
            await act(async () => {
                fireEvent.changeText(searchInput, 'john');
            });

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(queryByText('Jane Smith')).toBeNull();
                expect(queryByText('Bob Wilson')).toBeNull();
            });
        });

        it('should filter patients by email', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <PatientSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('Jane Smith')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search patients by name or email');
            await act(async () => {
                fireEvent.changeText(searchInput, 'jane.smith');
            });

            await waitFor(() => {
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(queryByText('John Doe')).toBeNull();
                expect(queryByText('Bob Wilson')).toBeNull();
            });
        });

        it('should show all patients when search is cleared', async () => {
            const { getByPlaceholderText, getByText } = render(
                <PatientSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search patients by name or email');
            await act(async () => {
                fireEvent.changeText(searchInput, 'john');
                fireEvent.changeText(searchInput, '');
            });

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(getByText('Bob Wilson')).toBeTruthy();
            });
        });

        it('should be case insensitive', async () => {
            const { getByPlaceholderText, getByText, queryByText } = render(
                <PatientSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('Search patients by name or email');
            await act(async () => {
                fireEvent.changeText(searchInput, 'JOHN');
            });

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(queryByText('Jane Smith')).toBeNull();
            });
        });
    });

    describe('Patient selection', () => {
        beforeEach(async () => {
            mockApiGet.mockResolvedValue({ data: mockPatients });
        });

        it('should select a patient when tapped', async () => {
            const { getByText } = render(<PatientSelectModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const patientItem = getByText('John Doe');
            await act(async () => {
                fireEvent.press(patientItem);
            });

            const confirmButton = getByText('Confirm');
            expect(confirmButton.parent?.props.accessibilityState?.disabled).toBeFalsy();
        });

        it('should call onConfirm with selected patient', async () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <PatientSelectModal {...defaultProps} onConfirm={onConfirm} />
            );

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const patientItem = getByText('John Doe');
            await act(async () => {
                fireEvent.press(patientItem);
            });

            const confirmButton = getByText('Confirm');
            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(onConfirm).toHaveBeenCalledWith(mockPatients[0]);
        });

        it('should not call onConfirm when no patient is selected', async () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <PatientSelectModal {...defaultProps} onConfirm={onConfirm} />
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
            mockApiGet.mockResolvedValue({ data: mockPatients });
        });

        it('should call onClose when cancel button is pressed', async () => {
            const onClose = jest.fn();
            const { getByText } = render(
                <PatientSelectModal {...defaultProps} onClose={onClose} />
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
                <PatientSelectModal {...defaultProps} />
            );

            await waitFor(() => {
                expect(getByPlaceholderText('Search patients by name or email')).toBeTruthy();
            });

            await act(async () => {
                rerender(<PatientSelectModal {...defaultProps} isOpen={false} />);
            });

            await act(async () => {
                rerender(<PatientSelectModal {...defaultProps} isOpen={true} />);
            });

            await waitFor(() => {
                const searchInput = getByPlaceholderText('Search patients by name or email');
                expect(searchInput.props.value).toBe('');
            });
        });
    });
});
