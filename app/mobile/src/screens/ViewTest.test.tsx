import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import ViewTest from './ViewTest';
import Api from '../api/Client';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { formatDateTimeGerman } from '../utils/DateTimeFormatter';
import { getSpeciesDisplayName } from '../utils/BacteriaSpeciesUtils';
import { useNotificationContext } from '../context/NotificationContext';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
    useFocusEffect: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-clipboard', () => ({
    setStringAsync: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
    post: jest.fn(),
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

jest.mock('../context/NotificationContext', () => ({
    useNotificationContext: jest.fn(),
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

const mockNavigation = { navigate: jest.fn() };
const mockRoute = {
    params: { test: { id: 123, qr_data: 'test-qr-data-123' } }
};
const mockT = jest.fn((key: string) => key);
const mockRefetch = jest.fn();

const mockTestResult = {
    id: 1,
    status: 'completed',
    infection_detected: true,
    species: 'E. coli',
    concentration: '10^5',
    created_at: '2024-01-15T10:30:00Z',
    qr_data: 'test-qr-data-123',
};

describe('ViewTest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useRoute as jest.Mock).mockReturnValue(mockRoute);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useNotificationContext as jest.Mock).mockReturnValue({ refetch: mockRefetch });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-token');
        (getTranslatedTestStatus as jest.Mock).mockReturnValue('Completed');
        (formatDateTimeGerman as jest.Mock).mockReturnValue('Jan 15, 2024');
        (getSpeciesDisplayName as jest.Mock).mockReturnValue('E. coli');
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
        (Clipboard.setStringAsync as jest.Mock).mockResolvedValue(undefined);
        (useFocusEffect as jest.Mock).mockImplementation((callback: any) => callback());
    });

    it('should load and display test data', async () => {
        (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResult] });

        const { getByText } = render(<ViewTest />);

        await waitFor(() => {
            expect(getByText('test_started_at_colon')).toBeTruthy();
            expect(getByText('test_status_colon')).toBeTruthy();
            expect(getByText('Completed')).toBeTruthy();
        });
    });

    it('should copy QR data to clipboard', async () => {
        (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResult] });

        const { getByTestId } = render(<ViewTest />);

        await waitFor(() => {
            const copyButton = getByTestId('icon-materialIcons-content-copy');
            fireEvent.press(copyButton);
        });

        expect(Clipboard.setStringAsync).toHaveBeenCalledWith('test-qr-data-123');
    });

    it('should navigate to scan when scan button is pressed', async () => {
        (Api.get as jest.Mock).mockResolvedValue({ data: [mockTestResult] });

        const { getByText } = render(<ViewTest />);

        await waitFor(() => {
            const scanButton = getByText('launch_scanner');
            fireEvent.press(scanButton);
        });

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Scan', { testId: 123 });
    });

    it('should show error when API fails', async () => {
        (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { getByText } = render(<ViewTest />);

        await waitFor(() => {
            expect(getByText('failed_to_load_test_results')).toBeTruthy();
        });
    });
});
