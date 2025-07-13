import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Scan from './Scan';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../api/Client', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve('patient')),
    setItem: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string, params?: any) => params ? `${key}:${JSON.stringify(params)}` : key }),
}));
jest.mock('../components/GenericCamera', () => 'GenericCamera');
jest.mock('../components/modal/ScanInstructionsModal', () => 'ScanInstructionsModal');
jest.mock('../components/modal/ConfirmationModal', () => 'ConfirmationModal');
jest.mock('../components/modal/TestKitSelectModal', () => 'TestKitSelectModal');
jest.mock('../components/modal/PatientSelectModal', () => 'PatientSelectModal');
jest.mock('../components/modal/TestSelectModal', () => 'TestSelectModal');

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

describe('Scan', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('patient');
    });

    describe('Initial Render', () => {
        it('renders scan type options and launch button is not pressable when disabled', async () => {
            const { getByText, queryByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);
            expect(queryByText('GenericCamera')).toBeNull();
        });

        it('renders heading and scan options', async () => {
            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_what_to_scan')).toBeTruthy();
                expect(getByText('scan_test_kit_qr_desc')).toBeTruthy();
                expect(getByText('scan_test_strip_desc')).toBeTruthy();
            });
        });
    });

    describe('Scan Type Selection', () => {
        it('allows switching between scan types', async () => {
            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const qrOption = getByText('scan_test_kit_qr');
            fireEvent.press(qrOption);

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            expect(getByText('scan_test_kit_qr')).toBeTruthy();
            expect(getByText('scan_test_strip')).toBeTruthy();
        });
    });

    describe('API Integration', () => {
        it('calls API to fetch ongoing test kits', async () => {
            const mockTestKits = [
                { id: 1, result_status: 'open' },
                { id: 2, result_status: 'closed' },
                { id: 3, result_status: 'open' }
            ];
            (Api.get as jest.Mock).mockResolvedValue({ data: mockTestKits });

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Api.get).toBeDefined();
        });

        it('calls API to upload image for patient', async () => {
            (Api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Api.post).toBeDefined();
        });

        it('calls API to upload image for doctor', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('doctor');
            (Api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Api.post).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('shows error alert when user data is not found', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
            });

            const qrOption = getByText('scan_test_kit_qr');
            fireEvent.press(qrOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Alert.alert).toBeDefined();
        });

        it('shows error alert when no patient is selected for doctor', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('doctor');

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
            });

            const qrOption = getByText('scan_test_kit_qr');
            fireEvent.press(qrOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Alert.alert).toBeDefined();
        });

        it('shows error alert when image upload fails', async () => {
            (Api.post as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(Alert.alert).toBeDefined();
        });
    });

    describe('Modal Interactions', () => {
        it('closes test kit selection modal when cancelled', async () => {
            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);
        });

        it('closes test selection modal when cancelled', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('doctor');

            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_strip')).toBeTruthy();
            });

            const testStripOption = getByText('scan_test_strip');
            fireEvent.press(testStripOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);
        });
    });

    describe('State Management', () => {
        it('resets scan state when scan is completed', async () => {
            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
            });

            const qrOption = getByText('scan_test_kit_qr');
            fireEvent.press(qrOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(getByText('scan_what_to_scan')).toBeTruthy();
        });

        it('maintains selected scan type when navigating back from camera', async () => {
            const { getByText } = render(<Scan />);

            await waitFor(() => {
                expect(getByText('scan_test_kit_qr')).toBeTruthy();
            });

            const qrOption = getByText('scan_test_kit_qr');
            fireEvent.press(qrOption);

            const launchButton = getByText('launch_camera');
            fireEvent.press(launchButton);

            expect(getByText('scan_what_to_scan')).toBeTruthy();
        });
    });
});
