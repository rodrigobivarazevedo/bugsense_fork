import React from 'react';
import BacteriaPage from '../BacteriaPage';

const salmonellaData = {
    id: '2',
    name: 'Salmonella',
    scientificName: 'Salmonella enterica',
    image: require('../../assets/images/bacteria/salmonella.png'),
    description: 'Salmonella is a group of bacteria that can cause foodborne illness. There are many different types of Salmonella bacteria, and they can cause a range of illnesses from mild gastroenteritis to severe systemic infections.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Contaminated food (especially eggs, poultry, and dairy)',
        'Contact with infected animals',
        'Person-to-person contact',
        'Contaminated water'
    ],
    symptoms: [
        'Diarrhea',
        'Fever',
        'Abdominal cramps',
        'Nausea and vomiting',
        'Headache',
        'Dehydration'
    ],
    prevention: [
        {
            icon: 'cook',
            text: 'Cook poultry, eggs, and meat thoroughly'
        },
        {
            icon: 'wash',
            text: 'Wash hands after handling raw meat or eggs'
        },
        {
            icon: 'clean',
            text: 'Clean kitchen surfaces and utensils properly'
        },
        {
            icon: 'store',
            text: 'Refrigerate food promptly and properly'
        }
    ],
    treatment: 'Most cases of Salmonella infection resolve on their own within 4-7 days. Treatment focuses on preventing dehydration by drinking plenty of fluids. In severe cases, antibiotics may be prescribed. Hospitalization may be necessary for severe cases or for people at high risk of complications.'
};

const Salmonella: React.FC = () => {
    return <BacteriaPage bacteria={salmonellaData} />;
};

export default Salmonella; 