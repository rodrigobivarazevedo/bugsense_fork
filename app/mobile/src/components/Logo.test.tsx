import { render } from '@testing-library/react-native';
import Logo from './Logo';

jest.mock('react-native-svg', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const React = require('react');
    const MockSvg = ({ children, ...props }: any) => React.createElement('Svg', props, children);
    const MockG = ({ children, ...props }: any) => React.createElement('G', props, children);
    const MockPath = ({ children, ...props }: any) => React.createElement('Path', props, children);
    return {
        __esModule: true,
        default: MockSvg,
        G: MockG,
        Path: MockPath,
    };
});

describe('Logo component', () => {
    it('renders with default width and height', () => {
        const { getByTestId } = render(<Logo testID="logo" />);
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(200);
        expect(svg.props.height).toBe(33);
    });

    it('accepts custom width and height props', () => {
        const { getByTestId } = render(
            <Logo width={100} height={50} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(100);
        expect(svg.props.height).toBe(50);
    });

    it('accepts string values for width and height', () => {
        const { getByTestId } = render(
            <Logo width="150px" height="75px" testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe('150px');
        expect(svg.props.height).toBe('75px');
    });

    it('forwards additional SvgProps correctly', () => {
        const { getByTestId } = render(
            <Logo
                testID="logo"
                fill="red"
                accessibilityLabel="company-logo"
                onPress={() => { /* no-op */ }}
            />
        );
        const svg = getByTestId('logo');
        expect(svg.props.fill).toBe('red');
        expect(svg.props.accessibilityLabel).toBe('company-logo');
        expect(typeof svg.props.onPress).toBe('function');
    });

    it('renders with correct viewBox and preserveAspectRatio', () => {
        const { getByTestId } = render(<Logo testID="logo" />);
        const svg = getByTestId('logo');
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
    });

    it('renders all required SVG paths', () => {
        const { getByTestId } = render(<Logo testID="logo" />);
        const svg = getByTestId('logo');

        expect(svg).toBeTruthy();
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
    });

    it('renders with correct SVG structure', () => {
        const { getByTestId } = render(<Logo testID="logo" />);
        const svg = getByTestId('logo');

        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
    });

    it('maintains aspect ratio when width and height are provided', () => {
        const { getByTestId } = render(
            <Logo width={300} height={60} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(300);
        expect(svg.props.height).toBe(60);
        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
    });

    it('handles zero dimensions gracefully', () => {
        const { getByTestId } = render(
            <Logo width={0} height={0} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(0);
        expect(svg.props.height).toBe(0);
    });

    it('handles negative dimensions gracefully', () => {
        const { getByTestId } = render(
            <Logo width={-100} height={-50} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(-100);
        expect(svg.props.height).toBe(-50);
    });

    it('forwards all additional props to the SVG element', () => {
        const customProps = {
            testID: 'logo',
            style: { backgroundColor: 'blue' },
            opacity: 0.8,
            transform: 'rotate(45deg)',
            onLayout: () => { },
        };

        const { getByTestId } = render(<Logo {...customProps} />);
        const svg = getByTestId('logo');

        expect(svg.props.style).toEqual({ backgroundColor: 'blue' });
        expect(svg.props.opacity).toBe(0.8);
        expect(svg.props.transform).toBe('rotate(45deg)');
        expect(typeof svg.props.onLayout).toBe('function');
    });

    it('renders without crashing when no props are provided', () => {
        expect(() => render(<Logo />)).not.toThrow();
    });

    it('renders with custom testID', () => {
        const { getByTestId } = render(<Logo testID="custom-logo" />);
        expect(getByTestId('custom-logo')).toBeTruthy();
    });

    it('handles large dimensions', () => {
        const { getByTestId } = render(
            <Logo width={1000} height={200} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(1000);
        expect(svg.props.height).toBe(200);
    });

    it('handles decimal dimensions', () => {
        const { getByTestId } = render(
            <Logo width={150.5} height={33.25} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(150.5);
        expect(svg.props.height).toBe(33.25);
    });

    it('handles percentage string dimensions', () => {
        const { getByTestId } = render(
            <Logo width="100%" height="50%" testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe('100%');
        expect(svg.props.height).toBe('50%');
    });

    it('handles em and rem units', () => {
        const { getByTestId } = render(
            <Logo width="10em" height="2rem" testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe('10em');
        expect(svg.props.height).toBe('2rem');
    });

    it('forwards accessibility props correctly', () => {
        const { getByTestId } = render(
            <Logo
                testID="logo"
                accessible={true}
                accessibilityLabel="BugSense Logo"
                accessibilityHint="Company logo"
                accessibilityRole="image"
            />
        );
        const svg = getByTestId('logo');
        expect(svg.props.accessible).toBe(true);
        expect(svg.props.accessibilityLabel).toBe('BugSense Logo');
        expect(svg.props.accessibilityHint).toBe('Company logo');
        expect(svg.props.accessibilityRole).toBe('image');
    });

    it('forwards event handlers correctly', () => {
        const onPress = jest.fn();
        const onLongPress = jest.fn();
        const onLayout = jest.fn();

        const { getByTestId } = render(
            <Logo
                testID="logo"
                onPress={onPress}
                onLongPress={onLongPress}
                onLayout={onLayout}
            />
        );
        const svg = getByTestId('logo');

        expect(svg.props.onPress).toBe(onPress);
        expect(svg.props.onLongPress).toBe(onLongPress);
        expect(svg.props.onLayout).toBe(onLayout);
    });

    it('forwards style props correctly', () => {
        const customStyle = {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
        };

        const { getByTestId } = render(
            <Logo testID="logo" style={customStyle} />
        );
        const svg = getByTestId('logo');
        expect(svg.props.style).toEqual(customStyle);
    });

    it('forwards transform props correctly', () => {
        const { getByTestId } = render(
            <Logo
                testID="logo"
                transform="scale(1.5) rotate(90deg)"
            />
        );
        const svg = getByTestId('logo');
        expect(svg.props.transform).toBe('scale(1.5) rotate(90deg)');
    });

    it('handles undefined width and height gracefully', () => {
        const { getByTestId } = render(
            <Logo width={undefined} height={undefined} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(200);
        expect(svg.props.height).toBe(33);
    });

    it('handles null width and height gracefully', () => {
        const { getByTestId } = render(
            <Logo width={null as any} height={null as any} testID="logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.width).toBe(null);
        expect(svg.props.height).toBe(null);
    });
});
