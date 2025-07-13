import { render, fireEvent } from '@testing-library/react-native';
import HeaderBar from './HeaderBar';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationContext } from '../context/NotificationContext';

jest.mock('./Logo', () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.forwardRef((props: any, ref: any) => (
        <View ref={ref} testID="logo" style={{ width: props.width, height: props.height }} />
    ));
});

jest.mock('./RenderIcon', () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.forwardRef((props: any, ref: any) => (
        <View ref={ref} testID={`icon-${props.family}-${props.icon}`} data-fontSize={props.fontSize} data-color={props.color} />
    ));
});

jest.mock('./NotificationIndicator', () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.forwardRef((props: any, ref: any) => (
        <View ref={ref} testID={`notification-${props.family}-${props.icon}`} data-fontSize={props.fontSize} data-color={props.color}>
            {props.hasNotifications && <View testID="notification-badge" />}
        </View>
    ));
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn()
}));

jest.mock('../context/NotificationContext', () => ({
    useNotificationContext: jest.fn()
}));

jest.mock('../utils/Responsive', () => ({
    rem: jest.fn((value: number) => value * 16)
}));

describe('HeaderBar', () => {
    const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn()
    };

    const mockT = jest.fn((key: string) => key);
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
    const mockUseSafeAreaInsets = useSafeAreaInsets as jest.MockedFunction<typeof useSafeAreaInsets>;
    const mockUseNotificationContext = useNotificationContext as jest.MockedFunction<typeof useNotificationContext>;

    const defaultInsets = {
        top: 44,
        bottom: 34,
        left: 0,
        right: 0
    };

    const defaultNotificationContext = {
        hasNotifications: false,
        loading: false,
        refetch: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        mockUseTranslation.mockReturnValue({
            t: mockT as any,
            i18n: {} as any,
            ready: true
        } as any);
        mockUseSafeAreaInsets.mockReturnValue(defaultInsets);
        mockUseNotificationContext.mockReturnValue(defaultNotificationContext);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Main Tab Rendering', () => {
        const mainTabProps = {
            navigation: mockNavigation,
            route: { name: 'Home' },
            options: {},
            headerTitle: ''
        };

        it('renders logo and action buttons for main tabs', () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);

            expect(getByTestId('logo')).toBeTruthy();
            expect(getByTestId('notification-materialIcons-notifications')).toBeTruthy();
            expect(getByTestId('icon-materialIcons-account-circle')).toBeTruthy();
        });

        it('renders logo with correct dimensions', () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            const logo = getByTestId('logo');

            expect(logo.props.style).toEqual({ width: 120, height: 20 });
        });

        it('renders notification indicator with correct props', () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            const notificationIcon = getByTestId('notification-materialIcons-notifications');

            expect(notificationIcon.props['data-fontSize']).toBe(28); // rem(1.75) = 1.75 * 16
            expect(notificationIcon.props['data-color']).toBe('primary');
        });

        it('renders account icon with correct props', () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            const accountIcon = getByTestId('icon-materialIcons-account-circle');

            expect(accountIcon.props['data-fontSize']).toBe(32); // rem(2) = 2 * 16
            expect(accountIcon.props['data-color']).toBe('primary');
        });

        it('shows notification badge when hasNotifications is true', () => {
            mockUseNotificationContext.mockReturnValue({
                ...defaultNotificationContext,
                hasNotifications: true,
                loading: false
            });

            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            expect(getByTestId('notification-badge')).toBeTruthy();
        });

        it('does not show notification badge when hasNotifications is false', () => {
            const { queryByTestId } = render(<HeaderBar {...mainTabProps} />);
            expect(queryByTestId('notification-badge')).toBeNull();
        });

        it('handles notification button press correctly', async () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            const notificationButton = getByTestId('notification-materialIcons-notifications').parent;

            fireEvent.press(notificationButton);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Notifications');

            jest.advanceTimersByTime(100);
            expect(defaultNotificationContext.refetch).toHaveBeenCalled();
        });

        it('handles account button press correctly', () => {
            const { getByTestId } = render(<HeaderBar {...mainTabProps} />);
            const accountButton = getByTestId('icon-materialIcons-account-circle').parent;

            fireEvent.press(accountButton);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Account');
        });
    });

    describe('Non-Main Tab Rendering', () => {
        const nonMainTabProps = {
            navigation: mockNavigation,
            route: { name: 'SomeOtherScreen' },
            options: {},
            headerTitle: 'Custom Title'
        };

        it('renders back button and title for non-main tabs', () => {
            const { getByTestId, getByText } = render(<HeaderBar {...nonMainTabProps} />);

            expect(getByTestId('icon-ionIcons-chevron-back')).toBeTruthy();
            expect(getByText('Custom Title')).toBeTruthy();
        });

        it('renders back button with correct props', () => {
            const { getByTestId } = render(<HeaderBar {...nonMainTabProps} />);
            const backIcon = getByTestId('icon-ionIcons-chevron-back');

            expect(backIcon.props['data-fontSize']).toBe(20); // rem(1.25) = 1.25 * 16
            expect(backIcon.props['data-color']).toBe('primary');
        });

        it('renders title with correct styling', () => {
            const { getByText } = render(<HeaderBar {...nonMainTabProps} />);
            const title = getByText('Custom Title');

            expect(title.props.style).toEqual({
                fontSize: 20, // rem(1.25) = 1.25 * 16
                color: '#000',
                fontWeight: '500'
            });
        });

        it('handles back button press correctly', () => {
            const { getByTestId } = render(<HeaderBar {...nonMainTabProps} />);
            const backButton = getByTestId('icon-ionIcons-chevron-back').parent;

            fireEvent.press(backButton);

            expect(mockNavigation.goBack).toHaveBeenCalled();
        });

        it('uses headerTitle from props when available', () => {
            const { getByText } = render(<HeaderBar {...nonMainTabProps} />);
            expect(getByText('Custom Title')).toBeTruthy();
        });

        it('falls back to options.headerTitle when headerTitle prop is not provided', () => {
            const propsWithOptions = {
                ...nonMainTabProps,
                headerTitle: '',
                options: { headerTitle: 'Options Title' }
            };

            const { getByText } = render(<HeaderBar {...propsWithOptions} />);
            expect(getByText('Options Title')).toBeTruthy();
        });

        it('falls back to route.name when neither headerTitle nor options.headerTitle is provided', () => {
            const propsWithRouteName = {
                ...nonMainTabProps,
                headerTitle: '',
                options: {}
            };

            const { getByText } = render(<HeaderBar {...propsWithRouteName} />);
            expect(getByText('SomeOtherScreen')).toBeTruthy();
        });

        it('translates headerTitle using t function', () => {
            render(<HeaderBar {...nonMainTabProps} />);
            expect(mockT).toHaveBeenCalledWith('Custom Title');
        });
    });

    describe('Safe Area Handling', () => {
        it('applies safe area insets correctly', () => {
            const customInsets = {
                top: 50,
                bottom: 40,
                left: 10,
                right: 10
            };

            mockUseSafeAreaInsets.mockReturnValue(customInsets);

            const { getByTestId } = render(<HeaderBar
                navigation={mockNavigation}
                route={{ name: 'Home' }}
                options={{}}
                headerTitle=""
            />);

            expect(getByTestId('logo')).toBeTruthy();
        });
    });

    describe('Main Tab Detection', () => {
        const mainTabs = ['Home', 'Scan', 'Tests', 'Patients', 'More'];

        mainTabs.forEach(tabName => {
            it(`recognizes "${tabName}" as a main tab`, () => {
                const { getByTestId } = render(<HeaderBar
                    navigation={mockNavigation}
                    route={{ name: tabName }}
                    options={{}}
                    headerTitle=""
                />);

                expect(getByTestId('logo')).toBeTruthy();
                expect(getByTestId('notification-materialIcons-notifications')).toBeTruthy();
            });
        });

        it('treats non-main tab names as secondary screens', () => {
            const { queryByTestId, getByTestId } = render(<HeaderBar
                navigation={mockNavigation}
                route={{ name: 'SomeRandomScreen' }}
                options={{}}
                headerTitle="Test Title"
            />);

            expect(queryByTestId('logo')).toBeNull();
            expect(getByTestId('icon-ionIcons-chevron-back')).toBeTruthy();
        });
    });

    describe('Error Handling', () => {
        it('handles missing navigation prop gracefully', () => {
            expect(() => {
                render(<HeaderBar
                    route={{ name: 'Home' }}
                    options={{}}
                    headerTitle=""
                /> as any);
            }).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('renders touchable elements for main tabs', () => {
            const { getByTestId } = render(<HeaderBar
                navigation={mockNavigation}
                route={{ name: 'Home' }}
                options={{}}
                headerTitle=""
            />);

            expect(getByTestId('notification-materialIcons-notifications')).toBeTruthy();
            expect(getByTestId('icon-materialIcons-account-circle')).toBeTruthy();
        });

        it('renders touchable elements for non-main tabs', () => {
            const { getByTestId } = render(<HeaderBar
                navigation={mockNavigation}
                route={{ name: 'SomeScreen' }}
                options={{}}
                headerTitle="Test"
            />);

            expect(getByTestId('icon-ionIcons-chevron-back')).toBeTruthy();
        });
    });
});
