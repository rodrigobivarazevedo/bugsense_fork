import { render, fireEvent } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PasswordRecoveryStep3 from './PasswordRecoveryStep3';
import { validatePassword } from '../../utils/ValidatePassword';

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('../../utils/ValidatePassword', () => ({
    validatePassword: jest.fn(),
}));

jest.mock('../../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

// @ts-ignore
global.setImmediate = jest.fn();
global.clearImmediate = jest.fn();

const mockNavigation = { navigate: jest.fn() };
const mockT = jest.fn((key: string) => key);
const mockRouteParams = {
    email: 'test@example.com',
    token: 'test-token'
};

describe('PasswordRecoveryStep3', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRoute as jest.Mock).mockReturnValue({ params: mockRouteParams });
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (validatePassword as jest.Mock).mockReturnValue('');
    });

    it('should render password inputs and reset button', () => {
        const { getByPlaceholderText, getAllByText } = render(
            <PasswordRecoveryStep3 navigation={mockNavigation as any} />
        );

        expect(getByPlaceholderText('new_password')).toBeTruthy();
        expect(getByPlaceholderText('confirm_new_password')).toBeTruthy();
        expect(getAllByText('set_new_password')[0]).toBeTruthy();
    });

    it('should handle password input changes', () => {
        const { getByPlaceholderText } = render(
            <PasswordRecoveryStep3 navigation={mockNavigation as any} />
        );

        const newPasswordInput = getByPlaceholderText('new_password');
        const confirmPasswordInput = getByPlaceholderText('confirm_new_password');

        fireEvent.changeText(newPasswordInput, 'NewPass123!');
        fireEvent.changeText(confirmPasswordInput, 'NewPass123!');

        expect(newPasswordInput.props.value).toBe('NewPass123!');
        expect(confirmPasswordInput.props.value).toBe('NewPass123!');
    });
}); 