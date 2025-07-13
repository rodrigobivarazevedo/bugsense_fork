import { render, fireEvent } from '@testing-library/react-native';
import ConfirmationModal from './ConfirmationModal';

jest.mock('i18next', () => ({
    t: jest.fn((key: string) => {
        const translations: { [key: string]: string } = {
            'please_confirm': 'Please Confirm',
            'ok_capital': 'OK',
            'cancel': 'Cancel'
        };
        return translations[key] || key;
    })
}));

jest.mock('./Modal.styles', () => ({
    styles: {
        overlay: { flex: 1 },
        modal: { backgroundColor: 'white' },
        modalBody: { padding: 10 },
        heading: { fontSize: 16 },
        message: { fontSize: 14 },
        buttonRow: { flexDirection: 'row' },
        cancelButton: { padding: 10 },
        confirmButton: { padding: 10 },
        buttonText: { color: 'blue' }
    }
}));

describe('ConfirmationModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onConfirm: jest.fn(),
        message: 'Are you sure you want to proceed?'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Visibility', () => {
        it('should render when isOpen is true', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);
            expect(getByText('Are you sure you want to proceed?')).toBeTruthy();
        });

        it('should not render when isOpen is false', () => {
            const { queryByText } = render(
                <ConfirmationModal {...defaultProps} isOpen={false} />
            );
            expect(queryByText('Are you sure you want to proceed?')).toBeNull();
        });
    });

    describe('Default values', () => {
        it('should use default heading when not provided', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);
            expect(getByText('Please Confirm')).toBeTruthy();
        });

        it('should use default confirm text when not provided', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);
            expect(getByText('OK')).toBeTruthy();
        });

        it('should use default cancel text when not provided', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);
            expect(getByText('Cancel')).toBeTruthy();
        });
    });

    describe('Custom props', () => {
        it('should display custom heading when provided', () => {
            const customHeading = 'Custom Confirmation';
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} heading={customHeading} />
            );
            expect(getByText(customHeading)).toBeTruthy();
        });

        it('should display custom message', () => {
            const customMessage = 'This is a custom message';
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} message={customMessage} />
            );
            expect(getByText(customMessage)).toBeTruthy();
        });

        it('should display custom confirm text when provided', () => {
            const customConfirmText = 'Yes, proceed';
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} confirmText={customConfirmText} />
            );
            expect(getByText(customConfirmText)).toBeTruthy();
        });

        it('should display custom cancel text when provided', () => {
            const customCancelText = 'No, go back';
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} cancelText={customCancelText} />
            );
            expect(getByText(customCancelText)).toBeTruthy();
        });
    });

    describe('Button interactions', () => {
        it('should call onConfirm when confirm button is pressed', () => {
            const onConfirm = jest.fn();
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} onConfirm={onConfirm} />
            );

            const confirmButton = getByText('OK');
            fireEvent.press(confirmButton);

            expect(onConfirm).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when cancel button is pressed', () => {
            const onClose = jest.fn();
            const { getByText } = render(
                <ConfirmationModal {...defaultProps} onClose={onClose} />
            );

            const cancelButton = getByText('Cancel');
            fireEvent.press(cancelButton);

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when confirm button with custom text is pressed', () => {
            const onConfirm = jest.fn();
            const customConfirmText = 'Yes, proceed';
            const { getByText } = render(
                <ConfirmationModal
                    {...defaultProps}
                    onConfirm={onConfirm}
                    confirmText={customConfirmText}
                />
            );

            const confirmButton = getByText(customConfirmText);
            fireEvent.press(confirmButton);

            expect(onConfirm).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when cancel button with custom text is pressed', () => {
            const onClose = jest.fn();
            const customCancelText = 'No, go back';
            const { getByText } = render(
                <ConfirmationModal
                    {...defaultProps}
                    onClose={onClose}
                    cancelText={customCancelText}
                />
            );

            const cancelButton = getByText(customCancelText);
            fireEvent.press(cancelButton);

            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Modal structure', () => {
        it('should render both buttons', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);

            expect(getByText('OK')).toBeTruthy();
            expect(getByText('Cancel')).toBeTruthy();
        });

        it('should render heading and message', () => {
            const { getByText } = render(<ConfirmationModal {...defaultProps} />);

            expect(getByText('Please Confirm')).toBeTruthy();
            expect(getByText('Are you sure you want to proceed?')).toBeTruthy();
        });

        it('should not render heading when heading is empty string', () => {
            const { queryByText } = render(
                <ConfirmationModal {...defaultProps} heading="" />
            );

            expect(queryByText('Please Confirm')).toBeNull();
        });
    });
});
