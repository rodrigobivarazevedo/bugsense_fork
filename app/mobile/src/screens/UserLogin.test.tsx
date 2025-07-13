import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserLogin from './UserLogin';
import Api from '../api/Client';
import { suppressConsoleError, resumeConsoleError } from '../utils/UnitTestUtils';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('../components/Logo', () => {
    return function MockLogo() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', { testID: 'logo' }, 'Logo');
    };
});

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

jest.mock('../components/LanguageSwitcher', () => {
    return function MockLanguageSwitcher() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', { testID: 'language-switcher' }, 'LanguageSwitcher');
    };
});

const mockNavigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    navigateDeprecated: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
} as any;

const mockT = jest.fn((key: string) => key);

const mockLoginResponse = {
    data: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User',
        },
    },
};

describe('UserLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
        (Api.post as jest.Mock).mockResolvedValue(mockLoginResponse);
        jest.spyOn(Alert, 'alert').mockImplementation(() => { /* no-op */ });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should render login form with empty fields', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            expect(getByPlaceholderText('email_address')).toBeTruthy();
            expect(getByPlaceholderText('enter_your_password')).toBeTruthy();
            expect(getByText('login')).toBeTruthy();
        });

        it('should render all UI elements', () => {
            const { getByText, getByTestId } = render(<UserLogin navigation={mockNavigation} />);

            expect(getByTestId('logo')).toBeTruthy();
            expect(getByText('forgot_password')).toBeTruthy();
            expect(getByText('dont_have_an_account')).toBeTruthy();
            expect(getByText('register')).toBeTruthy();
            expect(getByText('are_you_medical_personnel')).toBeTruthy();
            expect(getByText('login_as_doctor')).toBeTruthy();
            expect(getByTestId('language-switcher')).toBeTruthy();
        });

        it('should have login button disabled initially', () => {
            const { getByText } = render(<UserLogin navigation={mockNavigation} />);

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });
    });

    describe('Form Inputs', () => {
        it('should update username when email input changes', () => {
            const { getByPlaceholderText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            fireEvent.changeText(emailInput, 'test@example.com');

            expect(emailInput.props.value).toBe('test@example.com');
        });

        it('should update password when password input changes', () => {
            const { getByPlaceholderText } = render(<UserLogin navigation={mockNavigation} />);

            const passwordInput = getByPlaceholderText('enter_your_password');
            fireEvent.changeText(passwordInput, 'password123');

            expect(passwordInput.props.value).toBe('password123');
        });

        it('should enable login button when both fields are filled', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });

        it('should disable login button when fields are empty', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, '');

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });
    });

    describe('Password Visibility', () => {
        it('should toggle password visibility when visibility icon is pressed', () => {
            const { getByPlaceholderText, getByTestId } = render(<UserLogin navigation={mockNavigation} />);

            const passwordInput = getByPlaceholderText('enter_your_password');
            const visibilityIcon = getByTestId('icon-materialIcons-visibility');

            expect(passwordInput.props.secureTextEntry).toBe(true);

            fireEvent.press(visibilityIcon);

            expect(passwordInput.props.secureTextEntry).toBe(false);
        });

        it('should show correct visibility icon based on state', () => {
            const { getByTestId } = render(<UserLogin navigation={mockNavigation} />);

            const visibilityIcon = getByTestId('icon-materialIcons-visibility');
            expect(visibilityIcon).toBeTruthy();

            fireEvent.press(visibilityIcon);

            const visibilityOffIcon = getByTestId('icon-materialIcons-visibility-off');
            expect(visibilityOffIcon).toBeTruthy();
        });
    });

    describe('Login Process', () => {
        it('should call login API with correct credentials', async () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(Api.post).toHaveBeenCalledWith('login/', {
                    email: 'test@example.com',
                    password: 'password123',
                });
            });
        });

        it('should save tokens and user data to AsyncStorage on successful login', async () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockLoginResponse.data.user));
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('userType', 'patient');
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'mock-access-token');
            });
        });

        it('should navigate to Main screen on successful login', async () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', { screen: 'Home' });
            });
        });
    });

    describe('Error Handling', () => {
        it('should show alert with error message when login fails', async () => {
            suppressConsoleError();
            const errorResponse = {
                response: {
                    data: {
                        detail: 'Invalid credentials',
                    },
                },
            };
            (Api.post as jest.Mock).mockRejectedValue(errorResponse);

            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'wrongpassword');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('login_failed', 'Invalid credentials');
            });
            resumeConsoleError();
        });

        it('should handle non_field_errors in error response', async () => {
            suppressConsoleError();
            const errorResponse = {
                response: {
                    data: {
                        non_field_errors: ['Account is locked'],
                    },
                },
            };
            (Api.post as jest.Mock).mockRejectedValue(errorResponse);

            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('login_failed', 'Account is locked');
            });
            resumeConsoleError();
        });

        it('should handle generic error messages', async () => {
            suppressConsoleError();
            const errorResponse = {
                message: 'Network error',
            };
            (Api.post as jest.Mock).mockRejectedValue(errorResponse);

            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('login_failed', 'Network error');
            });
            resumeConsoleError();
        });
    });

    describe('Navigation', () => {
        it('should navigate to password recovery with email', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            fireEvent.changeText(emailInput, 'test@example.com');

            const forgotPasswordButton = getByText('forgot_password');
            fireEvent.press(forgotPasswordButton);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('PasswordRecoveryStep1', {
                initialEmail: 'test@example.com',
            });
        });

        it('should navigate to register screen', () => {
            const { getByText } = render(<UserLogin navigation={mockNavigation} />);

            const registerLink = getByText('register');
            fireEvent.press(registerLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
        });

        it('should navigate to doctor login screen', () => {
            const { getByText } = render(<UserLogin navigation={mockNavigation} />);

            const doctorLoginLink = getByText('login_as_doctor');
            fireEvent.press(doctorLoginLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DoctorLogin');
        });
    });

    describe('Translation Integration', () => {
        it('should call translation function for all text elements', () => {
            render(<UserLogin navigation={mockNavigation} />);

            expect(mockT).toHaveBeenCalledWith('email_address');
            expect(mockT).toHaveBeenCalledWith('enter_your_password');
            expect(mockT).toHaveBeenCalledWith('forgot_password');
            expect(mockT).toHaveBeenCalledWith('login');
            expect(mockT).toHaveBeenCalledWith('dont_have_an_account');
            expect(mockT).toHaveBeenCalledWith('register');
            expect(mockT).toHaveBeenCalledWith('are_you_medical_personnel');
            expect(mockT).toHaveBeenCalledWith('login_as_doctor');
        });
    });

    describe('AsyncStorage Error Handling', () => {
        it('should handle AsyncStorage setItem errors gracefully', async () => {
            suppressConsoleError();
            (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(Api.post).toHaveBeenCalled();
            });
            resumeConsoleError();
        });
    });

    describe('Input Validation', () => {
        it('should handle empty email input', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, '');
            fireEvent.changeText(passwordInput, 'password123');

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });

        it('should handle empty password input', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, '');

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });

        it('should handle whitespace-only inputs', () => {
            const { getByPlaceholderText, getByText } = render(<UserLogin navigation={mockNavigation} />);

            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('enter_your_password');

            fireEvent.changeText(emailInput, '   ');
            fireEvent.changeText(passwordInput, '   ');

            const loginButton = getByText('login');
            expect(loginButton).toBeTruthy();
        });
    });
});
