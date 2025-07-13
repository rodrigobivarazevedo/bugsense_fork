import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import PasswordRecoveryStep1 from './PasswordRecoveryStep1';
import Api from '../../api/Client';
import validateEmail from '../../utils/ValidateEmail';
import { suppressConsoleError, resumeConsoleError } from '../../utils/UnitTestUtils';

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('../../utils/ValidateEmail', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../components/Logo', () => {
    return function MockLogo() {
        const React = require('react');
        return React.createElement('View', { testID: 'logo' }, 'Logo');
    };
});

// @ts-ignore
global.setImmediate = jest.fn();
global.clearImmediate = jest.fn();

const mockNavigation = { navigate: jest.fn() };
const mockT = jest.fn((key: string) => key);

describe('PasswordRecoveryStep1', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRoute as jest.Mock).mockReturnValue({ params: {} });
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (validateEmail as jest.Mock).mockReturnValue({ isValid: true, errorMessage: '' });
    });

    it('should render email input and button', () => {
        const { getByPlaceholderText, getByText } = render(
            <PasswordRecoveryStep1 navigation={mockNavigation as any} />
        );

        expect(getByPlaceholderText('email_address')).toBeTruthy();
        expect(getByText('get_security_questions')).toBeTruthy();
    });

    it('should navigate to step 2 when security questions are retrieved', async () => {
        (Api.post as jest.Mock).mockResolvedValue({
            data: { questions: ['What is your pet name?', 'Where were you born?'] }
        });

        const { getByText, getByPlaceholderText } = render(
            <PasswordRecoveryStep1 navigation={mockNavigation as any} />
        );

        const emailInput = getByPlaceholderText('email_address');
        fireEvent.changeText(emailInput, 'test@example.com');

        const button = getByText('get_security_questions');
        fireEvent.press(button);

        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('PasswordRecoveryStep2', {
                email: 'test@example.com',
                questions: ['What is your pet name?', 'Where were you born?']
            });
        });
    });

    it('should show error when API fails', async () => {
        suppressConsoleError();
        (Api.post as jest.Mock).mockRejectedValue(new Error('Network error'));
        const alertSpy = jest.spyOn(Alert, 'alert');

        const { getByText, getByPlaceholderText } = render(
            <PasswordRecoveryStep1 navigation={mockNavigation as any} />
        );

        const emailInput = getByPlaceholderText('email_address');
        fireEvent.changeText(emailInput, 'test@example.com');

        const button = getByText('get_security_questions');
        fireEvent.press(button);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('error', 'Network error');
        });

        resumeConsoleError();
    });

    it('should navigate to login when no security questions', async () => {
        (Api.post as jest.Mock).mockResolvedValue({
            data: { questions: ['', '', ''] }
        });
        const alertSpy = jest.spyOn(Alert, 'alert');

        const { getByText, getByPlaceholderText } = render(
            <PasswordRecoveryStep1 navigation={mockNavigation as any} />
        );

        const emailInput = getByPlaceholderText('email_address');
        fireEvent.changeText(emailInput, 'test@example.com');

        const button = getByText('get_security_questions');
        fireEvent.press(button);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('error', 'no_security_questions_set_contact_admin', [
                { text: 'ok', onPress: expect.any(Function) }
            ]);
        });
    });
}); 