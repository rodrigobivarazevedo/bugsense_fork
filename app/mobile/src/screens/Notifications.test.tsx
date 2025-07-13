import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Notifications from './Notifications';

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useIsFocused: jest.fn(),
    useFocusEffect: jest.fn(),
}));

jest.mock('../context/NotificationContext', () => ({
    useNotificationContext: jest.fn(),
}));

jest.mock('../utils/DateTimeFormatter', () => ({
    formatDateTimeGerman: jest.fn((date) => `formatted-${date}`),
}));

describe('Notifications', () => {
    const mockT = jest.fn((key, opts) => (opts && opts.name ? `${key} ${opts.name}` : key));
    const mockNavigation = { navigate: jest.fn() };
    const mockRefetch = jest.fn();
    const Api = require('../api/Client');
    const { useNotificationContext } = require('../context/NotificationContext');
    const { useIsFocused, useNavigation, useFocusEffect } = require('@react-navigation/native');

    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useIsFocused as jest.Mock).mockReturnValue(true);
        (useNotificationContext as jest.Mock).mockReturnValue({ refetch: mockRefetch });
        (useFocusEffect as jest.Mock).mockImplementation((cb) => cb());
        AsyncStorage.setItem('userType', 'patient');
        AsyncStorage.setItem('token', 'test-token');
    });

    it('shows error message if fetch fails', async () => {
        Api.get.mockRejectedValue(new Error('fail'));
        const { getByText } = render(<Notifications />);
        await waitFor(() => {
            expect(getByText('failed_to_load_notifications')).toBeTruthy();
        });
    });

    it('shows empty state if no notifications', async () => {
        Api.get.mockResolvedValue({ data: [] });
        const { getByText } = render(<Notifications />);
        await waitFor(() => {
            expect(getByText('no_new_notifications')).toBeTruthy();
        });
    });

    it('renders notifications with correct text', async () => {
        Api.get.mockResolvedValue({
            data: [
                { id: 1, qr_data: 'abc', created_at: '2023-01-01', result_status: 'ready' },
                { id: 2, qr_data: 'def', created_at: '2023-01-02', result_status: 'not_ready' },
            ],
        });
        const { getByText } = render(<Notifications />);
        await waitFor(() => {
            expect(getByText('test_result_ready')).toBeTruthy();
            expect(getByText('test_result_ready_message')).toBeTruthy();
            expect(getByText('formatted-2023-01-01')).toBeTruthy();
        });
    });

    it('renders patient info for doctors', async () => {
        AsyncStorage.setItem('userType', 'doctor');
        Api.get.mockResolvedValue({
            data: [
                {
                    id: 1,
                    qr_data: 'abc',
                    created_at: '2023-01-01',
                    result_status: 'ready',
                    patient: { full_name: 'John Doe', id: 'p1', dob: '1990-01-01' },
                },
            ],
        });
        const { getByText } = render(<Notifications />);
        await waitFor(() => {
            expect(getByText('patient_colon John Doe')).toBeTruthy();
        });
    });

    it('navigates to ViewTest on notification press', async () => {
        Api.get.mockResolvedValue({
            data: [
                { id: 1, qr_data: 'abc', created_at: '2023-01-01', result_status: 'ready' },
            ],
        });
        const { getByText } = render(<Notifications />);
        await waitFor(() => {
            const item = getByText('test_result_ready');
            fireEvent.press(item.parent?.parent?.parent || item);
            expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewTest', { test: expect.objectContaining({ id: 1 }) });
        });
    });

    it('calls refetch on focus', async () => {
        render(<Notifications />);
        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    it('uses translation for empty state', async () => {
        Api.get.mockResolvedValue({ data: [] });
        render(<Notifications />);
        await waitFor(() => {
            expect(mockT).toHaveBeenCalledWith('no_new_notifications');
        });
    });

    it('uses translation for error state', async () => {
        Api.get.mockRejectedValue(new Error('fail'));
        render(<Notifications />);
        await waitFor(() => {
            expect(mockT).toHaveBeenCalledWith('failed_to_load_notifications');
        });
    });
});
