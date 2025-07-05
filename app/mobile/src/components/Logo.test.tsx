import { ReactNode, createElement } from 'react';
import { render } from '@testing-library/react-native';
import Logo from './Logo';

jest.mock('react-native-svg', () => {
    const MockSvg = ({ children, ...props }: { children?: ReactNode;[key: string]: any }) => createElement('Svg', props, children);
    const MockG = ({ children, ...props }: { children?: ReactNode;[key: string]: any }) => createElement('G', props, children);
    const MockPath = ({ children, ...props }: { children?: ReactNode;[key: string]: any }) => createElement('Path', props, children);
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

    it('forwards additional SvgProps correctly', () => {
        const { getByTestId } = render(
            <Logo testID="logo" fill="red" accessibilityLabel="app-logo" />
        );
        const svg = getByTestId('logo');
        expect(svg.props.fill).toBe('red');
        expect(svg.props.accessibilityLabel).toBe('app-logo');
    });
});
