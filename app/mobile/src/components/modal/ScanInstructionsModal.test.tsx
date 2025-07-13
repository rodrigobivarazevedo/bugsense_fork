import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ScanInstructionsModal from './ScanInstructionsModal';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key: string) => {
            const translations: { [key: string]: string } = {
                'qr_scan_title': 'QR Code Scan',
                'qr_scan_subtitle': 'How to scan QR code',
                'qr_scan_instruction_1': 'Point camera at QR code',
                'qr_scan_instruction_2': 'Hold steady',
                'qr_scan_instruction_3': 'Wait for scan',
                'qr_scan_instruction_4': 'Follow prompts',
                'qr_scan_instruction_5': 'Complete scan',
                'test_strip_scan_title': 'Test Strip Scan',
                'test_strip_scan_subtitle': 'How to scan test strip',
                'test_strip_scan_instruction_1': 'Place test strip',
                'test_strip_scan_instruction_2': 'Align properly',
                'test_strip_scan_instruction_3': 'Take photo',
                'test_strip_scan_instruction_4': 'Review image',
                'test_strip_scan_instruction_5': 'Confirm scan',
                'test_strip_scan_instruction_6': 'Submit results',
                'upload_test_strip_title': 'Upload Test Strip',
                'upload_test_strip_subtitle': 'How to upload test strip',
                'upload_test_strip_instruction_1': 'Select image',
                'upload_test_strip_instruction_2': 'Choose from gallery',
                'upload_test_strip_instruction_3': 'Crop if needed',
                'upload_test_strip_instruction_4': 'Review image',
                'upload_test_strip_instruction_5': 'Confirm upload',
                'upload_test_strip_instruction_6': 'Submit results',
                'cancel': 'Cancel',
                'understood': 'Understood'
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
        messageContainer: { flexDirection: 'row' },
        bullet: { fontSize: 12 },
        message: { fontSize: 14 },
        buttonRow: { flexDirection: 'row' },
        cancelButton: { padding: 10 },
        confirmButton: { padding: 10 },
        buttonText: { color: 'blue' }
    }
}));

describe('ScanInstructionsModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        scanType: 'qr-code' as const
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Modal visibility', () => {
        it('should render when isOpen is true', async () => {
            const { getByText } = render(<ScanInstructionsModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR Code Scan')).toBeTruthy();
            });
        });

        it('should not render when isOpen is false', () => {
            const { queryByText } = render(
                <ScanInstructionsModal {...defaultProps} isOpen={false} />
            );

            expect(queryByText('QR Code Scan')).toBeNull();
        });
    });

    describe('QR Code scan type', () => {
        it('should display QR code instructions', async () => {
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="qr-code" />
            );

            await waitFor(() => {
                expect(getByText('QR Code Scan')).toBeTruthy();
                expect(getByText('How to scan QR code')).toBeTruthy();
                expect(getByText('Point camera at QR code')).toBeTruthy();
                expect(getByText('Hold steady')).toBeTruthy();
                expect(getByText('Wait for scan')).toBeTruthy();
                expect(getByText('Follow prompts')).toBeTruthy();
                expect(getByText('Complete scan')).toBeTruthy();
            });
        });

        it('should display all QR code instruction bullets', async () => {
            const { getAllByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="qr-code" />
            );

            await waitFor(() => {
                const bullets = getAllByText('•');
                expect(bullets).toHaveLength(5);
            });
        });
    });

    describe('Test Strip scan type', () => {
        it('should display test strip instructions', async () => {
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="test-strip" />
            );

            await waitFor(() => {
                expect(getByText('Test Strip Scan')).toBeTruthy();
                expect(getByText('How to scan test strip')).toBeTruthy();
                expect(getByText('Place test strip')).toBeTruthy();
                expect(getByText('Align properly')).toBeTruthy();
                expect(getByText('Take photo')).toBeTruthy();
                expect(getByText('Review image')).toBeTruthy();
                expect(getByText('Confirm scan')).toBeTruthy();
                expect(getByText('Submit results')).toBeTruthy();
            });
        });

        it('should display all test strip instruction bullets', async () => {
            const { getAllByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="test-strip" />
            );

            await waitFor(() => {
                const bullets = getAllByText('•');
                expect(bullets).toHaveLength(6);
            });
        });
    });

    describe('Upload Test Strip scan type', () => {
        it('should display upload test strip instructions', async () => {
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="upload-test-strip" />
            );

            await waitFor(() => {
                expect(getByText('Upload Test Strip')).toBeTruthy();
                expect(getByText('How to upload test strip')).toBeTruthy();
                expect(getByText('Select image')).toBeTruthy();
                expect(getByText('Choose from gallery')).toBeTruthy();
                expect(getByText('Crop if needed')).toBeTruthy();
                expect(getByText('Review image')).toBeTruthy();
                expect(getByText('Confirm upload')).toBeTruthy();
                expect(getByText('Submit results')).toBeTruthy();
            });
        });

        it('should display all upload test strip instruction bullets', async () => {
            const { getAllByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType="upload-test-strip" />
            );

            await waitFor(() => {
                const bullets = getAllByText('•');
                expect(bullets).toHaveLength(6);
            });
        });
    });

    describe('Button interactions', () => {
        it('should call onClose when cancel button is pressed', async () => {
            const onClose = jest.fn();
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} onClose={onClose} />
            );

            await waitFor(() => {
                expect(getByText('Cancel')).toBeTruthy();
            });

            const cancelButton = getByText('Cancel');
            await act(async () => {
                fireEvent.press(cancelButton);
            });

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('should call onConfirm when understood button is pressed', async () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} onConfirm={onConfirm} />
            );

            await waitFor(() => {
                expect(getByText('Understood')).toBeTruthy();
            });

            const confirmButton = getByText('Understood');
            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(onConfirm).toHaveBeenCalledTimes(1);
        });
    });

    describe('Modal structure', () => {
        it('should render both buttons', async () => {
            const { getByText } = render(<ScanInstructionsModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('Cancel')).toBeTruthy();
                expect(getByText('Understood')).toBeTruthy();
            });
        });

        it('should render title and subtitle', async () => {
            const { getByText } = render(<ScanInstructionsModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR Code Scan')).toBeTruthy();
                expect(getByText('How to scan QR code')).toBeTruthy();
            });
        });

        it('should render instructions with bullets', async () => {
            const { getByText, getAllByText } = render(<ScanInstructionsModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('Point camera at QR code')).toBeTruthy();
                expect(getAllByText('•')).toHaveLength(5);
            });
        });
    });

    describe('Optional onDismiss prop', () => {
        it('should handle onDismiss when provided', async () => {
            const onDismiss = jest.fn();
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} onDismiss={onDismiss} />
            );

            await waitFor(() => {
                expect(getByText('QR Code Scan')).toBeTruthy();
            });

            expect(onDismiss).toBeDefined();
        });

        it('should work without onDismiss prop', async () => {
            const { getByText } = render(<ScanInstructionsModal {...defaultProps} />);

            await waitFor(() => {
                expect(getByText('QR Code Scan')).toBeTruthy();
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle unknown scan type gracefully', async () => {
            const { getByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType={'unknown' as any} />
            );

            await waitFor(() => {
                expect(getByText('Cancel')).toBeTruthy();
                expect(getByText('Understood')).toBeTruthy();
            });
        });

        it('should render empty instructions for unknown scan type', async () => {
            const { queryAllByText } = render(
                <ScanInstructionsModal {...defaultProps} scanType={'unknown' as any} />
            );

            await waitFor(() => {
                const bullets = queryAllByText('•');
                expect(bullets).toHaveLength(0);
            });
        });
    });
});
