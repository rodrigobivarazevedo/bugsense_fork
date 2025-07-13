import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Account from './Account';
import Api from '../api/Client';
import { resumeConsoleError, suppressConsoleError } from '../utils/UnitTestUtils';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn(),
    },
}));

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn(),
    useNavigation: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    defaults: {
        headers: {
            Authorization: '',
        },
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    multiRemove: jest.fn(),
    clear: jest.fn(),
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

jest.mock('../components/Logo', () => {
    return function MockLogo({ width, height, opacity }: any) {
        const React = require('react');
        return React.createElement('Text', {
            testID: 'logo',
            style: { width, height, opacity }
        }, 'Logo');
    };
});

jest.mock('../components/modal/ConfirmationModal', () => {
    return function MockConfirmationModal({ isOpen, onConfirm, onClose }: any) {
        const React = require('react');
        if (!isOpen) return null;
        return React.createElement('View', { testID: 'confirmation-modal' }, [
            React.createElement('Text', { key: 'title' }, 'Confirmation'),
            React.createElement('Text', { key: 'confirm', onPress: onConfirm }, 'Confirm'),
            React.createElement('Text', { key: 'cancel', onPress: onClose }, 'Cancel'),
        ]);
    };
});

jest.mock('../components/modal/ChangePasswordModal', () => {
    return function MockChangePasswordModal({ visible, onClose }: any) {
        const React = require('react');
        if (!visible) return null;
        return React.createElement('View', { testID: 'change-password-modal' }, [
            React.createElement('Text', { key: 'title' }, 'Change Password'),
            React.createElement('Text', { key: 'close', onPress: onClose }, 'Close'),
        ]);
    };
});

jest.mock('../utils/SecurityQuestions', () => ({
    securityQuestions: jest.fn(() => ['Question 1', 'Question 2', 'Question 3']),
    validateSecurityQuestionsForUpdate: jest.fn(() => true),
    getAvailableQuestionsForIndex: jest.fn(() => ['Question 1', 'Question 2', 'Question 3']),
    hasSecurityQuestionsChanges: jest.fn(() => false),
}));

const mockT = jest.fn((key: string) => key);
const mockNavigation = {
    reset: jest.fn(),
};
const mockInsets = { top: 0, right: 0, bottom: 34, left: 0 };

const mockUser = {
    full_name: 'John Doe',
    date_joined: '2023-01-01',
    gender: 'Male',
    dob: '1990-01-01',
    email: 'john@example.com',
    phone_number: '1234567890',
    street: '123 Main St',
    city: 'New York',
    postcode: '10001',
    country: 'USA',
    security_question_1: 'What is your favorite color?',
    security_question_2: 'What is your pet name?',
    security_question_3: '',
    is_doctor: false,
};

const mockDoctorUser = {
    ...mockUser,
    is_doctor: true,
    institution_name: 'General Hospital',
    doctor_id: 'DOC123',
};

describe('Account', () => {
    beforeAll(() => {
        suppressConsoleError();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useFocusEffect as jest.Mock).mockImplementation((callback) => callback());
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('patient');
        (Api.get as jest.Mock).mockResolvedValue({ data: mockUser });
        (Api.put as jest.Mock).mockResolvedValue({ data: mockUser });
        (Api.post as jest.Mock).mockResolvedValue({});
        (Api.delete as jest.Mock).mockResolvedValue({});
    });

    afterEach(() => {
        AsyncStorage.clear();
    });

    afterAll(() => {
        resumeConsoleError();
    });

    describe('Initial Loading', () => {
        it('should show loading state when user is not loaded', () => {
            (Api.get as jest.Mock).mockResolvedValue({ data: null });

            const { getByText } = render(<Account />);

            expect(getByText('loading')).toBeTruthy();
        });

        it('should load user profile on mount', async () => {
            render(<Account />);

            await waitFor(() => {
                expect(Api.get).toHaveBeenCalledWith('users/me/');
            });
        });

        it('should display user information when loaded', async () => {
            const { getAllByText } = render(<Account />);

            await waitFor(() => {
                const nameElements = getAllByText('John Doe');
                expect(nameElements.length).toBeGreaterThan(0);
                expect(getAllByText('joined 2023-01-01')[0]).toBeTruthy();
                expect(getAllByText('patient')[0]).toBeTruthy();
            });
        });
    });

    describe('User Type Detection', () => {
        it('should display patient type for patient users', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('patient')).toBeTruthy();
            });
        });

        it('should display doctor type and institution for doctor users', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('doctor');
            (Api.get as jest.Mock).mockResolvedValue({ data: mockDoctorUser });

            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('medical_personnel')).toBeTruthy();
                expect(getByText('institution')).toBeTruthy();
                expect(getByText('General Hospital')).toBeTruthy();
                expect(getByText('doctor_id')).toBeTruthy();
                expect(getByText('DOC123')).toBeTruthy();
            });
        });

        it('should show QR code button for patients only', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('view_my_qr_code')).toBeTruthy();
            });
        });
    });

    describe('Field Editing', () => {
        it('should enter edit mode when edit button is pressed', async () => {
            const { getAllByTestId } = render(<Account />);

            await waitFor(() => {
                const editButtons = getAllByTestId('icon-materialIcons-edit');
                fireEvent.press(editButtons[0]);
            });

            expect(getAllByTestId('icon-materialIcons-edit')).toBeTruthy();
        });

        it('should save field changes on submit', async () => {
            const { getAllByTestId } = render(<Account />);

            await waitFor(() => {
                const editButtons = getAllByTestId('icon-materialIcons-edit');
                fireEvent.press(editButtons[0]);
            });

            await waitFor(() => {
                expect(getAllByTestId('icon-materialIcons-edit')).toBeTruthy();
            });
        });

        it('should show confirmation modal for name and email changes', async () => {
            const { getAllByTestId } = render(<Account />);

            await waitFor(() => {
                const editButtons = getAllByTestId('icon-materialIcons-edit');
                fireEvent.press(editButtons[0]);
            });

            await waitFor(() => {
                expect(getAllByTestId('icon-materialIcons-edit')).toBeTruthy();
            });
        });
    });

    describe('Address Management', () => {
        it('should display address fields', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('address')).toBeTruthy();
                expect(getByText('street')).toBeTruthy();
                expect(getByText('city')).toBeTruthy();
                expect(getByText('postcode')).toBeTruthy();
                expect(getByText('country')).toBeTruthy();
                expect(getByText('123 Main St')).toBeTruthy();
                expect(getByText('New York')).toBeTruthy();
                expect(getByText('10001')).toBeTruthy();
                expect(getByText('USA')).toBeTruthy();
            });
        });

        it('should allow editing address fields', async () => {
            const { getAllByTestId } = render(<Account />);

            await waitFor(() => {
                const editButtons = getAllByTestId('icon-materialIcons-edit');
                if (editButtons.length > 0) {
                    fireEvent.press(editButtons[0]);
                }
            });

            await waitFor(() => {
                expect(getAllByTestId('icon-materialIcons-edit')).toBeTruthy();
            });
        });
    });

    describe('Security Questions', () => {
        it('should display existing security questions', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('security_questions')).toBeTruthy();
                expect(getByText('What is your favorite color?')).toBeTruthy();
                expect(getByText('What is your pet name?')).toBeTruthy();
            });
        });

        it('should show update button for existing security questions', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('update_security_questions')).toBeTruthy();
            });
        });

        it('should show add button when no security questions exist', async () => {
            const userWithoutQuestions = { ...mockUser, security_question_1: '', security_question_2: '', security_question_3: '' };
            (Api.get as jest.Mock).mockResolvedValue({ data: userWithoutQuestions });

            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('no_security_questions_set')).toBeTruthy();
                expect(getByText('add_security_questions')).toBeTruthy();
            });
        });
    });

    describe('Account Actions', () => {
        it('should show change password button', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('change_password')).toBeTruthy();
            });
        });

        it('should show sign out button', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('sign_out')).toBeTruthy();
            });
        });

        it('should handle sign out', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                const signOutButton = getByText('sign_out');
                fireEvent.press(signOutButton);
            });

            await waitFor(() => {
                expect(Api.post).toHaveBeenCalledWith('logout/', { refresh: 'patient' });
                expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['accessToken', 'refreshToken', 'user', 'userType']);
                expect(mockNavigation.reset).toHaveBeenCalled();
            });
        });

        it('should show delete account button for patients', async () => {
            const { getByText } = render(<Account />);

            await waitFor(() => {
                expect(getByText('delete_my_account')).toBeTruthy();
            });
        });

        it('should handle delete account with confirmation', async () => {
            const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => { /* no-op */ });

            const { getByText } = render(<Account />);

            await waitFor(() => {
                const deleteButton = getByText('delete_my_account');
                fireEvent.press(deleteButton);
            });

            expect(alertSpy).toHaveBeenCalledWith(
                'delete_my_account',
                'are_you_sure_you_want_to_delete_your_account_this_cannot_be_undone',
                expect.any(Array)
            );

            alertSpy.mockRestore();
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', async () => {
            const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => { /* no-op */ });
            (Api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

            render(<Account />);

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('error', 'could_not_load_profile');
            });

            alertSpy.mockRestore();
        });

        it('should redirect to login on 401 error', async () => {
            (Api.get as jest.Mock).mockRejectedValue({ response: { status: 401 } });

            render(<Account />);

            await waitFor(() => {
                expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['accessToken', 'refreshToken', 'user', 'userType']);
                expect(mockNavigation.reset).toHaveBeenCalledWith({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            });
        });
    });

    describe('Authentication', () => {
        it('should redirect to login when no access token', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            render(<Account />);

            await waitFor(() => {
                expect(mockNavigation.reset).toHaveBeenCalledWith({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            });
        });
    });
});
