import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChangePasswordModal from './ChangePasswordModal';
import Api from '../../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validatePassword } from '../../utils/ValidatePassword';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('../../utils/ValidatePassword', () => ({
    validatePassword: jest.fn(),
}));

jest.mock('../../theme/GlobalTheme', () => ({
    themeColors: {
        primary: '#007AFF',
        white: '#FFFFFF',
    },
}));

jest.mock('../RenderIcon', () => {
    return function MockRenderIcon() {
        return null;
    };
});

describe('ChangePasswordModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
            email: 'test@example.com',
            full_name: 'Test User'
        }));
        (validatePassword as jest.Mock).mockReturnValue('');
    });

    it('renders correctly when visible', async () => {
        const { getByText, getByPlaceholderText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByText('Change Password')).toBeTruthy();
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
            expect(getByPlaceholderText('Enter new password')).toBeTruthy();
            expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
            expect(getByText('cancel')).toBeTruthy();
            expect(getByText('save')).toBeTruthy();
        });
    });

    it('does not render when not visible', () => {
        const { queryByText } = render(
            <ChangePasswordModal visible={false} onClose={mockOnClose} />
        );

        expect(queryByText('Change Password')).toBeNull();
    });

    it('fills form and calls API successfully', async () => {
        (Api.post as jest.Mock).mockResolvedValue({});

        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Api.post).toHaveBeenCalledWith('change-password/', {
                old_password: 'oldpass123',
                new_password: 'newpass123',
            });
        });

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('handles API error', async () => {
        const errorMessage = 'Invalid current password';
        (Api.post as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    old_password: [errorMessage]
                }
            }
        });

        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'wrongpass');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Api.post).toHaveBeenCalled();
        });
    });

    it('shows error message when passwords do not match', async () => {
        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter new password')).toBeTruthy();
        });

        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'differentpass123');

        await waitFor(() => {
            expect(getByText('passwords_do_not_match')).toBeTruthy();
        });
    });

    it('clears error message when passwords match', async () => {
        const { getByPlaceholderText, queryByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter new password')).toBeTruthy();
        });

        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        // First set different passwords to show error
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'differentpass123');

        await waitFor(() => {
            expect(queryByText('passwords_do_not_match')).toBeTruthy();
        });

        // Then set matching passwords to clear error
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        await waitFor(() => {
            expect(queryByText('passwords_do_not_match')).toBeNull();
        });
    });

    it('enables save button when all fields are valid', async () => {
        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save').parent;
        expect(saveButton?.props.disabled).toBeFalsy();
    });

    it('calls onClose when cancel button is pressed', async () => {
        const { getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByText('cancel')).toBeTruthy();
        });

        const cancelButton = getByText('cancel');
        fireEvent.press(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('clears all fields when modal is closed', async () => {
        const { getByPlaceholderText, rerender } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        // Close modal
        rerender(<ChangePasswordModal visible={false} onClose={mockOnClose} />);

        // Reopen modal
        rerender(<ChangePasswordModal visible={true} onClose={mockOnClose} />);

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password').props.value).toBe('');
            expect(getByPlaceholderText('Enter new password').props.value).toBe('');
            expect(getByPlaceholderText('Confirm new password').props.value).toBe('');
        });
    });

    it('handles AsyncStorage error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { /* no-op */ });
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

        render(<ChangePasswordModal visible={true} onClose={mockOnClose} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting user data from AsyncStorage:',
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });

    it('handles API error with non_field_errors', async () => {
        const errorMessage = 'General error occurred';
        (Api.post as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    non_field_errors: [errorMessage]
                }
            }
        });

        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Api.post).toHaveBeenCalled();
        });
    });

    it('handles API error with generic error field', async () => {
        const errorMessage = 'Some other error';
        (Api.post as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    some_field: [errorMessage]
                }
            }
        });

        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Api.post).toHaveBeenCalled();
        });
    });

    it('handles API error with non-array error field', async () => {
        const errorMessage = 'Single error message';
        (Api.post as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    some_field: errorMessage
                }
            }
        });

        const { getByPlaceholderText, getByText } = render(
            <ChangePasswordModal visible={true} onClose={mockOnClose} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        });

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');

        const saveButton = getByText('save');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Api.post).toHaveBeenCalled();
        });
    });
});
