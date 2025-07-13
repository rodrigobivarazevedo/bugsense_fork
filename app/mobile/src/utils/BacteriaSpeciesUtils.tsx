const bacteriaSpeciesData = {
    'Efaecalis': {
        routeId: 'enterococcus-faecalis',
        displayName: 'Enterococcus faecalis'
    },
    'Kpneumoniae': {
        routeId: 'klebsiella-pneumoniae',
        displayName: 'Klebsiella pneumoniae'
    },
    'Ssaprophyticus': {
        routeId: 'staphylococcus-saprophyticus',
        displayName: 'Staphylococcus saprophyticus'
    },
    'Ehormaechei': {
        routeId: 'enterobacter-hormaechei',
        displayName: 'Enterobacter hormaechei'
    },
    'Paeruginosa': {
        routeId: 'pseudomonas-aeruginosa',
        displayName: 'Pseudomonas aeruginosa'
    },
    'Pmirabilis': {
        routeId: 'proteus-mirabilis',
        displayName: 'Proteus mirabilis'
    },
    'Saureus': {
        routeId: 'staphylococcus-aureus',
        displayName: 'Staphylococcus aureus'
    },
    'Ecoli': {
        routeId: 'escherichia-coli',
        displayName: 'Escherichia coli'
    },
};

export const navigateToBacteriaDiscoverPage = (
    navigation: any,
    species: string
) => {
    const speciesInfo = bacteriaSpeciesData[species as keyof typeof bacteriaSpeciesData];
    if (speciesInfo) {
        navigation.navigate('BacteriaRouter', { id: speciesInfo.routeId });
    }
};

export const getSpeciesDisplayName = (species: string): string => {
    const speciesInfo = bacteriaSpeciesData[species as keyof typeof bacteriaSpeciesData];
    return speciesInfo?.displayName || species;
};
