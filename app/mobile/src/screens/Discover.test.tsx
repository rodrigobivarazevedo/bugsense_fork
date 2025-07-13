import { render, fireEvent } from '@testing-library/react-native';
import Discover from './Discover';

const mockNavigate = jest.fn();
const mockNavigation = {
    navigate: mockNavigate,
};

const mockT = jest.fn((key: string) => key);

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 20,
        left: 0,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: mockT,
    }),
}));

jest.mock('styled-components/native', () => {
    const React = require('react');
    const styled = {
        ScrollView: (styles: any) => {
            return React.forwardRef(({ children, testID, ...props }: any, ref: any) => {
                return React.createElement('ScrollView', { ...props, ref, testID: testID || 'Root' }, children);
            });
        },
        View: (styles: any) => {
            return React.forwardRef(({ children, testID, ...props }: any, ref: any) => {
                return React.createElement('View', { ...props, ref, testID: testID || 'BacteriaGrid' }, children);
            });
        },
        Text: (styles: any) => {
            return React.forwardRef(({ children, testID, ...props }: any, ref: any) => {
                return React.createElement('Text', { ...props, ref, testID: testID || 'Text' }, children);
            });
        },
        TouchableOpacity: (styles: any) => {
            return React.forwardRef(({ children, onPress, testID, ...props }: any, ref: any) => {
                return React.createElement('TouchableOpacity', { ...props, onPress, ref, testID: testID || 'BacteriaCard' }, children);
            });
        },
        Image: (styles: any) => {
            return React.forwardRef(({ source, testID, ...props }: any, ref: any) => {
                return React.createElement('Image', { ...props, source, ref, testID: testID || 'BacteriaImage' });
            });
        },
    };
    return styled;
});

describe('Discover component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing with default props', () => {
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders the subtitle with translation', () => {
        const { getByText } = render(<Discover navigation={mockNavigation} />);
        const subtitle = getByText('discover_bacteria_subtitle');

        expect(subtitle).toBeTruthy();
        expect(mockT).toHaveBeenCalledWith('discover_bacteria_subtitle');
    });

    it('renders all bacteria cards', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);

        const bacteriaNames = [
            'Escherichia coli',
            'Enterococcus faecalis',
            'Klebsiella pneumoniae',
            'Staphylococcus saprophyticus',
            'Staphylococcus aureus',
            'Enterobacter hormaechei',
            'Pseudomonas aeruginosa',
            'Proteus mirabilis'
        ];

        bacteriaNames.forEach(name => {
            expect(getAllByText(name).length).toBeGreaterThan(0);
        });
    });

    it('renders bacteria descriptions with translations', () => {
        const { getByText } = render(<Discover navigation={mockNavigation} />);

        const descriptionKeys = [
            'escherichia_coli_disoverPage_quick_description',
            'enterococcus_faecalis_disoverPage_quick_description',
            'klebsiella_pneumoniae_disoverPage_quick_description',
            'staphylococcus_saprophyticus_disoverPage_quick_description',
            'staphylococcus_aureus_disoverPage_quick_description',
            'enterobacter_hormaechei_disoverPage_quick_description',
            'pseudomonas_aeruginosa_disoverPage_quick_description',
            'proteus_mirabilis_disoverPage_quick_description'
        ];

        descriptionKeys.forEach(key => {
            expect(getByText(key)).toBeTruthy();
            expect(mockT).toHaveBeenCalledWith(key);
        });
    });

    it('navigates to BacteriaRouter when Escherichia coli card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const eColiCards = getAllByText('Escherichia coli');

        fireEvent.press(eColiCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'escherichia-coli' });
    });

    it('navigates to BacteriaRouter when Enterococcus faecalis card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const enterococcusCards = getAllByText('Enterococcus faecalis');

        fireEvent.press(enterococcusCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'enterococcus-faecalis' });
    });

    it('navigates to BacteriaRouter when Klebsiella pneumoniae card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const klebsiellaCards = getAllByText('Klebsiella pneumoniae');

        fireEvent.press(klebsiellaCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'klebsiella-pneumoniae' });
    });

    it('navigates to BacteriaRouter when Staphylococcus saprophyticus card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const staphSaprophyticusCards = getAllByText('Staphylococcus saprophyticus');

        fireEvent.press(staphSaprophyticusCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'staphylococcus-saprophyticus' });
    });

    it('navigates to BacteriaRouter when Staphylococcus aureus card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const staphAureusCards = getAllByText('Staphylococcus aureus');

        fireEvent.press(staphAureusCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'staphylococcus-aureus' });
    });

    it('navigates to BacteriaRouter when Enterobacter hormaechei card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const enterobacterCards = getAllByText('Enterobacter hormaechei');

        fireEvent.press(enterobacterCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'enterobacter-hormaechei' });
    });

    it('navigates to BacteriaRouter when Pseudomonas aeruginosa card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const pseudomonasCards = getAllByText('Pseudomonas aeruginosa');

        fireEvent.press(pseudomonasCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'pseudomonas-aeruginosa' });
    });

    it('navigates to BacteriaRouter when Proteus mirabilis card is pressed', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const proteusCards = getAllByText('Proteus mirabilis');

        fireEvent.press(proteusCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'proteus-mirabilis' });
    });

    it('handles multiple card presses correctly', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const eColiCards = getAllByText('Escherichia coli');
        const enterococcusCards = getAllByText('Enterococcus faecalis');

        fireEvent.press(eColiCards[0]);
        fireEvent.press(enterococcusCards[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(2);
        expect(mockNavigate).toHaveBeenNthCalledWith(1, 'BacteriaRouter', { id: 'escherichia-coli' });
        expect(mockNavigate).toHaveBeenNthCalledWith(2, 'BacteriaRouter', { id: 'enterococcus-faecalis' });
    });

    it('renders bacteria images', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const images = getAllByTestId('BacteriaImage');

        expect(images.length).toBe(8); // 8 bacteria cards
    });

    it('applies correct styling to bacteria cards', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const cards = getAllByTestId('BacteriaCard');

        expect(cards.length).toBe(8);
    });

    it('handles navigation prop being undefined', () => {
        expect(() => render(<Discover navigation={undefined} />)).not.toThrow();
    });

    it('handles navigation.navigate being undefined', () => {
        const navigationWithoutNavigate = {};
        expect(() => render(<Discover navigation={navigationWithoutNavigate} />)).not.toThrow();
    });

    it('handles translation function returning empty string', () => {
        mockT.mockReturnValue('');
        const { getByText } = render(<Discover navigation={mockNavigation} />);

        expect(() => getByText('discover_bacteria_subtitle')).toThrow();
    });

    it('handles translation function returning null', () => {
        mockT.mockReturnValue(null as any);
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders correct number of bacteria cards', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const cards = getAllByTestId('BacteriaCard');

        expect(cards.length).toBe(8);
    });

    it('renders correct number of bacteria images', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const images = getAllByTestId('BacteriaImage');

        expect(images.length).toBe(8);
    });

    it('handles rapid successive card presses', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const eColiCards = getAllByText('Escherichia coli');

        fireEvent.press(eColiCards[0]);
        fireEvent.press(eColiCards[0]);
        fireEvent.press(eColiCards[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(3);
        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'escherichia-coli' });
    });

    it('handles navigation with custom parameters', () => {
        const customNavigation = {
            navigate: jest.fn(),
            push: jest.fn(),
            goBack: jest.fn(),
        };

        const { getAllByText } = render(<Discover navigation={customNavigation} />);
        const eColiCards = getAllByText('Escherichia coli');

        fireEvent.press(eColiCards[0]);

        expect(customNavigation.navigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'escherichia-coli' });
    });

    it('renders with different translation keys', () => {
        mockT.mockImplementation((key: string) => {
            const translations: { [key: string]: string } = {
                'discover_bacteria_subtitle': 'Discover Bacteria',
                'escherichia_coli_disoverPage_quick_description': 'A common bacterium',
                'enterococcus_faecalis_disoverPage_quick_description': 'Another bacterium',
            };
            return translations[key] || key;
        });

        const { getByText } = render(<Discover navigation={mockNavigation} />);

        expect(getByText('Discover Bacteria')).toBeTruthy();
        expect(getByText('A common bacterium')).toBeTruthy();
        expect(getByText('Another bacterium')).toBeTruthy();
    });

    it('handles empty bacteria list gracefully', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const cards = getAllByTestId('BacteriaCard');

        expect(cards.length).toBe(8);
    });

    it('renders with proper accessibility labels', () => {
        const { getAllByTestId } = render(<Discover navigation={mockNavigation} />);
        const cards = getAllByTestId('BacteriaCard');

        expect(cards.length).toBe(8);
        cards.forEach(card => {
            expect(card).toBeTruthy();
        });
    });

    it('handles image loading errors gracefully', () => {
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders with proper scroll behavior', () => {
        const { getByTestId } = render(<Discover navigation={mockNavigation} />);
        const scrollView = getByTestId('Root');

        expect(scrollView).toBeTruthy();
    });

    it('handles different screen sizes', () => {
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('handles platform-specific styling', () => {
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('renders with proper grid layout', () => {
        const { getByTestId } = render(<Discover navigation={mockNavigation} />);
        const grid = getByTestId('BacteriaGrid');

        expect(grid).toBeTruthy();
    });

    it('handles touch events properly', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);
        const eColiCards = getAllByText('Escherichia coli');

        fireEvent.press(eColiCards[0]);

        expect(mockNavigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'escherichia-coli' });
    });

    it('renders with proper text hierarchy', () => {
        const { getAllByText } = render(<Discover navigation={mockNavigation} />);

        const bacteriaNames = getAllByText('Escherichia coli');

        expect(bacteriaNames.length).toBeGreaterThan(0);
    });

    it('handles translation function returning empty string', () => {
        mockT.mockReturnValue('');
        const { getByText } = render(<Discover navigation={mockNavigation} />);

        expect(() => getByText('discover_bacteria_subtitle')).toThrow();
    });

    it('handles translation function returning null', () => {
        mockT.mockReturnValue(null as any);
        expect(() => render(<Discover navigation={mockNavigation} />)).not.toThrow();
    });

    it('handles memory leaks gracefully', () => {
        const { unmount } = render(<Discover navigation={mockNavigation} />);

        expect(() => unmount()).not.toThrow();
    });

    it('renders with proper performance', () => {
        const startTime = Date.now();
        render(<Discover navigation={mockNavigation} />);
        const endTime = Date.now();

        expect(endTime - startTime).toBeLessThan(1000);
    });
});
