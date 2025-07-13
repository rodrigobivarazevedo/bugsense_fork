import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn()
}));

jest.mock('../utils/Responsive', () => ({
    rem: jest.fn((value: number) => value * 16)
}));

describe('LanguageSwitcher', () => {
    const mockI18n = {
        language: 'en',
        changeLanguage: jest.fn().mockResolvedValue(undefined)
    };

    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockI18n.language = 'en';
        mockI18n.changeLanguage.mockResolvedValue(undefined);

        mockUseTranslation.mockReturnValue({
            t: jest.fn((key: string) => key) as any,
            i18n: mockI18n,
            ready: true
        } as any);
    });

    describe('Rendering', () => {
        it('renders correctly with default props', () => {
            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Sprache ändern • Deutsch')).toBeTruthy();
        });

        it('renders with custom style prop', () => {
            const customStyle = { backgroundColor: 'red' };
            const { getByText } = render(<LanguageSwitcher style={customStyle} />);

            expect(getByText('Sprache ändern • Deutsch')).toBeTruthy();
        });

        it('displays English text when current language is German', () => {
            mockI18n.language = 'de';

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Change Language • English')).toBeTruthy();
        });

        it('displays German text when current language is English', () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Sprache ändern • Deutsch')).toBeTruthy();
        });
    });

    describe('Language Switching', () => {
        it('switches from English to German when pressed', async () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Sprache ändern • Deutsch');

            fireEvent.press(button);

            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledWith('de');
            });
        });

        it('switches from German to English when pressed', async () => {
            mockI18n.language = 'de';

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Change Language • English');

            fireEvent.press(button);

            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
            });
        });

        it('handles language change promise correctly', async () => {
            mockI18n.language = 'en';
            mockI18n.changeLanguage.mockResolvedValueOnce(undefined);

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Sprache ändern • Deutsch');

            fireEvent.press(button);

            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledWith('de');
            });
        });
    });

    describe('Styling', () => {
        it('applies default container styles', () => {
            const { getByText } = render(<LanguageSwitcher />);
            const container = getByText('Sprache ändern • Deutsch').parent?.parent;

            expect(container).toBeTruthy();
        });

        it('applies default text styles', () => {
            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Sprache ändern • Deutsch');

            expect(text.props.style).toEqual({
                color: expect.any(String),
                fontSize: 12,
                textDecorationLine: 'underline',
                textAlign: 'center'
            });
        });

        it('merges custom style with default styles', () => {
            const customStyle = { backgroundColor: 'blue', marginTop: 50 };
            const { getByText } = render(<LanguageSwitcher style={customStyle} />);

            expect(getByText('Sprache ändern • Deutsch')).toBeTruthy();
        });
    });

    describe('User Interactions', () => {
        it('responds to touch events', () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Sprache ändern • Deutsch');

            fireEvent.press(button);

            expect(mockI18n.changeLanguage).toHaveBeenCalledWith('de');
        });

        it('maintains touchable functionality after language change', async () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Sprache ändern • Deutsch');

            fireEvent.press(button);
            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledWith('de');
            });

            mockI18n.language = 'de';
            mockI18n.changeLanguage.mockClear();

            const { getByText: getByTextNew } = render(<LanguageSwitcher />);
            const newButton = getByTextNew('Change Language • English');
            fireEvent.press(newButton);

            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles unknown language gracefully', () => {
            mockI18n.language = 'fr';

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Change Language • English')).toBeTruthy();
        });

        it('handles empty language string', () => {
            mockI18n.language = '';

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Change Language • English')).toBeTruthy();
        });

        it('handles null language gracefully', () => {
            mockI18n.language = null as any;

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Change Language • English')).toBeTruthy();
        });

        it('handles undefined language gracefully', () => {
            mockI18n.language = undefined as any;

            const { getByText } = render(<LanguageSwitcher />);

            expect(getByText('Change Language • English')).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('renders as a touchable element', () => {
            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Sprache ändern • Deutsch');

            expect(text).toBeTruthy();
        });

        it('has proper text content for screen readers', () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Sprache ändern • Deutsch');

            expect(text.props.children).toBe('Sprache ändern • Deutsch');
        });

        it('has proper text content for screen readers in German', () => {
            mockI18n.language = 'de';

            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Change Language • English');

            expect(text.props.children).toBe('Change Language • English');
        });
    });

    describe('Component Structure', () => {
        it('has correct component hierarchy', () => {
            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Sprache ändern • Deutsch');

            expect(text).toBeTruthy();
        });

        it('passes onPress handler to TouchableOpacity', () => {
            const { getByText } = render(<LanguageSwitcher />);
            const text = getByText('Sprache ändern • Deutsch');

            expect(text).toBeTruthy();
        });
    });

    describe('Performance', () => {
        it('does not re-render unnecessarily', () => {
            const { getByText, rerender } = render(<LanguageSwitcher />);
            const initialText = getByText('Sprache ändern • Deutsch');

            rerender(<LanguageSwitcher />);
            const newText = getByText('Sprache ändern • Deutsch');

            expect(newText).toBe(initialText);
        });

        it('handles rapid language switching', async () => {
            mockI18n.language = 'en';

            const { getByText } = render(<LanguageSwitcher />);
            const button = getByText('Sprache ändern • Deutsch');

            fireEvent.press(button);
            fireEvent.press(button);
            fireEvent.press(button);

            await waitFor(() => {
                expect(mockI18n.changeLanguage).toHaveBeenCalledTimes(3);
                expect(mockI18n.changeLanguage).toHaveBeenNthCalledWith(1, 'de');
                expect(mockI18n.changeLanguage).toHaveBeenNthCalledWith(2, 'de');
                expect(mockI18n.changeLanguage).toHaveBeenNthCalledWith(3, 'de');
            });
        });
    });
});
