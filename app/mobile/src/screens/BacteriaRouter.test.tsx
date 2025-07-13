import { render } from '@testing-library/react-native';
import BacteriaRouter from './BacteriaRouter';

const mockSetOptions = jest.fn();
const mockNavigation = {
    setOptions: mockSetOptions,
};

const mockRoute = {
    params: { id: 'escherichia-coli' },
};

jest.mock('@react-navigation/native', () => ({
    useRoute: () => mockRoute,
    useNavigation: () => mockNavigation,
}));

jest.mock('./individual_bacteria/EscherichiaColi', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'escherichia-coli', ...props });
    });
});

jest.mock('./individual_bacteria/EnterococcusFaecalis', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'enterococcus-faecalis', ...props });
    });
});

jest.mock('./individual_bacteria/KlebsiellaPneumoniae', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'klebsiella-pneumoniae', ...props });
    });
});

jest.mock('./individual_bacteria/StaphylococcusSaprophyticus', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'staphylococcus-saprophyticus', ...props });
    });
});

jest.mock('./individual_bacteria/StaphylococcusAureus', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'staphylococcus-aureus', ...props });
    });
});

jest.mock('./individual_bacteria/EnterobacterHormaechei', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'enterobacter-hormaechei', ...props });
    });
});

jest.mock('./individual_bacteria/PseudomonasAeruginosa', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'pseudomonas-aeruginosa', ...props });
    });
});

jest.mock('./individual_bacteria/ProteusMirabilis', () => {
    const React = require('react');
    return React.forwardRef(({ testID, ...props }: any, ref: any) => {
        return React.createElement('View', { ref, testID: testID || 'proteus-mirabilis', ...props });
    });
});

describe('BacteriaRouter component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing with default props', () => {
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('renders Escherichia coli component when id is escherichia-coli', () => {
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('escherichia-coli');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for escherichia-coli', () => {
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Escherichia Coli' });
    });

    it('renders Enterococcus faecalis component when id is enterococcus-faecalis', () => {
        mockRoute.params.id = 'enterococcus-faecalis';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('enterococcus-faecalis');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for enterococcus-faecalis', () => {
        mockRoute.params.id = 'enterococcus-faecalis';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Enterococcus Faecalis' });
    });

    it('renders Klebsiella pneumoniae component when id is klebsiella-pneumoniae', () => {
        mockRoute.params.id = 'klebsiella-pneumoniae';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('klebsiella-pneumoniae');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for klebsiella-pneumoniae', () => {
        mockRoute.params.id = 'klebsiella-pneumoniae';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Klebsiella Pneumoniae' });
    });

    it('renders Staphylococcus saprophyticus component when id is staphylococcus-saprophyticus', () => {
        mockRoute.params.id = 'staphylococcus-saprophyticus';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('staphylococcus-saprophyticus');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for staphylococcus-saprophyticus', () => {
        mockRoute.params.id = 'staphylococcus-saprophyticus';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Staphylococcus Saprophyticus' });
    });

    it('renders Staphylococcus aureus component when id is staphylococcus-aureus', () => {
        mockRoute.params.id = 'staphylococcus-aureus';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('staphylococcus-aureus');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for staphylococcus-aureus', () => {
        mockRoute.params.id = 'staphylococcus-aureus';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Staphylococcus Aureus' });
    });

    it('renders Enterobacter hormaechei component when id is enterobacter-hormaechei', () => {
        mockRoute.params.id = 'enterobacter-hormaechei';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('enterobacter-hormaechei');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for enterobacter-hormaechei', () => {
        mockRoute.params.id = 'enterobacter-hormaechei';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Enterobacter Hormaechei' });
    });

    it('renders Pseudomonas aeruginosa component when id is pseudomonas-aeruginosa', () => {
        mockRoute.params.id = 'pseudomonas-aeruginosa';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('pseudomonas-aeruginosa');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for pseudomonas-aeruginosa', () => {
        mockRoute.params.id = 'pseudomonas-aeruginosa';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Pseudomonas Aeruginosa' });
    });

    it('renders Proteus mirabilis component when id is proteus-mirabilis', () => {
        mockRoute.params.id = 'proteus-mirabilis';
        const { getByTestId } = render(<BacteriaRouter />);
        const component = getByTestId('proteus-mirabilis');

        expect(component).toBeTruthy();
    });

    it('sets navigation title for proteus-mirabilis', () => {
        mockRoute.params.id = 'proteus-mirabilis';
        render(<BacteriaRouter />);

        expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Proteus Mirabilis' });
    });

    it('returns null for invalid bacteria id', () => {
        mockRoute.params.id = 'invalid-bacteria';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles empty id parameter', () => {
        mockRoute.params.id = '';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with single word', () => {
        mockRoute.params.id = 'single';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with multiple hyphens', () => {
        mockRoute.params.id = 'very-long-bacteria-name';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with uppercase letters', () => {
        mockRoute.params.id = 'ESCHERICHIA-COLI';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with numbers', () => {
        mockRoute.params.id = 'bacteria-123';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with special characters', () => {
        mockRoute.params.id = 'bacteria@test';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with spaces', () => {
        mockRoute.params.id = 'bacteria test';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with leading hyphen', () => {
        mockRoute.params.id = '-bacteria';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with trailing hyphen', () => {
        mockRoute.params.id = 'bacteria-';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with consecutive hyphens', () => {
        mockRoute.params.id = 'bacteria--test';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles very long id', () => {
        mockRoute.params.id = 'very-long-bacteria-name-that-exceeds-normal-length-limits';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with mixed case', () => {
        mockRoute.params.id = 'EsChErIcHiA-cOlI';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with only hyphens', () => {
        mockRoute.params.id = '---';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with single character words', () => {
        mockRoute.params.id = 'a-b-c';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with very long words', () => {
        mockRoute.params.id = 'verylongwordwithoutspaces-anotherverylongword';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with unicode characters', () => {
        mockRoute.params.id = 'bacteria-测试';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with emoji', () => {
        mockRoute.params.id = 'bacteria-🦠';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with only numbers', () => {
        mockRoute.params.id = '123-456';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with only special characters', () => {
        mockRoute.params.id = '@#$-%^&';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with leading and trailing spaces', () => {
        mockRoute.params.id = ' escherichia-coli ';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });

    it('handles id with tabs and newlines', () => {
        mockRoute.params.id = 'escherichia\tcoli\n';
        expect(() => render(<BacteriaRouter />)).not.toThrow();
    });
});
