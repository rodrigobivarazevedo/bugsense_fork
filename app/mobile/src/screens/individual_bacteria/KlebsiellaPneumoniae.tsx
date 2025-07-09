import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const klebsiellaPneumoniaeData = {
    id: '3',
    name: 'Klebsiella pneumoniae',
    scientificName: 'Klebsiella pneumoniae',
    image: require('../../assets/images/bacteria/klebsiella-pneumoniae.png'),
    description: 'Klebsiella pneumoniae is a Gram-negative bacterium that can cause various infections, particularly in healthcare settings. It is known for its ability to develop resistance to multiple antibiotics, making it a significant concern in modern medicine.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Person-to-person contact',
        'Contaminated medical equipment',
        'Hospital-acquired infections',
        'Respiratory droplets',
        'Contaminated surfaces'
    ],
    symptoms: [
        'Pneumonia (cough, fever, difficulty breathing)',
        'Urinary tract infections',
        'Bloodstream infections (sepsis)',
        'Wound infections',
        'Meningitis',
        'Liver abscesses'
    ],
    prevention: [
        {
            icon: 'wash',
            text: 'Strict hand hygiene protocols in healthcare settings'
        },
        {
            icon: 'isolation',
            text: 'Contact precautions for infected patients'
        },
        {
            icon: 'clean',
            text: 'Proper disinfection of medical equipment'
        },
        {
            icon: 'antibiotics',
            text: 'Antibiotic stewardship to prevent resistance'
        }
    ],
    treatment: 'Treatment of Klebsiella pneumoniae infections is challenging due to high rates of antibiotic resistance, including carbapenem-resistant strains (CRKP). Treatment requires susceptibility testing and often involves combination therapy with newer antibiotics. In severe cases, surgical intervention may be necessary for abscess drainage or infected tissue removal.'
};

const KlebsiellaPneumoniae: FC = () => {
    return <BacteriaPage bacteria={klebsiellaPneumoniaeData} />;
};

export default KlebsiellaPneumoniae;
