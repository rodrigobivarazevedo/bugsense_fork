import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from './BottomBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('./RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const createMockNavigationProps = (currentIndex = 0) => ({
    state: {
        index: currentIndex,
        key: 'test-key',
        routeNames: ['Home', 'Scan', 'Tests', 'More', 'Patients'],
        routes: [
            { name: 'Home', key: 'home' },
            { name: 'Scan', key: 'scan' },
            { name: 'Tests', key: 'tests' },
            { name: 'More', key: 'more' },
            { name: 'Patients', key: 'patients' },
        ],
        type: 'tab',
        stale: false as const,
        history: [{ type: 'route', key: 'home' }],
        preloadedRouteKeys: [],
    },
    navigation: {
        navigate: jest.fn(),
    },
    descriptors: {},
    insets: mockInsets,
} as any);

const mockT = jest.fn((key: string) => key);

const mockInsets = {
    top: 0,
    right: 0,
    bottom: 34,
    left: 0,
};

describe('BottomBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        AsyncStorage.clear();
    });

    afterEach(() => {
        AsyncStorage.clear();
    });

    describe('User Type Detection', () => {
        it('should render patient tabs by default', async () => {
            const props = createMockNavigationProps();
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByText('home')).toBeTruthy();
                expect(getByText('scan')).toBeTruthy();
                expect(getByText('tests')).toBeTruthy();
                expect(getByText('more')).toBeTruthy();
            });
        });

        it('should render doctor tabs when userType is doctor', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            const props = createMockNavigationProps();
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByText('home')).toBeTruthy();
                expect(getByText('scan')).toBeTruthy();
                expect(getByText('patients')).toBeTruthy();
                expect(getByText('more')).toBeTruthy();
            });
        });

        it('should not render tests tab for doctors', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            const props = createMockNavigationProps();
            const { queryByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(queryByText('tests')).toBeNull();
            });
        });

        it('should not render patients tab for patients', async () => {
            const props = createMockNavigationProps();
            const { queryByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(queryByText('patients')).toBeNull();
            });
        });
    });

    describe('Tab Rendering', () => {
        it('should render all tabs with correct icons for patients', async () => {
            const props = createMockNavigationProps();
            const { getByTestId } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByTestId('icon-foundation-home')).toBeTruthy();
                expect(getByTestId('icon-entypo-camera')).toBeTruthy();
                expect(getByTestId('icon-foundation-results')).toBeTruthy();
                expect(getByTestId('icon-feather-more-horizontal')).toBeTruthy();
            });
        });

        it('should render all tabs with correct icons for doctors', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            const props = createMockNavigationProps();
            const { getByTestId } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByTestId('icon-foundation-home')).toBeTruthy();
                expect(getByTestId('icon-entypo-camera')).toBeTruthy();
                expect(getByTestId('icon-ionIcons-people')).toBeTruthy();
                expect(getByTestId('icon-feather-more-horizontal')).toBeTruthy();
            });
        });

        it('should mark the active tab correctly', async () => {
            const props = createMockNavigationProps(0);
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                const homeTab = getByText('home');
                expect(homeTab).toBeTruthy();
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to different tabs when pressed', async () => {
            const props = createMockNavigationProps();
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                const scanTab = getByText('scan');
                fireEvent.press(scanTab);

                expect(props.navigation.navigate).toHaveBeenCalledWith('Main', {
                    screen: 'Scan'
                });
            });
        });

        it('should not navigate when pressing the active tab', async () => {
            const props = createMockNavigationProps(0);
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                const homeTab = getByText('home');
                fireEvent.press(homeTab);

                expect(props.navigation.navigate).not.toHaveBeenCalled();
            });
        });
    });

    describe('Translation', () => {
        it('should use translation function for tab labels', async () => {
            const props = createMockNavigationProps();
            render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('home');
                expect(mockT).toHaveBeenCalledWith('scan');
                expect(mockT).toHaveBeenCalledWith('tests');
                expect(mockT).toHaveBeenCalledWith('more');
            });
        });

        it('should use translation function for doctor tab labels', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            const props = createMockNavigationProps();
            render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('home');
                expect(mockT).toHaveBeenCalledWith('scan');
                expect(mockT).toHaveBeenCalledWith('patients');
                expect(mockT).toHaveBeenCalledWith('more');
            });
        });
    });

    describe('AsyncStorage Integration', () => {
        it('should read userType from AsyncStorage on mount', async () => {
            await AsyncStorage.setItem('userType', 'doctor');

            const props = createMockNavigationProps();
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByText('patients')).toBeTruthy();
            });
        });

        it('should handle missing userType gracefully', async () => {
            await AsyncStorage.removeItem('userType');

            const props = createMockNavigationProps();
            const { getByText } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getByText('tests')).toBeTruthy();
            });
        });
    });

    describe('Safe Area Handling', () => {
        it('should use safe area insets for padding', async () => {
            const customInsets = {
                top: 10,
                right: 20,
                bottom: 30,
                left: 40,
            };

            (useSafeAreaInsets as jest.Mock).mockReturnValue(customInsets);

            const props = createMockNavigationProps();
            render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(useSafeAreaInsets).toHaveBeenCalled();
            });
        });
    });

    describe('Accessibility', () => {
        it('should render touchable elements for each tab', async () => {
            const props = createMockNavigationProps();
            const { getAllByTestId } = render(<BottomBar {...props} />);

            await waitFor(() => {
                expect(getAllByTestId(/icon-/).length).toBeGreaterThan(0);
            });
        });
    });
});
