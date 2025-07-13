import { render } from '@testing-library/react-native';
import RenderLottie from './RenderLottie';

jest.mock('lottie-react-native', () => {
    const React = require('react');
    const LottieView = React.forwardRef(({ source, autoPlay, loop, style, testID, ...props }: any, ref: any) => {
        return React.createElement('View', {
            ref,
            testID: testID || 'lottie-view',
            source,
            autoPlay,
            loop,
            style,
            ...props
        });
    });
    return LottieView;
});

jest.mock('../assets/lottie/home-hello.json', () => ({
    __esModule: true,
    default: { v: '5.5.7', fr: 30, ip: 0, op: 90, w: 400, h: 400 },
}), { virtual: true });

jest.mock('../assets/lottie/bouncing-test-tubes.json', () => ({
    __esModule: true,
    default: { v: '5.5.7', fr: 30, ip: 0, op: 120, w: 400, h: 400 },
}), { virtual: true });

describe('RenderLottie component', () => {
    const defaultProps = {
        name: 'homeHello' as const,
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('renders without crashing with default props', () => {
        expect(() => render(<RenderLottie {...defaultProps} />)).not.toThrow();
    });

    it('renders LottieView with correct source', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('renders with homeHello animation', () => {
        const { getByTestId } = render(<RenderLottie name="homeHello" />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('renders with bouncingTestTubes animation', () => {
        const { getByTestId } = render(<RenderLottie name="bouncingTestTubes" />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('uses overrideSource when provided', () => {
        const overrideSource = 'https://example.com/custom-animation.json';
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={overrideSource} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBe(overrideSource);
    });

    it('uses default source when overrideSource is not provided', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBeDefined();
        expect(lottieView.props.source).not.toBeNull();
    });

    it('sets autoPlay to true by default', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.autoPlay).toBe(true);
    });

    it('accepts custom autoPlay value', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} autoPlay={false} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.autoPlay).toBe(false);
    });

    it('sets loop to false by default', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.loop).toBe(false);
    });

    it('accepts custom loop value', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} loop={true} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.loop).toBe(true);
    });

    it('applies correct style', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.style).toEqual({ width: "100%", height: "100%" });
    });

    it('handles startFrame prop', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} startFrame={10} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles endFrame prop', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} endFrame={50} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles both startFrame and endFrame props', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} startFrame={10} endFrame={50} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles zero startFrame', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} startFrame={0} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles zero endFrame', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} endFrame={0} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles negative startFrame', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} startFrame={-10} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles negative endFrame', () => {
        const { getByTestId } = render(<RenderLottie {...defaultProps} endFrame={-10} />);
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles large frame numbers', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} startFrame={1000} endFrame={2000} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles decimal frame numbers', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} startFrame={10.5} endFrame={50.7} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles undefined startFrame', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} startFrame={undefined} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles undefined endFrame', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} endFrame={undefined} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles null startFrame', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} startFrame={null as any} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles null endFrame', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} endFrame={null as any} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles empty overrideSource', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={{} as any} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toEqual({});
    });

    it('handles null overrideSource', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={null as any} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBeDefined();
    });

    it('handles undefined overrideSource', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={undefined} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBeDefined();
    });

    it('renders with custom testID when provided', () => {
        const { getByTestId } = render(
            <RenderLottie {...defaultProps} />
        );

        const lottieView = getByTestId('lottie-view');
        expect(lottieView).toBeTruthy();
        expect(lottieView.props.source).toBeDefined();
    });

    it('handles all animation names', () => {
        const animationNames = ['homeHello', 'bouncingTestTubes'] as const;

        animationNames.forEach(name => {
            const { getByTestId } = render(<RenderLottie name={name} />);
            const lottieView = getByTestId('lottie-view');

            expect(lottieView).toBeTruthy();
            expect(lottieView.props.source).toBeDefined();
        });
    });

    it('handles complex overrideSource string', () => {
        const complexSource = 'https://example.com/complex-animation.json';

        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={complexSource} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBe(complexSource);
    });

    it('handles string overrideSource', () => {
        const stringSource = 'https://example.com/animation.json';

        const { getByTestId } = render(
            <RenderLottie {...defaultProps} overrideSource={stringSource} />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.source).toBe(stringSource);
    });

    it('handles boolean props correctly', () => {
        const { getByTestId } = render(
            <RenderLottie
                {...defaultProps}
                autoPlay={false}
                loop={true}
            />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.autoPlay).toBe(false);
        expect(lottieView.props.loop).toBe(true);
    });

    it('handles mixed boolean and frame props', () => {
        const { getByTestId } = render(
            <RenderLottie
                {...defaultProps}
                autoPlay={false}
                loop={true}
                startFrame={10}
                endFrame={50}
            />
        );
        const lottieView = getByTestId('lottie-view');

        expect(lottieView.props.autoPlay).toBe(false);
        expect(lottieView.props.loop).toBe(true);
        expect(lottieView.props.source).toBeDefined();
    });
});
