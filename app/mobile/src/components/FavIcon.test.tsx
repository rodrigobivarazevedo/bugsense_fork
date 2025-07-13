import { render } from '@testing-library/react-native';
import FavIcon from './FavIcon';

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

describe('FavIcon component', () => {
    it('renders with default width and height', () => {
        const { getByTestId } = render(<FavIcon testID="fav-icon" />);
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe(200);
        expect(svg.props.height).toBe(33);
    });

    it('accepts custom width and height props', () => {
        const { getByTestId } = render(
            <FavIcon width={100} height={50} testID="fav-icon" />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe(100);
        expect(svg.props.height).toBe(50);
    });

    it('accepts string values for width and height', () => {
        const { getByTestId } = render(
            <FavIcon width="150px" height="75px" testID="fav-icon" />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe('150px');
        expect(svg.props.height).toBe('75px');
    });

    it('forwards additional SvgProps correctly', () => {
        const { getByTestId } = render(
            <FavIcon
                testID="fav-icon"
                fill="red"
                accessibilityLabel="favorite-icon"
                onPress={() => { }}
            />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.fill).toBe('red');
        expect(svg.props.accessibilityLabel).toBe('favorite-icon');
        expect(typeof svg.props.onPress).toBe('function');
    });

    it('renders with correct viewBox and preserveAspectRatio', () => {
        const { getByTestId } = render(<FavIcon testID="fav-icon" />);
        const svg = getByTestId('fav-icon');
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
    });

    it('renders all required SVG paths', () => {
        const { getByTestId } = render(<FavIcon testID="fav-icon" />);
        const svg = getByTestId('fav-icon');

        // Check that the SVG renders without crashing
        expect(svg).toBeTruthy();
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
    });

    it('renders with correct SVG structure', () => {
        const { getByTestId } = render(<FavIcon testID="fav-icon" />);
        const svg = getByTestId('fav-icon');

        // Check that the SVG has the correct props
        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
        expect(svg.props.viewBox).toBe('0 0 524.844 87.101');
    });

    it('maintains aspect ratio when width and height are provided', () => {
        const { getByTestId } = render(
            <FavIcon width={300} height={60} testID="fav-icon" />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe(300);
        expect(svg.props.height).toBe(60);
        expect(svg.props.preserveAspectRatio).toBe('xMidYMid meet');
    });

    it('handles zero dimensions gracefully', () => {
        const { getByTestId } = render(
            <FavIcon width={0} height={0} testID="fav-icon" />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe(0);
        expect(svg.props.height).toBe(0);
    });

    it('handles negative dimensions gracefully', () => {
        const { getByTestId } = render(
            <FavIcon width={-100} height={-50} testID="fav-icon" />
        );
        const svg = getByTestId('fav-icon');
        expect(svg.props.width).toBe(-100);
        expect(svg.props.height).toBe(-50);
    });

    it('forwards all additional props to the SVG element', () => {
        const customProps = {
            testID: 'fav-icon',
            style: { backgroundColor: 'blue' },
            opacity: 0.8,
            transform: 'rotate(45deg)',
            onLayout: () => { },
        };

        const { getByTestId } = render(<FavIcon {...customProps} />);
        const svg = getByTestId('fav-icon');

        expect(svg.props.style).toEqual({ backgroundColor: 'blue' });
        expect(svg.props.opacity).toBe(0.8);
        expect(svg.props.transform).toBe('rotate(45deg)');
        expect(typeof svg.props.onLayout).toBe('function');
    });

    it('renders without crashing when no props are provided', () => {
        expect(() => render(<FavIcon />)).not.toThrow();
    });

    it('renders with custom testID', () => {
        const { getByTestId } = render(<FavIcon testID="custom-fav-icon" />);
        expect(getByTestId('custom-fav-icon')).toBeTruthy();
    });
});
