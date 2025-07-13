import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewPatient from './ViewPatient';
import Api from '../api/Client';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { formatDateTimeGerman } from '../utils/DateTimeFormatter';
import { navigateToBacteriaDiscoverPage, getSpeciesDisplayName } from '../utils/BacteriaSpeciesUtils';
import { suppressConsoleError, resumeConsoleError } from '../utils/UnitTestUtils';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('../utils/TestResultsStatus', () => ({
    getTranslatedTestStatus: jest.fn(),
}));

jest.mock('../utils/DateTimeFormatter', () => ({
    formatDateTimeGerman: jest.fn(),
}));

jest.mock('../utils/BacteriaSpeciesUtils', () => ({
    navigateToBacteriaDiscoverPage: jest.fn(),
    getSpeciesDisplayName: jest.fn(),
}));

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const mockNavigation = {
    navigate: jest.fn(),
} as any;

const mockRoute = {
    params: {
        patientId: 123,
    },
};

const mockT = jest.fn((key: string) => key);

const mockPatient = {
    id: 123,
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    gender: 'male',
    dob: '1990-01-01',
    phone_number: '+1234567890',
    street: '123 Main St',
    city: 'New York',
    postcode: '10001',
    country: 'USA',
    date_joined: '2024-01-01T00:00:00Z',
};

const mockTestResult = {
    id: 1,
    user: 123,
    qr_code: 456,
    qr_data: 'test-qr-data',
    status: 'completed',
    infection_detected: true,
    species: 'E. coli',
    concentration: '10^5 CFU/mL',
    created_at: '2024-01-15T10:30:00Z',
};

describe('ViewPatient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        suppressConsoleError();
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useRoute as jest.Mock).mockReturnValue(mockRoute);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-token');
        (getTranslatedTestStatus as jest.Mock).mockImplementation((status) => `translated_${status}`);
        (formatDateTimeGerman as jest.Mock).mockImplementation((date) => `formatted_${date}`);
        (getSpeciesDisplayName as jest.Mock).mockImplementation((species) => `display_${species}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
        resumeConsoleError();
    });

    describe('Initial Loading State', () => {
        it('should show loading indicator when fetching patient data', async () => {
            (Api.get as jest.Mock).mockImplementation(() => new Promise(() => { /* no-op */ }));

            render(<ViewPatient />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith(`doctor/patients/?patient_id=${mockRoute.params.patientId}`, {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                });
            });
        });

        it('should call API to fetch patient data on mount', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [mockPatient] });

            render(<ViewPatient />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith(`doctor/patients/?patient_id=${mockRoute.params.patientId}`, {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                });
            });
        });

        it('should call API to fetch recent test data', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [mockTestResult] }); // test data

            render(<ViewPatient />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith(`results/list/?user_id=${mockRoute.params.patientId}`, {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                });
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error message when patient API call fails', async () => {
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('failed_to_load_patient_details')).toBeTruthy();
            });
        });

        it('should show patient not found message when patient data is empty', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [] });

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('patient_not_found')).toBeTruthy();
            });
        });

        it('should handle missing patientId gracefully', async () => {
            (useRoute as jest.Mock).mockReturnValue({ params: {} });

            render(<ViewPatient />);

            await waitFor(() => {
                expect(Api.get).not.toHaveBeenCalled();
            });
        });
    });

    describe('Patient Data Display', () => {
        beforeEach(() => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [mockTestResult] }); // test data
        });

        it('should display patient basic information', async () => {
            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('full_name:')).toBeTruthy();
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('email:')).toBeTruthy();
                expect(getByText('john.doe@example.com')).toBeTruthy();
                expect(getByText('gender:')).toBeTruthy();
                expect(getByText('male')).toBeTruthy();
                expect(getByText('date_of_birth:')).toBeTruthy();
                expect(getByText('1990-01-01')).toBeTruthy();
            });
        });

        it('should display patient contact information', async () => {
            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('phone_number:')).toBeTruthy();
                expect(getByText('+1234567890')).toBeTruthy();
            });
        });

        it('should display patient address information', async () => {
            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('address:')).toBeTruthy();
                expect(getByText('123 Main St, New York, 10001, USA')).toBeTruthy();
            });
        });
    });

    describe('Recent Test Display', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockReset();
        });

        it('should handle test without species information', async () => {
            const testWithoutSpecies = {
                ...mockTestResult,
                species: undefined,
            };
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [testWithoutSpecies] }); // test data

            const { queryByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(queryByText('Species:')).toBeNull();
            });
        });

        it('should handle test without concentration information', async () => {
            const testWithoutConcentration = {
                ...mockTestResult,
                concentration: undefined,
            };
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [testWithoutConcentration] }); // test data

            const { queryByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(queryByText('Concentration:')).toBeNull();
            });
        });

        it('should show no tests message when patient has no tests', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [] }); // no test data

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('patient_has_no_previous_tests')).toBeTruthy();
            });
        });

        it('should show loading indicator for test data', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockImplementation(() => new Promise(() => { /* no-op */ })); // test data loading

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                // Check that the section title is rendered while test data is loading
                expect(getByText('most_recent_test')).toBeTruthy();
            });
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockReset();
        });

        it('should navigate to bacteria discover page when info button is pressed', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [mockTestResult] }); // test data

            const { getByTestId } = render(<ViewPatient />);

            await waitFor(() => {
                const infoButton = getByTestId('icon-ionIcons-information-circle');
                fireEvent.press(infoButton);
            });

            expect(navigateToBacteriaDiscoverPage).toHaveBeenCalledWith(mockNavigation, 'E. coli');
        });

        it('should navigate to PatientTests when view all tests button is pressed', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [mockTestResult] }); // test data

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                const viewAllTestsButton = getByText('view_all_tests');
                fireEvent.press(viewAllTestsButton);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('PatientTests', {
                patientId: 123,
                patientName: 'John Doe',
            });
        });

        it('should not show info button for sterile species', async () => {
            const sterileTest = {
                ...mockTestResult,
                species: 'Sterile',
            };
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [sterileTest] }); // test data

            const { queryByTestId } = render(<ViewPatient />);

            await waitFor(() => {
                expect(queryByTestId('icon-ionIcons-information-circle')).toBeNull();
            });
        });
    });

    describe('API Error Handling', () => {
        it('should handle test API errors gracefully', async () => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockRejectedValueOnce(new Error('Test API error')); // test data error

            const { getByText } = render(<ViewPatient />);

            await waitFor(() => {
                expect(getByText('John Doe')).toBeTruthy();
            });
        });

        it('should handle missing token gracefully', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            render(<ViewPatient />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith(`doctor/patients/?patient_id=${mockRoute.params.patientId}`, {
                    headers: {
                        Authorization: 'Bearer null',
                    },
                });
            });
        });
    });

    describe('Utility Function Integration', () => {
        beforeEach(() => {
            (Api.get as jest.Mock)
                .mockResolvedValueOnce({ data: [mockPatient] }) // patient data
                .mockResolvedValueOnce({ data: [mockTestResult] }); // test data
        });

        it('should call getTranslatedTestStatus with correct parameters', async () => {
            render(<ViewPatient />);

            await waitFor(() => {
                expect(getTranslatedTestStatus).toHaveBeenCalledWith('completed', mockT);
            });
        });

        it('should call formatDateTimeGerman with correct parameters', async () => {
            render(<ViewPatient />);

            await waitFor(() => {
                expect(formatDateTimeGerman).toHaveBeenCalledWith('2024-01-15T10:30:00Z');
            });
        });

        it('should call getSpeciesDisplayName with correct parameters', async () => {
            render(<ViewPatient />);

            await waitFor(() => {
                expect(getSpeciesDisplayName).toHaveBeenCalledWith('E. coli');
            });
        });
    });
});
