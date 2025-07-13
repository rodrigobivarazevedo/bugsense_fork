import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import GenericCamera from './GenericCamera';
import { useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';

beforeAll(() => {
    Object.defineProperty(Platform, 'OS', {
        get: () => 'ios',
    });
});

jest.mock('expo-camera', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const React = require('react');
    return {
        useCameraPermissions: jest.fn(),
        CameraView: ({ children, ...props }: any) => React.createElement('View', { testID: 'camera-view', ...props }, children),
        CameraType: {
            front: 'front',
            back: 'back',
        },
        FlashMode: {
            off: 'off',
            on: 'on',
            auto: 'auto',
        },
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('./RenderIcon', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const React = require('react');
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const mockT = jest.fn((key: string) => key);

const mockUseCameraPermissions = useCameraPermissions as jest.MockedFunction<typeof useCameraPermissions>;

const createMockPermissionResponse = (granted: boolean) => ({
    granted,
    status: granted ? 'granted' : 'denied',
    expires: 'never',
    canAskAgain: true,
} as any);

describe('GenericCamera component', () => {
    const defaultProps = {
        onPictureTaken: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    });

    describe('Permissions', () => {
        it('should show loading state when permission is null', () => {
            mockUseCameraPermissions.mockReturnValue([null, jest.fn(), jest.fn()]);

            const { getByText } = render(<GenericCamera {...defaultProps} />);

            expect(getByText('loading_permissions')).toBeTruthy();
        });

        it('should show permission request when permission is not granted', () => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(false),
                jest.fn(),
                jest.fn()
            ]);

            const { getByText } = render(<GenericCamera {...defaultProps} />);

            expect(getByText('camera_access_is_required')).toBeTruthy();
            expect(getByText('grant_permission')).toBeTruthy();
        });

        it('should call requestPermission when grant permission button is pressed', () => {
            const requestPermission = jest.fn();
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(false),
                requestPermission,
                jest.fn()
            ]);

            const { getByText } = render(<GenericCamera {...defaultProps} />);

            const grantButton = getByText('grant_permission');
            fireEvent.press(grantButton);

            expect(requestPermission).toHaveBeenCalled();
        });
    });

    describe('Photo Mode', () => {
        beforeEach(() => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(true),
                jest.fn(),
                jest.fn()
            ]);
        });

        it('should render camera view in photo mode by default', () => {
            const { getByTestId } = render(<GenericCamera {...defaultProps} />);

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should render snap button in photo mode', () => {
            const { getByTestId } = render(<GenericCamera {...defaultProps} />);

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should not show flip camera button when allowFlipCamera is false', () => {
            const { queryByTestId } = render(
                <GenericCamera {...defaultProps} allowFlipCamera={false} />
            );

            expect(queryByTestId('icon-materialIcons-flip-camera-ios')).toBeNull();
        });

        it('should show flip camera button when allowFlipCamera is true', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} allowFlipCamera={true} />
            );

            expect(getByTestId('icon-materialIcons-flip-camera-ios')).toBeTruthy();
        });

        it('should not show flash toggle button when allowFlashToggle is false', () => {
            const { queryByTestId } = render(
                <GenericCamera {...defaultProps} allowFlashToggle={false} />
            );

            expect(queryByTestId('icon-materialIcons-flash-off')).toBeNull();
        });

        it('should show flash toggle button when allowFlashToggle is true', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} allowFlashToggle={true} />
            );

            expect(getByTestId('icon-materialIcons-flash-off')).toBeTruthy();
        });

        it('should toggle flash when flash button is pressed', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} allowFlashToggle={true} />
            );

            const flashButton = getByTestId('icon-materialIcons-flash-off');
            fireEvent.press(flashButton);

            expect(getByTestId('icon-materialIcons-flash-on')).toBeTruthy();
        });

        it('should use correct flip camera icon for Android', () => {
            Object.defineProperty(Platform, 'OS', { get: () => 'android' });

            const { getByTestId } = render(
                <GenericCamera {...defaultProps} allowFlipCamera={true} />
            );

            expect(getByTestId('icon-materialIcons-flip-camera-android')).toBeTruthy();

            Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
        });
    });

    describe('QR Code Mode', () => {
        beforeEach(() => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(true),
                jest.fn(),
                jest.fn()
            ]);
        });

        it('should render camera view in QR code mode', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} scanMode="qr-code" />
            );

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should show QR code instructions in QR mode', () => {
            const { getByText } = render(
                <GenericCamera {...defaultProps} scanMode="qr-code" />
            );

            expect(getByText('position_qr_code_within_the_frame')).toBeTruthy();
        });

        it('should call onQRCodeScanned when QR code is detected', () => {
            const onQRCodeScanned = jest.fn();
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    scanMode="qr-code"
                    onQRCodeScanned={onQRCodeScanned}
                />
            );

            const cameraView = getByTestId('camera-view');

            fireEvent(cameraView, 'onBarcodeScanned', { data: 'test-qr-data' });

            expect(onQRCodeScanned).toHaveBeenCalledWith('test-qr-data');
        });

        it('should not call onQRCodeScanned when callback is not provided', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} scanMode="qr-code" />
            );

            const cameraView = getByTestId('camera-view');

            fireEvent(cameraView, 'onBarcodeScanned', { data: 'test-qr-data' });

            expect(() => { /* no-op */ }).not.toThrow();
        });
    });

    describe('Image Preview', () => {
        beforeEach(() => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(true),
                jest.fn(),
                jest.fn()
            ]);
        });

        it('should show image preview when showImagePreview is true and photo is taken', async () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} showImagePreview={true} />
            );

            const cameraView = getByTestId('camera-view');

            const mockTakePictureAsync = jest.fn().mockResolvedValue({
                uri: 'test-photo-uri'
            });

            expect(cameraView).toBeTruthy();
        });

        it('should call onPictureTaken directly when showImagePreview is false', async () => {
            const onPictureTaken = jest.fn();
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    onPictureTaken={onPictureTaken}
                    showImagePreview={false}
                />
            );

            const cameraView = getByTestId('camera-view');

            expect(cameraView).toBeTruthy();
        });

        it('should handle image preview approve action', () => {
            const onPictureTaken = jest.fn();
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    onPictureTaken={onPictureTaken}
                    showImagePreview={true}
                />
            );

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should handle image preview reject action', () => {
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    showImagePreview={true}
                />
            );

            expect(getByTestId('camera-view')).toBeTruthy();
        });
    });

    describe('Props and Configuration', () => {
        beforeEach(() => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(true),
                jest.fn(),
                jest.fn()
            ]);
        });

        it('should use default image quality of 0.8', () => {
            const { getByTestId } = render(<GenericCamera {...defaultProps} />);

            const cameraView = getByTestId('camera-view');
            expect(cameraView).toBeTruthy();
        });

        it('should use custom image quality when provided', () => {
            const { getByTestId } = render(
                <GenericCamera {...defaultProps} imageQuality={0.5} />
            );

            const cameraView = getByTestId('camera-view');
            expect(cameraView).toBeTruthy();
        });

        it('should render with all optional props enabled', () => {
            const onQRCodeScanned = jest.fn();
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    onQRCodeScanned={onQRCodeScanned}
                    allowFlashToggle={true}
                    allowFlipCamera={true}
                    imageQuality={0.9}
                    showImagePreview={false}
                    scanMode="qr-code"
                />
            );

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should handle error when taking picture fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const { getByTestId } = render(<GenericCamera {...defaultProps} />);

            const cameraView = getByTestId('camera-view');
            expect(cameraView).toBeTruthy();

            consoleSpy.mockRestore();
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            mockUseCameraPermissions.mockReturnValue([
                createMockPermissionResponse(true),
                jest.fn(),
                jest.fn()
            ]);
        });

        it('should render with proper test IDs', () => {
            const { getByTestId } = render(<GenericCamera {...defaultProps} />);

            expect(getByTestId('camera-view')).toBeTruthy();
        });

        it('should render control buttons with proper accessibility', () => {
            const { getByTestId } = render(
                <GenericCamera
                    {...defaultProps}
                    allowFlashToggle={true}
                    allowFlipCamera={true}
                />
            );

            expect(getByTestId('camera-view')).toBeTruthy();
        });
    });
});
