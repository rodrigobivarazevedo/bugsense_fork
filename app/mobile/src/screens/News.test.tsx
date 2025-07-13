import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import News from './News';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

describe('News', () => {
    const mockT = jest.fn((key) => key);
    const mockInsets = { top: 0, right: 0, bottom: 20, left: 0 };
    const originalPlatform = Platform.OS;

    beforeEach(() => {
        jest.clearAllMocks();
        (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    });

    afterAll(() => {
        Platform.OS = originalPlatform;
    });

    it('renders the placeholder message', () => {
        const { getByText } = render(<News />);
        expect(getByText('updates_from_bugsense_coming_soon')).toBeTruthy();
    });

    it('calls the translation function with the correct key', () => {
        render(<News />);
        expect(mockT).toHaveBeenCalledWith('updates_from_bugsense_coming_soon');
    });

    it('applies correct padding for iOS', () => {
        Platform.OS = 'ios';
        const { UNSAFE_getByType } = render(<News />);
        const scrollView = UNSAFE_getByType(require('./News.styles').Root);
        expect(scrollView.props.contentContainerStyle).toMatchObject({ paddingBottom: mockInsets.bottom + 30 });
    });

    it('applies correct padding for Android', () => {
        Platform.OS = 'android';
        const { UNSAFE_getByType } = render(<News />);
        const scrollView = UNSAFE_getByType(require('./News.styles').Root);
        expect(scrollView.props.contentContainerStyle).toMatchObject({ paddingBottom: 60 });
    });

    it('renders styled components', () => {
        const { UNSAFE_getByType } = render(<News />);
        expect(UNSAFE_getByType(require('./News.styles').Root)).toBeTruthy();
        expect(UNSAFE_getByType(require('./News.styles').Content)).toBeTruthy();
        expect(UNSAFE_getByType(require('./News.styles').PlaceholderContainer)).toBeTruthy();
        expect(UNSAFE_getByType(require('./News.styles').PlaceholderText)).toBeTruthy();
    });
});
