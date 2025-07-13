import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from './Home';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'overviews': 'Overviews',
                'discover': 'Discover',
                'news': 'News',
                'contact_us': 'Contact Us',
                'Good morning': 'Good morning',
                'Good afternoon': 'Good afternoon',
                'Good evening': 'Good evening',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../components/RenderLottie', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'render-lottie', ...props });
    });
});

jest.mock('../components/RenderIcon', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'render-icon', ...props });
    });
});

jest.mock('../utils/DateTimeFormatter', () => ({
    getTimeBasedGreeting: jest.fn(() => 'Good morning'),
}));

jest.mock('../api/Client', () => ({
    get: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const mockApi = require('../api/Client');
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const mockAsyncStorage = require('@react-native-async-storage/async-storage');
const mockNavigation = { navigate: jest.fn() };

describe('Home component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders greeting, user name, and all grid items for patient', async () => {
        mockApi.get.mockResolvedValueOnce({ data: { full_name: 'John Doe' } });
        mockAsyncStorage.getItem.mockResolvedValueOnce('patient');

        const { getByText, getByTestId, queryByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Good morning')).toBeTruthy();
            expect(getByText('John Doe')).toBeTruthy();
        });

        expect(getByText('Overviews')).toBeTruthy();
        expect(getByText('Discover')).toBeTruthy();
        expect(getByText('News')).toBeTruthy();
        expect(getByText('Contact Us')).toBeTruthy();
        expect(getByTestId('render-lottie')).toBeTruthy();
    });

    it('renders correct grid items for doctor', async () => {
        mockApi.get.mockResolvedValueOnce({ data: { full_name: 'Dr. Smith' } });
        mockAsyncStorage.getItem.mockResolvedValueOnce('doctor');

        const { getByText, queryByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Dr. Smith')).toBeTruthy();
        });

        expect(getByText('Overviews')).toBeTruthy();
        expect(getByText('Discover')).toBeTruthy();
        expect(queryByText('News')).toBeFalsy();
        expect(queryByText('Contact Us')).toBeFalsy();
    });

    it('navigates to correct route when grid item is pressed', async () => {
        mockApi.get.mockResolvedValueOnce({ data: { full_name: 'John Doe' } });
        mockAsyncStorage.getItem.mockResolvedValueOnce('patient');

        const { getByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('John Doe')).toBeTruthy();
        });

        fireEvent.press(getByText('Overviews'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Overview');

        fireEvent.press(getByText('Discover'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Discover');

        fireEvent.press(getByText('News'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('News');
    });

    it('does not navigate when grid item has no route', async () => {
        mockApi.get.mockResolvedValueOnce({ data: { full_name: 'John Doe' } });
        mockAsyncStorage.getItem.mockResolvedValueOnce('patient');

        const { getByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('John Doe')).toBeTruthy();
        });

        fireEvent.press(getByText('Contact Us'));
        expect(mockNavigation.navigate).not.toHaveBeenCalledWith('ContactUs');
    });

    it('handles API error gracefully', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockApi.get.mockRejectedValueOnce(new Error('API error'));
        mockAsyncStorage.getItem.mockResolvedValueOnce('patient');

        const { getByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Good morning')).toBeTruthy();
        });

        expect(errorSpy).toHaveBeenCalledWith('Could not load profile', expect.any(Error));
        errorSpy.mockRestore();
    });

    it('defaults to patient if userType is not set', async () => {
        mockApi.get.mockResolvedValueOnce({ data: { full_name: 'Jane Doe' } });
        mockAsyncStorage.getItem.mockResolvedValueOnce(null);

        const { getByText } = render(<Home navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Jane Doe')).toBeTruthy();
        });

        expect(getByText('News')).toBeTruthy();
        expect(getByText('Contact Us')).toBeTruthy();
    });
});
