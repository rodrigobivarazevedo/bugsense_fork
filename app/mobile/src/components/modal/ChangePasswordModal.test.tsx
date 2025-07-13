import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePasswordModal from './ChangePasswordModal';
import Api from '../../api/Client';

jest.mock('../../api/Client');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../utils/ValidatePassword', () => ({
    validatePassword: jest.fn(() => ''),
}));
jest.mock('../RenderIcon', () => () => null);

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
                'Change Password': 'Change Password',
                'Enter current password': 'Enter current password',
                'Enter new password': 'Enter new password',
                'Confirm new password': 'Confirm new password',
                'cancel': 'Cancel',
                'save': 'Save',
                'success': 'Success',
                'error': 'Error',
                'password_changed_successfully': 'Password changed successfully',
            },
        },
    },
});

const mockApi = Api as jest.Mocked<typeof Api>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
};

const renderWithI18n = async (component: React.ReactElement, shouldWaitForAsync = true) => {
    const result = render(
        <I18nextProvider i18n={i18n}>
            {component}
        </I18nextProvider>
    );
    if (shouldWaitForAsync) {
        await waitFor(() => {
            expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('user');
        });
    }
    return result;
};

describe('ChangePasswordModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify({
            email: 'test@example.com',
            full_name: 'Test User',
        }));
    });

    it('renders when visible', async () => {
        const { getByText, getByPlaceholderText } = await renderWithI18n(
            <ChangePasswordModal {...defaultProps} />
        );
        expect(getByText('Change Password')).toBeTruthy();
        expect(getByPlaceholderText('Enter current password')).toBeTruthy();
        expect(getByPlaceholderText('Enter new password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
    });

    it('does not render when not visible', async () => {
        const { queryByText } = await renderWithI18n(
            <ChangePasswordModal {...defaultProps} visible={false} />,
            false
        );
        expect(queryByText('Change Password')).toBeNull();
    });

    it('enables save button when all fields are filled and passwords match', async () => {
        const { getByText, getByPlaceholderText } = await renderWithI18n(
            <ChangePasswordModal {...defaultProps} />
        );
        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');
        fireEvent.changeText(currentPasswordInput, 'oldpass123');
        fireEvent.changeText(newPasswordInput, 'newpass123');
        fireEvent.changeText(confirmPasswordInput, 'newpass123');
        const saveButton = getByText('Save');
        expect(saveButton.parent?.props.disabled).toBeFalsy();
    });

    it('calls API and onSuccess/onClose on successful save', async () => {
        mockApi.post.mockResolvedValue({ data: {} });
        const onSuccess = jest.fn();
        const onClose = jest.fn();
        const { getByText, getByPlaceholderText } = await renderWithI18n(
            <ChangePasswordModal {...defaultProps} onSuccess={onSuccess} onClose={onClose} />
        );
        fireEvent.changeText(getByPlaceholderText('Enter current password'), 'oldpass123');
        fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpass123');
        fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpass123');
        await act(async () => {
            fireEvent.press(getByText('Save'));
        });
        await waitFor(() => {
            expect(mockApi.post).toHaveBeenCalledWith('change-password/', {
                old_password: 'oldpass123',
                new_password: 'newpass123',
            });
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Password changed successfully');
            expect(onSuccess).toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows error alert on API failure', async () => {
        mockApi.post.mockRejectedValue({ message: 'Network error' });
        const { getByText, getByPlaceholderText } = await renderWithI18n(
            <ChangePasswordModal {...defaultProps} />
        );
        fireEvent.changeText(getByPlaceholderText('Enter current password'), 'oldpass123');
        fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpass123');
        fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpass123');
        await act(async () => {
            fireEvent.press(getByText('Save'));
        });
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
        });
    });
});
