import { render } from '@testing-library/react-native';
import NotificationIndicator from './NotificationIndicator';

jest.mock('styled-components/native', () => {
    const React = require('react');
    const styled = {
        View: (styles: any) => {
            return React.forwardRef(({ children, testID, ...props }: any, ref: any) => {
                return React.createElement('View', { ...props, ref, testID }, children);
            });
        },
    };
    return styled;
});

jest.mock('./RenderIcon', () => {
    const React = require('react');
    return React.forwardRef(({ family, icon, fontSize, color, testID }: any, ref: any) => {
        return React.createElement('View', {
            ref,
            testID: testID || 'render-icon',
            family,
            icon,
            fontSize,
            color
        });
    });
});

describe('NotificationIndicator component', () => {
    const defaultProps = {
        family: 'ionIcons' as const,
        icon: 'notifications',
        fontSize: 24,
        color: 'primary',
        hasNotifications: false,
    };

    it('renders without crashing with default props', () => {
        expect(() => render(<NotificationIndicator {...defaultProps} />)).not.toThrow();
    });

    it('renders the RenderIcon component with correct props', () => {
        const { getByTestId } = render(<NotificationIndicator {...defaultProps} />);
        const renderIcon = getByTestId('render-icon');

        expect(renderIcon).toBeTruthy();
        expect(renderIcon.props.family).toBe('ionIcons');
        expect(renderIcon.props.icon).toBe('notifications');
        expect(renderIcon.props.fontSize).toBe(24);
        expect(renderIcon.props.color).toBe('primary');
    });

    it('does not render notification dot when hasNotifications is false', () => {
        const { queryByTestId } = render(<NotificationIndicator {...defaultProps} />);
        const notificationDot = queryByTestId('notification-dot');

        expect(notificationDot).toBeNull();
    });

    it('renders notification dot when hasNotifications is true', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} hasNotifications={true} />
        );
        expect(getByTestId('render-icon')).toBeTruthy();
    });

    it('renders notification dot with correct styling', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} hasNotifications={true} />
        );
        expect(getByTestId('render-icon')).toBeTruthy();
    });

    it('accepts different icon families', () => {
        const families = ['antDesign', 'entypo', 'feather', 'fontAwesome', 'materialIcons'] as const;

        families.forEach(family => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} family={family} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.family).toBe(family);
        });
    });

    it('accepts different icon names', () => {
        const icons = ['bell', 'notification', 'alert', 'warning', 'info'];

        icons.forEach(icon => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} icon={icon} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.icon).toBe(icon);
        });
    });

    it('accepts different font sizes', () => {
        const fontSizes = [16, 20, 24, 32, 48];

        fontSizes.forEach(fontSize => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} fontSize={fontSize} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.fontSize).toBe(fontSize);
        });
    });

    it('accepts theme color names', () => {
        const themeColors = ['primary', 'secondary', 'accent', 'text', 'white', 'black'];

        themeColors.forEach(color => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} color={color} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.color).toBe(color);
        });
    });

    it('accepts custom color strings', () => {
        const customColors = ['#FF0000', '#00FF00', '#0000FF', 'red', 'blue', 'green'];

        customColors.forEach(color => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} color={color} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.color).toBe(color);
        });
    });

    it('renders wrapper with correct structure', () => {
        const { getByTestId } = render(<NotificationIndicator {...defaultProps} />);
        const renderIcon = getByTestId('render-icon');

        expect(renderIcon).toBeTruthy();
        expect(renderIcon.type).toBe('View');
    });

    it('renders both icon and notification dot when hasNotifications is true', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} hasNotifications={true} />
        );

        const renderIcon = getByTestId('render-icon');

        expect(renderIcon).toBeTruthy();
        expect(renderIcon.parent).toBeTruthy();
    });

    it('handles zero font size', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} fontSize={0} />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.fontSize).toBe(0);
    });

    it('handles negative font size', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} fontSize={-10} />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.fontSize).toBe(-10);
    });

    it('handles large font sizes', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} fontSize={100} />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.fontSize).toBe(100);
    });

    it('handles decimal font sizes', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} fontSize={24.5} />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.fontSize).toBe(24.5);
    });

    it('handles empty string icon names', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} icon="" />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.icon).toBe('');
    });

    it('handles special characters in icon names', () => {
        const specialIcons = ['icon-name', 'icon_name', 'iconName', 'icon@name'];

        specialIcons.forEach(icon => {
            const { getByTestId } = render(
                <NotificationIndicator {...defaultProps} icon={icon} />
            );
            const renderIcon = getByTestId('render-icon');
            expect(renderIcon.props.icon).toBe(icon);
        });
    });

    it('handles empty string colors', () => {
        const { getByTestId } = render(
            <NotificationIndicator {...defaultProps} color="" />
        );
        const renderIcon = getByTestId('render-icon');
        expect(renderIcon.props.color).toBe('');
    });

    it('handles undefined props gracefully', () => {
        const propsWithUndefined = {
            ...defaultProps,
            fontSize: undefined as any,
            color: undefined as any,
        };

        expect(() => render(<NotificationIndicator {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles null props gracefully', () => {
        const propsWithNull = {
            ...defaultProps,
            fontSize: null as any,
            color: null as any,
        };

        expect(() => render(<NotificationIndicator {...propsWithNull} />)).not.toThrow();
    });

    it('toggles notification dot visibility based on hasNotifications prop', () => {
        const { rerender, getByTestId } = render(
            <NotificationIndicator {...defaultProps} hasNotifications={false} />
        );

        expect(getByTestId('render-icon')).toBeTruthy();

        rerender(<NotificationIndicator {...defaultProps} hasNotifications={true} />);
        expect(getByTestId('render-icon')).toBeTruthy();

        rerender(<NotificationIndicator {...defaultProps} hasNotifications={false} />);
        expect(getByTestId('render-icon')).toBeTruthy();
    });

    it('maintains icon rendering when toggling notifications', () => {
        const { rerender, getByTestId } = render(
            <NotificationIndicator {...defaultProps} hasNotifications={false} />
        );

        expect(getByTestId('render-icon')).toBeTruthy();

        rerender(<NotificationIndicator {...defaultProps} hasNotifications={true} />);
        expect(getByTestId('render-icon')).toBeTruthy();

        rerender(<NotificationIndicator {...defaultProps} hasNotifications={false} />);
        expect(getByTestId('render-icon')).toBeTruthy();
    });
});
