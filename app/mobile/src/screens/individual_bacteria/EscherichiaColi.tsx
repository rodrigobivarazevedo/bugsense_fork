import React from 'react';
import BacteriaPage from '../BacteriaPage';

const escherichiaColiData = {
    id: '1',
    name: 'Escherichia coli',
    scientificName: 'Escherichia coli',
    image: require('../../assets/images/bacteria/escherichia-coli.png'),
    description: 'Escherichia coli (E. coli) is a type of bacteria that normally lives in the intestines of people and animals. While most strains are harmless, some can cause serious food poisoning and other infections.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Contaminated food or water',
        'Contact with infected animals',
        'Person-to-person contact',
        'Poor hygiene practices'
    ],
    symptoms: [
        'Severe stomach cramps',
        'Diarrhea (often bloody)',
        'Vomiting',
        'Fever (usually not very high)',
        'Dehydration',
        'Fatigue'
    ],
    prevention: [
        {
            icon: 'wash',
            text: 'Wash hands thoroughly with soap and water'
        },
        {
            icon: 'cook',
            text: 'Cook meat thoroughly to safe temperatures'
        },
        {
            icon: 'clean',
            text: 'Wash fruits and vegetables before eating'
        },
        {
            icon: 'water',
            text: 'Drink only pasteurized milk and juices'
        }
    ],
    treatment: 'Most E. coli infections resolve on their own within 5-7 days. Treatment focuses on managing symptoms and preventing dehydration. Antibiotics are generally not recommended as they may increase the risk of complications. In severe cases, hospitalization may be required for intravenous fluids and supportive care.'
};

const EscherichiaColi: React.FC = () => {
    return <BacteriaPage bacteria={escherichiaColiData} />;
};

export default EscherichiaColi;
