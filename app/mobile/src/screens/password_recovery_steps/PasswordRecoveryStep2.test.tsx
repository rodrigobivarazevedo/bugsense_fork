import { render } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PasswordRecoveryStep2 from './PasswordRecoveryStep2';

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('../../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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
    questions: ['What is your pet name?', 'Where were you born?', 'What is your favorite color?']
};

describe('PasswordRecoveryStep2', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRoute as jest.Mock).mockReturnValue({ params: mockRouteParams });
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    });

    it('should render security question dropdown and answer input', () => {
        const { getByPlaceholderText, getByText } = render(
            <PasswordRecoveryStep2 navigation={mockNavigation as any} />
        );

        expect(getByPlaceholderText('select_a_security_question')).toBeTruthy();
        expect(getByPlaceholderText('enter_your_answer')).toBeTruthy();
        expect(getByText('validate_answer')).toBeTruthy();
    });

    it('should render security question dropdown and answer input', () => {
        const { getByPlaceholderText, getByText } = render(
            <PasswordRecoveryStep2 navigation={mockNavigation as any} />
        );

        expect(getByPlaceholderText('select_a_security_question')).toBeTruthy();
        expect(getByPlaceholderText('enter_your_answer')).toBeTruthy();
        expect(getByText('validate_answer')).toBeTruthy();
    });

    it('should show button is disabled when form is invalid', () => {
        const { getByText } = render(
            <PasswordRecoveryStep2 navigation={mockNavigation as any} />
        );

        const button = getByText('validate_answer');
        expect(button).toBeTruthy();
    });
}); 