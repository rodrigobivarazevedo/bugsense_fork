import { render, fireEvent } from '@testing-library/react-native';
import ForgotPassword from './ForgotPassword';

jest.mock('@react-navigation/native-stack', () => ({
    NativeStackNavigationProp: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'email_address': 'Email address',
                'continue': 'Continue',
                'remember_your_password': 'Remember your password?',
                'login': 'Login',
                'email_is_required': 'Email is required',
                'please_enter_a_valid_email_address': 'Please enter a valid email address',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../utils/ValidateEmail', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../components/Logo', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'logo', ...props });
    });
});

const mockNavigation = {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    navigateDeprecated: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
} as any;

const mockValidateEmail = require('../utils/ValidateEmail').default as jest.MockedFunction<any>;

describe('ForgotPassword component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });
    });

    it('renders without crashing', () => {
        expect(() => render(<ForgotPassword navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders all main components', () => {
        const { getByTestId, getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        expect(getByTestId('logo')).toBeTruthy();
        expect(getByPlaceholderText('Email address')).toBeTruthy();
        expect(getByText('Continue')).toBeTruthy();
        expect(getByText('Remember your password?')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
    });

    it('updates email input', () => {
        const { getByPlaceholderText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test@example.com');

        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('validates email on input change', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'invalid-email');

        expect(mockValidateEmail).toHaveBeenCalledWith({ email: 'invalid-email' });
        expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    it('clears email error when valid email is entered', () => {
        mockValidateEmail
            .mockReturnValueOnce({
                isValid: false,
                errorMessage: 'Please enter a valid email address',
            })
            .mockReturnValueOnce({
                isValid: true,
                errorMessage: '',
            });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');

        fireEvent.changeText(emailInput, 'invalid-email');
        expect(queryByText('Please enter a valid email address')).toBeTruthy();

        fireEvent.changeText(emailInput, 'test@example.com');
        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('navigates to password recovery step 1 when form is submitted with valid email', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test@example.com');

        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('PasswordRecoveryStep1');
    });

    it('shows validation error when form is submitted with invalid email', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'invalid-email');

        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);

        expect(getByText('Please enter a valid email address')).toBeTruthy();
        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it('navigates to login when login link is pressed', () => {
        const { getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const loginLink = getByText('Login');
        fireEvent.press(loginLink);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });

    it('handles empty email validation', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Email is required',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, '');

        expect(getByText('Email is required')).toBeTruthy();
    });

    it('handles email with spaces', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test @example.com');

        expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    it('handles email without domain', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test@');

        expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    it('handles email without @ symbol', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'testexample.com');

        expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    it('handles valid email formats', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
        expect(queryByText('Email is required')).toBeFalsy();
    });

    it('handles email with special characters', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test+tag@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with numbers', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test123@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with uppercase letters', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'TEST@EXAMPLE.COM');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles very long email addresses', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
        fireEvent.changeText(emailInput, longEmail);

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with multiple dots in domain', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test@example.co.uk');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with underscores', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test_user@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with hyphens', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test-user@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with dots in local part', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, 'test.user@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
    });

    it('handles email with leading/trailing spaces', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Please enter a valid email address',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, ' test@example.com ');

        expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    it('handles rapid email input changes', () => {
        mockValidateEmail.mockReturnValue({
            isValid: true,
            errorMessage: '',
        });

        const { getByPlaceholderText, queryByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');

        fireEvent.changeText(emailInput, 'a');
        fireEvent.changeText(emailInput, 'ab');
        fireEvent.changeText(emailInput, 'abc');
        fireEvent.changeText(emailInput, 'test@example.com');

        expect(queryByText('Please enter a valid email address')).toBeFalsy();
        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('handles form submission with whitespace-only email', () => {
        mockValidateEmail.mockReturnValue({
            isValid: false,
            errorMessage: 'Email is required',
        });

        const { getByPlaceholderText, getByText } = render(<ForgotPassword navigation={mockNavigation} />);

        const emailInput = getByPlaceholderText('Email address');
        fireEvent.changeText(emailInput, '   ');

        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);

        expect(getByText('Email is required')).toBeTruthy();
        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
});
