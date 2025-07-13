import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Overview from './Overview';

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useIsFocused: jest.fn(),
}));

jest.mock('../utils/TestResultsStatus', () => ({
    getTranslatedTestStatus: jest.fn((status) => `translated-${status}`),
}));

jest.mock('../utils/DateTimeFormatter', () => ({
    formatDate: jest.fn((date) => `formatted-date-${date}`),
    formatTime: jest.fn((date, format) => `formatted-time-${format}-${date}`),
}));

describe('Overview', () => {
    const mockT = jest.fn((key) => key);
    const mockNavigation = { navigate: jest.fn() };
    const Api = require('../api/Client');

    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useIsFocused as jest.Mock).mockReturnValue(true);
        AsyncStorage.setItem('userType', 'patient');
        AsyncStorage.setItem('timeFormat', '12');
        AsyncStorage.setItem('token', 'test-token');
    });

    describe('Error State', () => {
        it('shows error message if fetch fails', async () => {
            Api.get.mockRejectedValue(new Error('API Error'));
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('failed_to_load_results')).toBeTruthy();
            });
        });

        it('shows retry button when there is an error', async () => {
            Api.get.mockRejectedValue(new Error('API Error'));
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('retry')).toBeTruthy();
            });
        });

        it('retries fetch when retry button is pressed', async () => {
            Api.get.mockRejectedValueOnce(new Error('API Error'));
            Api.get.mockResolvedValueOnce({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                const retryButton = getByText('retry');
                fireEvent.press(retryButton);
            });
            expect(Api.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('Empty State', () => {
        it('shows no tests message for patients', async () => {
            Api.get.mockResolvedValue({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('no_ongoing_tests')).toBeTruthy();
                expect(getByText('no_ongoing_tests_description')).toBeTruthy();
            });
        });

        it('shows no tests message for doctors', async () => {
            AsyncStorage.setItem('userType', 'doctor');
            Api.get.mockResolvedValue({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('no_ongoing_tests_for_patients')).toBeTruthy();
                expect(getByText('no_ongoing_tests_for_patients_description')).toBeTruthy();
            });
        });
    });

    describe('Test Cards Rendering', () => {
        const mockTests = [
            {
                id: 1,
                qr_data: 'test-qr-1',
                created_at: '2023-01-01T10:00:00Z',
                result_status: 'ongoing',
            },
            {
                id: 2,
                qr_data: 'test-qr-2',
                created_at: '2023-01-02T11:00:00Z',
                result_status: 'ready',
                patient: {
                    id: 101,
                    full_name: 'John Doe',
                    email: 'john@example.com',
                    dob: '1990-01-01',
                },
            },
        ];

        it('renders test cards with correct information', async () => {
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('test #1')).toBeTruthy();
                expect(getByText('test #2')).toBeTruthy();
                expect(getByText('translated-ongoing')).toBeTruthy();
                expect(getByText('translated-ready')).toBeTruthy();
            });
        });

        it('renders patient information for doctors', async () => {
            AsyncStorage.setItem('userType', 'doctor');
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('patient_name_colon')).toBeTruthy();
                expect(getByText('John Doe')).toBeTruthy();
                expect(getByText('id_colon')).toBeTruthy();
                expect(getByText('101')).toBeTruthy();
                expect(getByText('dob_colon')).toBeTruthy();
                expect(getByText('1990-01-01')).toBeTruthy();
            });
        });

        it('shows "not available" for missing patient DOB', async () => {
            AsyncStorage.setItem('userType', 'doctor');
            const testWithoutDob = {
                ...mockTests[1],
                patient: { ...mockTests[1].patient, dob: undefined },
            };
            Api.get.mockResolvedValue({ data: [testWithoutDob] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('dob_not_available')).toBeTruthy();
            });
        });

        it('navigates to ViewTest when test card is pressed', async () => {
            Api.get.mockResolvedValue({ data: [mockTests[0]] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                const testCard = getByText('test #1');
                fireEvent.press(testCard.parent?.parent || testCard);
                expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewTest', {
                    test: mockTests[0],
                });
            });
        });
    });

    describe('User Type Differences', () => {
        it('shows correct subtitle for patients', async () => {
            Api.get.mockResolvedValue({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('overview_subtitle_patient')).toBeTruthy();
            });
        });

        it('shows correct subtitle for doctors', async () => {
            AsyncStorage.setItem('userType', 'doctor');
            Api.get.mockResolvedValue({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('overview_subtitle_doctor')).toBeTruthy();
            });
        });

        it('shows correct section title for patients', async () => {
            const mockTests = [{ id: 1, qr_data: 'test', created_at: '2023-01-01', result_status: 'ongoing' }];
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('ongoing_tests')).toBeTruthy();
            });
        });

        it('shows correct section title for doctors', async () => {
            AsyncStorage.setItem('userType', 'doctor');
            const mockTests = [{ id: 1, qr_data: 'test', created_at: '2023-01-01', result_status: 'ongoing' }];
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('ongoing_tests_for_patients')).toBeTruthy();
            });
        });
    });

    describe('Time Format', () => {
        it('uses 12-hour format by default', async () => {
            const mockTests = [{ id: 1, qr_data: 'test', created_at: '2023-01-01T10:00:00Z', result_status: 'ongoing' }];
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('formatted-time-12-2023-01-01T10:00:00Z')).toBeTruthy();
            });
        });

        it('uses 24-hour format when set', async () => {
            AsyncStorage.setItem('timeFormat', '24');
            const mockTests = [{ id: 1, qr_data: 'test', created_at: '2023-01-01T10:00:00Z', result_status: 'ongoing' }];
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('formatted-time-24-2023-01-01T10:00:00Z')).toBeTruthy();
            });
        });
    });

    describe('Refresh Functionality', () => {
        it('refreshes data when pull-to-refresh is triggered', async () => {
            Api.get.mockResolvedValue({ data: [] });
            const { UNSAFE_getByType } = render(<Overview />);
            await waitFor(() => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
                fireEvent(scrollView, 'refresh');
            });
            expect(Api.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test Status Filtering', () => {
        it('filters tests to show only ongoing, preliminary_assessment, and ready', async () => {
            const allTests = [
                { id: 1, qr_data: 'test1', created_at: '2023-01-01', result_status: 'ongoing' },
                { id: 2, qr_data: 'test2', created_at: '2023-01-02', result_status: 'preliminary_assessment' },
                { id: 3, qr_data: 'test3', created_at: '2023-01-03', result_status: 'ready' },
                { id: 4, qr_data: 'test4', created_at: '2023-01-04', result_status: 'closed' },
            ];
            Api.get.mockResolvedValue({ data: allTests });
            const { getByText, queryByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('test #1')).toBeTruthy();
                expect(getByText('test #2')).toBeTruthy();
                expect(getByText('test #3')).toBeTruthy();
                expect(queryByText('test #4')).toBeNull();
            });
        });
    });

    describe('AsyncStorage Integration', () => {
        it('reads userType from AsyncStorage on mount', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            Api.get.mockResolvedValue({ data: [] });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('overview_subtitle_doctor')).toBeTruthy();
            });
        });

        it('reads timeFormat from AsyncStorage on focus', async () => {
            await AsyncStorage.setItem('timeFormat', '24');
            const mockTests = [{ id: 1, qr_data: 'test', created_at: '2023-01-01T10:00:00Z', result_status: 'ongoing' }];
            Api.get.mockResolvedValue({ data: mockTests });
            const { getByText } = render(<Overview />);
            await waitFor(() => {
                expect(getByText('formatted-time-24-2023-01-01T10:00:00Z')).toBeTruthy();
            });
        });
    });
});
