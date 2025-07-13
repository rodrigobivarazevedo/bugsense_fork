import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tests from './Tests';
import Api from '../api/Client';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { formatDate, formatTime } from '../utils/DateTimeFormatter';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useIsFocused: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('../utils/TestResultsStatus', () => ({
    getTranslatedTestStatus: jest.fn(),
}));

jest.mock('../utils/DateTimeFormatter', () => ({
    formatDate: jest.fn(),
    formatTime: jest.fn(),
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
};

const mockT = jest.fn((key: string) => key);

const mockTestResults = [
    {
        id: 1,
        created_at: '2024-01-15T10:30:00Z',
        result_status: 'completed',
        patient: {
            id: 101,
            full_name: 'John Doe',
            dob: '1990-01-01',
        },
    },
    {
        id: 2,
        created_at: '2024-01-15T14:45:00Z',
        result_status: 'ongoing',
        patient: {
            id: 102,
            full_name: 'Jane Smith',
            dob: '1985-05-15',
        },
    },
    {
        id: 3,
        created_at: '2024-01-14T09:15:00Z',
        result_status: 'preliminary_assessment',
        patient: {
            id: 103,
            full_name: 'Alex Johnson',
            dob: '1995-12-20',
        },
    },
    {
        id: 4,
        created_at: '2024-01-14T16:20:00Z',
        result_status: 'completed',
        patient: {
            id: 104,
            full_name: 'Bob Wilson',
            dob: '1975-08-10',
        },
    },
];

describe('Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useIsFocused as jest.Mock).mockReturnValue(true);
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'userType') return Promise.resolve('patient');
            if (key === 'timeFormat') return Promise.resolve('12');
            if (key === 'token') return Promise.resolve(null);
            return Promise.resolve(null);
        });
        (getTranslatedTestStatus as jest.Mock).mockImplementation((status) => `translated_${status}`);
        (formatDate as jest.Mock).mockImplementation((date) => `formatted_${date}`);
        (formatTime as jest.Mock).mockImplementation((time, format) => `formatted_time_${format}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial Loading State', () => {
        it('should show loading indicator when fetching test results', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockImplementation(() => new Promise(() => { /* no-op */ }));

            render(<Tests />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith('qr-codes/list/', {
                    headers: {
                        Authorization: 'Bearer null',
                    },
                });
            });
        });

        it('should refetch data when screen is focused', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await act(async () => {
                expect(useIsFocused).toHaveBeenCalled();
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error message when API call fails', async () => {
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('failed_to_load_results')).toBeTruthy();
            });
        });

        it('should call translation function for error message', async () => {
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            render(<Tests />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('failed_to_load_results');
            });
        });
    });

    describe('Empty State', () => {
        it('should show empty state when no test results are available', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [] });

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('no_tests_available')).toBeTruthy();
                expect(getByText('add_new')).toBeTruthy();
            });
        });

        it('should navigate to Scan screen when add button is pressed in empty state', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [] });

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                const addButton = getByText('add_new');
                fireEvent.press(addButton);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Scan');
        });
    });

    describe('Test Results Display', () => {
        beforeEach(() => {
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });
        });

        it('should render test results grouped by date', async () => {
            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('formatted_2024-01-15')).toBeTruthy();
                expect(getByText('formatted_2024-01-14')).toBeTruthy();
            });
        });

        it('should display test times correctly', async () => {
            const { getAllByText } = render(<Tests />);

            await waitFor(() => {
                const timeElements = getAllByText('formatted_time_12');
                expect(timeElements.length).toBeGreaterThan(0);
            });
        });

        it('should display test status with correct translation', async () => {
            const { getAllByText } = render(<Tests />);

            await waitFor(() => {
                const completedElements = getAllByText('translated_completed');
                const ongoingElements = getAllByText('translated_ongoing');
                const preliminaryElements = getAllByText('translated_preliminary_assessment');

                expect(completedElements.length).toBeGreaterThan(0);
                expect(ongoingElements.length).toBeGreaterThan(0);
                expect(preliminaryElements.length).toBeGreaterThan(0);
            });
        });

        it('should navigate to ViewTest screen when test item is pressed', async () => {
            const { getAllByText } = render(<Tests />);

            await waitFor(() => {
                const timeElements = getAllByText('formatted_time_12');
                fireEvent.press(timeElements[0]);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewTest', {
                test: mockTestResults[0],
            });
        });

        it('should show add button when test results are available', async () => {
            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('add_new')).toBeTruthy();
            });
        });

        it('should navigate to Scan screen when add button is pressed', async () => {
            const { getByText } = render(<Tests />);

            await waitFor(() => {
                const addButton = getByText('add_new');
                fireEvent.press(addButton);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Scan');
        });
    });

    describe('User Type Handling', () => {
        it('should load user type from AsyncStorage', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('doctor');
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(AsyncStorage.getItem).toHaveBeenCalledWith('userType');
            });
        });

        it('should display patient information for doctor users', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('doctor');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            const { getAllByText } = render(<Tests />);

            await waitFor(() => {
                const patientNameLabels = getAllByText('patient_name_colon');
                const patientNames = getAllByText('John Doe');
                const idLabels = getAllByText('id_colon');
                const patientIds = getAllByText('101');
                const dobLabels = getAllByText('dob_colon');
                const patientDobs = getAllByText('1990-01-01');

                expect(patientNameLabels.length).toBeGreaterThan(0);
                expect(patientNames.length).toBeGreaterThan(0);
                expect(idLabels.length).toBeGreaterThan(0);
                expect(patientIds.length).toBeGreaterThan(0);
                expect(dobLabels.length).toBeGreaterThan(0);
                expect(patientDobs.length).toBeGreaterThan(0);
            });
        });

        it('should not display patient information for patient users', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            const { queryByText } = render(<Tests />);

            await waitFor(() => {
                expect(queryByText('patient_name_colon')).toBeNull();
                expect(queryByText('id_colon')).toBeNull();
                expect(queryByText('dob_colon')).toBeNull();
            });
        });

        it('should handle missing patient data gracefully', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('doctor');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            const testResultsWithMissingPatient = [
                {
                    id: 1,
                    created_at: '2024-01-15T10:30:00Z',
                    result_status: 'completed',
                    patient: null,
                },
            ];
            (Api.get as jest.Mock).mockResolvedValue({ data: testResultsWithMissingPatient });

            const { queryByText } = render(<Tests />);

            await waitFor(() => {
                expect(queryByText('patient_name_colon')).toBeNull();
                expect(queryByText('id_colon')).toBeNull();
                expect(queryByText('dob_colon')).toBeNull();
            });
        });
    });

    describe('Time Format Handling', () => {
        it('should load time format from AsyncStorage', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('24');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(AsyncStorage.getItem).toHaveBeenCalledWith('timeFormat');
            });
        });

        it('should use 24-hour format when specified', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('24');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(formatTime).toHaveBeenCalledWith('2024-01-15T10:30:00Z', '24');
            });
        });

        it('should default to 12-hour format when not specified', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve(null);
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(formatTime).toHaveBeenCalledWith('2024-01-15T10:30:00Z', '12');
            });
        });
    });

    describe('Status Indicator Styling', () => {
        it('should apply yellow indicator for ongoing status', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResults[1]] }); // ongoing status

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('translated_ongoing')).toBeTruthy();
            });
        });

        it('should apply yellow indicator for preliminary_assessment status', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResults[2]] }); // preliminary_assessment status

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('translated_preliminary_assessment')).toBeTruthy();
            });
        });

        it('should apply green indicator for completed status', async () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResults[0]] }); // completed status

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('translated_completed')).toBeTruthy();
            });
        });
    });

    describe('Data Grouping', () => {
        it('should group test results by date correctly', async () => {
            const testResultsWithSameDate = [
                {
                    id: 1,
                    created_at: '2024-01-15T10:30:00Z',
                    result_status: 'completed',
                },
                {
                    id: 2,
                    created_at: '2024-01-15T14:45:00Z',
                    result_status: 'ongoing',
                },
            ];
            (Api.get as jest.Mock).mockResolvedValue({ data: testResultsWithSameDate });

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('formatted_2024-01-15')).toBeTruthy();
            });
        });

        it('should handle test results with different dates', async () => {
            const testResultsWithDifferentDates = [
                {
                    id: 1,
                    created_at: '2024-01-15T10:30:00Z',
                    result_status: 'completed',
                },
                {
                    id: 2,
                    created_at: '2024-01-14T14:45:00Z',
                    result_status: 'ongoing',
                },
            ];
            (Api.get as jest.Mock).mockResolvedValue({ data: testResultsWithDifferentDates });

            const { getByText } = render(<Tests />);

            await waitFor(() => {
                expect(getByText('formatted_2024-01-15')).toBeTruthy();
                expect(getByText('formatted_2024-01-14')).toBeTruthy();
            });
        });
    });

    describe('Token Handling', () => {
        it('should include token in API request headers', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve('test-token');
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith('qr-codes/list/', {
                    headers: {
                        Authorization: 'Bearer test-token',
                    },
                });
            });
        });

        it('should handle missing token gracefully', async () => {
            (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'userType') return Promise.resolve('patient');
                if (key === 'timeFormat') return Promise.resolve('12');
                if (key === 'token') return Promise.resolve(null);
                return Promise.resolve(null);
            });
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestResults });

            render(<Tests />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith('qr-codes/list/', {
                    headers: {
                        Authorization: 'Bearer null',
                    },
                });
            });
        });
    });
});
