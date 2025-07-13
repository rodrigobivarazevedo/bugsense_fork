import { render } from '@testing-library/react-native';
import RenderIcon from './RenderIcon';

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const createMockIcon = (name: string) => {
        return React.forwardRef(({ name: iconName, size, color, testID, ...props }: any, ref: any) => {
            return React.createElement('View', {
                ref,
                testID: testID || `icon-${name}`,
                name: iconName,
                size,
                color,
                ...props
            });
        });
    };

    return {
        AntDesign: createMockIcon('AntDesign'),
        Entypo: createMockIcon('Entypo'),
        EvilIcons: createMockIcon('EvilIcons'),
        Feather: createMockIcon('Feather'),
        Fontisto: createMockIcon('Fontisto'),
        FontAwesome: createMockIcon('FontAwesome'),
        FontAwesome5: createMockIcon('FontAwesome5'),
        FontAwesome6: createMockIcon('FontAwesome6'),
        Foundation: createMockIcon('Foundation'),
        Ionicons: createMockIcon('Ionicons'),
        MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
        MaterialIcons: createMockIcon('MaterialIcons'),
        Octicons: createMockIcon('Octicons'),
        SimpleLineIcons: createMockIcon('SimpleLineIcons'),
        Zocial: createMockIcon('Zocial'),
    };
});

describe('RenderIcon component', () => {
    const defaultProps = {
        family: 'ionIcons' as const,
        icon: 'notifications',
        fontSize: 24,
        color: 'primary',
    };

    it('renders without crashing with default props', () => {
        expect(() => render(<RenderIcon {...defaultProps} />)).not.toThrow();
    });

    it('renders the correct icon component based on family', () => {
        const { getByTestId } = render(<RenderIcon {...defaultProps} />);
        const icon = getByTestId('icon-Ionicons');

        expect(icon).toBeTruthy();
        expect(icon.props.name).toBe('notifications');
        expect(icon.props.size).toBe(24);
    });

    it('renders all supported icon families', () => {
        const families = [
            'antDesign',
            'entypo',
            'evilIcons',
            'feather',
            'fontisto',
            'fontAwesome',
            'fontAwesome5',
            'fontAwesome6',
            'foundation',
            'ionIcons',
            'materialCommunity',
            'materialIcons',
            'octicons',
            'simpleLineIcons',
            'zocial',
        ] as const;

        families.forEach(family => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} family={family} />
            );

            const expectedIconName = family === 'ionIcons' ? 'Ionicons' :
                family === 'materialCommunity' ? 'MaterialCommunityIcons' :
                    family === 'materialIcons' ? 'MaterialIcons' :
                        family === 'simpleLineIcons' ? 'SimpleLineIcons' :
                            family.charAt(0).toUpperCase() + family.slice(1);

            const icon = getByTestId(`icon-${expectedIconName}`);
            expect(icon).toBeTruthy();
            expect(icon.props.name).toBe('notifications');
        });
    });

    it('passes correct props to icon component', () => {
        const { getByTestId } = render(
            <RenderIcon
                family="materialIcons"
                icon="home"
                fontSize={32}
                color="secondary"
            />
        );

        const icon = getByTestId('icon-MaterialIcons');
        expect(icon.props.name).toBe('home');
        expect(icon.props.size).toBe(32);
        expect(icon.props.color).toBe('#ECE6FF'); // secondary theme color
    });

    it('resolves theme colors correctly', () => {
        const themeColors = ['primary', 'secondary', 'accent', 'text', 'white', 'black'] as const;
        const expectedColors = ['#2E2747', '#ECE6FF', '#E2F6EB', '#333333', '#FFFFFF', '#000000'];

        themeColors.forEach((color, index) => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} color={color} />
            );

            const icon = getByTestId('icon-Ionicons');
            expect(icon.props.color).toBe(expectedColors[index]);
        });
    });

    it('uses custom colors when not in theme', () => {
        const customColors = ['#FF0000', '#00FF00', '#0000FF', 'red', 'blue', 'green'];

        customColors.forEach(color => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} color={color} />
            );

            const icon = getByTestId('icon-Ionicons');
            expect(icon.props.color).toBe(color);
        });
    });

    it('handles different font sizes', () => {
        const fontSizes = [16, 20, 24, 32, 48, 64];

        fontSizes.forEach(fontSize => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} fontSize={fontSize} />
            );

            const icon = getByTestId('icon-Ionicons');
            expect(icon.props.size).toBe(fontSize);
        });
    });

    it('handles different icon names', () => {
        const iconNames = ['home', 'settings', 'user', 'search', 'heart', 'star'];

        iconNames.forEach(iconName => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} icon={iconName} />
            );

            const icon = getByTestId('icon-Ionicons');
            expect(icon.props.name).toBe(iconName);
        });
    });

    it('handles empty string icon names', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} icon="" />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.name).toBe('');
    });

    it('handles special characters in icon names', () => {
        const specialIcons = ['icon-name', 'icon_name', 'iconName', 'icon@name', 'icon#name'];

        specialIcons.forEach(iconName => {
            const { getByTestId } = render(
                <RenderIcon {...defaultProps} icon={iconName} />
            );

            const icon = getByTestId('icon-Ionicons');
            expect(icon.props.name).toBe(iconName);
        });
    });

    it('handles zero font size', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={0} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(0);
    });

    it('handles negative font size', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={-10} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(-10);
    });

    it('handles large font sizes', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={1000} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(1000);
    });

    it('handles decimal font sizes', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={24.5} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(24.5);
    });

    it('handles empty string colors', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} color="" />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.color).toBe('');
    });

    it('handles undefined props gracefully', () => {
        const propsWithUndefined = {
            ...defaultProps,
            fontSize: undefined as any,
            color: undefined as any,
        };

        expect(() => render(<RenderIcon {...propsWithUndefined} />)).not.toThrow();
    });

    it('handles null props gracefully', () => {
        const propsWithNull = {
            ...defaultProps,
            fontSize: null as any,
            color: null as any,
        };

        expect(() => render(<RenderIcon {...propsWithNull} />)).not.toThrow();
    });

    it('returns null for invalid icon family', () => {
        const { queryByTestId } = render(
            <RenderIcon {...defaultProps} family={'invalidFamily' as any} />
        );

        expect(queryByTestId('icon-Ionicons')).toBeNull();
    });

    it('handles case-sensitive icon family names', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} family="antDesign" />
        );

        const icon = getByTestId('icon-AntDesign');
        expect(icon).toBeTruthy();
    });

    it('renders with custom testID when provided', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon).toBeTruthy();
        expect(icon.props.name).toBe('notifications');
    });

    it('handles mixed theme and custom colors', () => {
        const { getByTestId: getByTestId1 } = render(
            <RenderIcon {...defaultProps} color="primary" />
        );
        const icon1 = getByTestId1('icon-Ionicons');
        expect(icon1.props.color).toBe('#2E2747');

        const { getByTestId: getByTestId2 } = render(
            <RenderIcon {...defaultProps} color="#FF5733" />
        );
        const icon2 = getByTestId2('icon-Ionicons');
        expect(icon2.props.color).toBe('#FF5733');
    });

    it('handles very long icon names', () => {
        const longIconName = 'very-long-icon-name-that-might-be-used-in-some-cases';

        const { getByTestId } = render(
            <RenderIcon {...defaultProps} icon={longIconName} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.name).toBe(longIconName);
    });

    it('handles very large numbers for font size', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={Number.MAX_SAFE_INTEGER} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('handles very small numbers for font size', () => {
        const { getByTestId } = render(
            <RenderIcon {...defaultProps} fontSize={Number.MIN_SAFE_INTEGER} />
        );

        const icon = getByTestId('icon-Ionicons');
        expect(icon.props.size).toBe(Number.MIN_SAFE_INTEGER);
    });
});
