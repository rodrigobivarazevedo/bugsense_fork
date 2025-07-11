import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const pseudomonasAeruginosaData = {
    id: '7',
    name: 'Pseudomonas aeruginosa',
    scientificName: 'Pseudomonas aeruginosa',
    image: require('../../assets/images/bacteria/pseudomonas-aeruginosa.png'),
    description: 'Pseudomonas aeruginosa is a Gram-negative bacterium that is a major opportunistic pathogen, particularly dangerous for immunocompromised patients. It is known for its remarkable ability to develop resistance to multiple antibiotics and its ability to survive in diverse environments.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Contaminated medical equipment',
        'Hospital-acquired infections',
        'Contaminated water sources',
        'Person-to-person contact',
        'Environmental exposure'
    ],
    symptoms: [
        'Pneumonia (especially in cystic fibrosis patients)',
        'Bloodstream infections (sepsis)',
        'Urinary tract infections',
        'Wound infections',
        'Ear infections (swimmer\'s ear)',
        'Eye infections'
    ],
    prevention: [
        {
            family: 'fontAwesome5',
            icon: 'hands-wash',
            text: 'Strict hand hygiene and infection control protocols'
        },
        {
            family: 'materialIcons',
            icon: 'clean-hands',
            text: 'Proper sterilization of medical equipment'
        },
        {
            family: 'fontAwesome6',
            icon: 'glass-water',
            text: 'Avoid contaminated water sources'
        },
        {
            family: 'materialIcons',
            icon: 'do-not-touch',
            text: 'Contact precautions for infected patients'
        },
        {
            family: 'fontAwesome6',
            icon: 'prescription-bottle-medical',
            text: 'Antibiotic stewardship to prevent resistance'
        }
    ],
    treatment: 'Treatment of Pseudomonas aeruginosa infections is extremely challenging due to its intrinsic and acquired resistance to many antibiotics. It often requires combination therapy with agents like piperacillin-tazobactam, ceftazidime, or carbapenems. The bacterium can develop resistance during treatment, making susceptibility testing crucial. In severe cases, newer antibiotics like ceftolozane-tazobactam or ceftazidime-avibactam may be necessary.'
};

const PseudomonasAeruginosa: FC = () => {
    return <BacteriaPage bacteria={pseudomonasAeruginosaData} />;
};

export default PseudomonasAeruginosa;
