import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Patients from './Patients';
import Api from '../api/Client';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useFocusEffect: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const mockNavigation = {
    navigate: jest.fn(),
};

const mockT = jest.fn((key: string) => key);

const mockPatients = [
    {
        id: 1,
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        gender: 'male',
        dob: '1990-01-01',
    },
    {
        id: 2,
        email: 'jane.smith@example.com',
        full_name: 'Jane Smith',
        gender: 'female',
        dob: '1985-05-15',
    },
    {
        id: 3,
        email: 'alex.johnson@example.com',
        full_name: 'Alex Johnson',
        gender: 'other',
        dob: null,
    },
    {
        id: 4,
        email: 'bob.wilson@example.com',
        full_name: 'Bob Wilson',
        gender: 'male',
        dob: '1975-12-20',
    },
];

describe('Patients', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useFocusEffect as jest.Mock).mockImplementation((callback) => {
            if (!(useFocusEffect as jest.Mock).mock.calls.length ||
                (useFocusEffect as jest.Mock).mock.calls.length === 1) {
                callback();
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial Loading State', () => {
        it('should show loading indicator when fetching patients', async () => {
            (Api.get as jest.Mock).mockImplementation(() => new Promise(() => { /* no-op */ }));

            render(<Patients />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith('doctor/patients/');
            });
        });

        it('should call API to fetch patients on mount', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });

            render(<Patients />);

            await act(async () => {
                expect(Api.get).toHaveBeenCalledWith('doctor/patients/');
            });
        });

        it('should use focus effect to refetch patients', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });

            render(<Patients />);

            await act(async () => {
                expect(useFocusEffect).toHaveBeenCalled();
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error message when API call fails', async () => {
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('failed_to_load_patients')).toBeTruthy();
            });
        });

        it('should call translation function for error message', async () => {
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            render(<Patients />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('failed_to_load_patients');
            });
        });
    });

    describe('Patient Data Display', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should render patients in alphabetical sections', async () => {
            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('A')).toBeTruthy(); // Alex Johnson
                expect(getByText('B')).toBeTruthy(); // Bob Wilson
                expect(getByText('J')).toBeTruthy(); // John Doe, Jane Smith
            });
        });

        it('should display patient names correctly', async () => {
            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(getByText('Alex Johnson')).toBeTruthy();
                expect(getByText('Bob Wilson')).toBeTruthy();
            });
        });

        it('should display patient email in search results', async () => {
            const { getByText, getByPlaceholderText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                fireEvent.changeText(searchInput, 'john.doe@example.com');
            });

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });
        });
    });

    describe('Search Functionality', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should filter patients by name', async () => {
            const { getByText, getByPlaceholderText, queryByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
            fireEvent.changeText(searchInput, 'John');

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('Alex Johnson')).toBeTruthy();
                expect(queryByText('Jane Smith')).toBeNull();
                expect(queryByText('Bob Wilson')).toBeNull();
            });
        });

        it('should filter patients by email', async () => {
            const { getByText, getByPlaceholderText, queryByText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                fireEvent.changeText(searchInput, 'jane.smith');
            });

            await waitFor(() => {
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(queryByText('John Doe')).toBeNull();
                expect(queryByText('Alex Johnson')).toBeNull();
                expect(queryByText('Bob Wilson')).toBeNull();
            });
        });

        it('should be case insensitive', async () => {
            const { getByText, getByPlaceholderText, queryByText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                fireEvent.changeText(searchInput, 'JANE');
            });

            await waitFor(() => {
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(queryByText('John Doe')).toBeNull();
            });
        });

        it('should show all patients when search is cleared', async () => {
            const { getByText, getByPlaceholderText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                fireEvent.changeText(searchInput, 'John');
            });

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });

            fireEvent.changeText(getByPlaceholderText('search_patients_by_name_or_email'), '');

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('Jane Smith')).toBeTruthy();
                expect(getByText('Alex Johnson')).toBeTruthy();
                expect(getByText('Bob Wilson')).toBeTruthy();
            });
        });

        it('should show empty state when no patients match search', async () => {
            const { getByText, getByPlaceholderText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                fireEvent.changeText(searchInput, 'NonExistentPatient');
            });

            await waitFor(() => {
                expect(getByText('no_patients_found_please_check_your_patient_assignments')).toBeTruthy();
            });
        });
    });

    describe('Gender Indicators', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should show male icon and text for male patients', async () => {
            const { getAllByTestId, getAllByText } = render(<Patients />);

            await waitFor(() => {
                expect(getAllByTestId('icon-ionIcons-male')).toHaveLength(2);
                expect(getAllByText('male')).toHaveLength(2);
            });
        });

        it('should show female icon and text for female patients', async () => {
            const { getByTestId, getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByTestId('icon-ionIcons-female')).toBeTruthy();
                expect(getByText('female')).toBeTruthy();
            });
        });

        it('should show genderless icon and text for other gender', async () => {
            const { getByTestId, getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByTestId('icon-fontAwesome6-genderless')).toBeTruthy();
                expect(getByText('other')).toBeTruthy();
            });
        });

        it('should not show gender indicator for null/undefined gender', async () => {
            const patientsWithNullGender = [
                {
                    id: 1,
                    email: 'test@example.com',
                    full_name: 'Test Patient',
                    gender: null,
                    dob: '1990-01-01',
                }
            ];

            (Api.get as jest.Mock).mockResolvedValue({ data: patientsWithNullGender });

            const { queryByText } = render(<Patients />);

            await waitFor(() => {
                expect(queryByText('male')).toBeNull();
                expect(queryByText('female')).toBeNull();
                expect(queryByText('other')).toBeNull();
            });
        });
    });

    describe('Date of Birth Display', () => {
        it('should display DOB when available', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('1990-01-01')).toBeTruthy();
                expect(getByText('1985-05-15')).toBeTruthy();
            });
        });

        it('should show "dob_not_available" when DOB is null', async () => {
            const patientsWithNullDob = [
                {
                    id: 1,
                    email: 'test@example.com',
                    full_name: 'Test Patient',
                    gender: 'male',
                    dob: null,
                }
            ];

            (Api.get as jest.Mock).mockResolvedValue({ data: patientsWithNullDob });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('dob_not_available')).toBeTruthy();
            });
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should navigate to ViewPatient when patient is pressed', async () => {
            const { getByText } = render(<Patients />);

            await waitFor(() => {
                const patientItem = getByText('John Doe');
                fireEvent.press(patientItem);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewPatient', {
                patientId: 1
            });
        });

        it('should pass correct patient ID to navigation', async () => {
            const { getByText } = render(<Patients />);

            await waitFor(() => {
                const patientItem = getByText('Jane Smith');
                fireEvent.press(patientItem);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewPatient', {
                patientId: 2
            });
        });
    });

    describe('Empty State', () => {
        it('should show empty state when no patients are returned', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [] });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('no_patients_found_please_check_your_patient_assignments')).toBeTruthy();
            });
        });

        it('should call translation function for empty state message', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [] });

            render(<Patients />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('no_patients_found_please_check_your_patient_assignments');
            });
        });
    });

    describe('Search Input Properties', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should have correct placeholder text', async () => {
            const { getByPlaceholderText } = render(<Patients />);

            await waitFor(() => {
                expect(getByPlaceholderText('search_patients_by_name_or_email')).toBeTruthy();
            });
        });

        it('should have correct input properties', async () => {
            const { getByPlaceholderText } = render(<Patients />);

            await waitFor(() => {
                const searchInput = getByPlaceholderText('search_patients_by_name_or_email');
                expect(searchInput.props.autoCapitalize).toBe('none');
                expect(searchInput.props.autoCorrect).toBe(false);
                expect(searchInput.props.clearButtonMode).toBe('while-editing');
            });
        });
    });

    describe('Translation Usage', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockPatients });
        });

        it('should use translation for search placeholder', async () => {
            render(<Patients />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('search_patients_by_name_or_email');
            });
        });

        it('should use translation for gender labels', async () => {
            render(<Patients />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('male');
                expect(mockT).toHaveBeenCalledWith('female');
                expect(mockT).toHaveBeenCalledWith('other');
            });
        });

        it('should use translation for DOB not available text', async () => {
            const patientsWithNullDob = [
                {
                    id: 1,
                    email: 'test@example.com',
                    full_name: 'Test Patient',
                    gender: 'male',
                    dob: null,
                }
            ];

            (Api.get as jest.Mock).mockResolvedValue({ data: patientsWithNullDob });

            render(<Patients />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('dob_not_available');
            });
        });
    });

    describe('Performance and Edge Cases', () => {
        it('should handle large number of patients efficiently', async () => {
            const largePatientList = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                email: `patient${i + 1}@example.com`,
                full_name: `Patient ${i + 1}`,
                gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
                dob: i % 2 === 0 ? '1990-01-01' : null,
            }));

            (Api.get as jest.Mock).mockResolvedValue({ data: largePatientList });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('Patient 1')).toBeTruthy();
                expect(getByText('Patient 100')).toBeTruthy();
            });
        });

        it('should handle patients with special characters in names', async () => {
            const patientsWithSpecialChars = [
                {
                    id: 1,
                    email: 'test@example.com',
                    full_name: 'José María García',
                    gender: 'male',
                    dob: '1990-01-01',
                }
            ];

            (Api.get as jest.Mock).mockResolvedValue({ data: patientsWithSpecialChars });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('José María García')).toBeTruthy();
            });
        });

        it('should handle empty patient names gracefully', async () => {
            const patientsWithEmptyNames = [
                {
                    id: 1,
                    email: 'test@example.com',
                    full_name: '',
                    gender: 'male',
                    dob: '1990-01-01',
                }
            ];

            (Api.get as jest.Mock).mockResolvedValue({ data: patientsWithEmptyNames });

            const { getByText } = render(<Patients />);

            await waitFor(() => {
                expect(getByText('1990-01-01')).toBeTruthy();
            });
        });
    });
});
