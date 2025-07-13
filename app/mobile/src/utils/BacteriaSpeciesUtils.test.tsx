import {
    navigateToBacteriaDiscoverPage,
    getSpeciesDisplayName
} from './BacteriaSpeciesUtils';

describe('BacteriaSpeciesUtils', () => {
    let mockNavigation: { navigate: jest.Mock };

    beforeEach(() => {
        mockNavigation = { navigate: jest.fn() };
    });

    it('should get correct display name for known species', () => {
        expect(getSpeciesDisplayName('Ecoli')).toBe('Escherichia coli');
        expect(getSpeciesDisplayName('Saureus')).toBe('Staphylococcus aureus');
    });

    it('should return original species name for unknown species', () => {
        expect(getSpeciesDisplayName('UnknownSpecies')).toBe('UnknownSpecies');
    });

    it('should navigate to correct route for known species', () => {
        navigateToBacteriaDiscoverPage(mockNavigation, 'Ecoli');
        expect(mockNavigation.navigate).toHaveBeenCalledWith('BacteriaRouter', { id: 'escherichia-coli' });
    });

    it('should not navigate for unknown species', () => {
        navigateToBacteriaDiscoverPage(mockNavigation, 'UnknownSpecies');
        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
}); 