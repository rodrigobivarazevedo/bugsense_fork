import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const enterobacterHormaecheiData = {
    id: '6',
    name: 'Enterobacter hormaechei',
    scientificName: 'Enterobacter hormaechei',
    image: require('../../assets/images/bacteria/enterobacter-hormaechei.png'),
    description: 'Enterobacter hormaechei is a Gram-negative bacterium that belongs to the Enterobacteriaceae family. It is an emerging opportunistic pathogen that can cause various infections, particularly in healthcare settings and immunocompromised patients.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Person-to-person contact',
        'Contaminated medical devices',
        'Hospital-acquired infections',
        'Contaminated surfaces',
        'Fecal-oral transmission'
    ],
    symptoms: [
        'Urinary tract infections',
        'Bloodstream infections (sepsis)',
        'Respiratory tract infections',
        'Wound infections',
        'Intra-abdominal infections',
        'Meningitis (rare)'
    ],
    prevention: [
        {
            family: 'fontAwesome5',
            icon: 'hands-wash',
            text: 'Strict hand hygiene in healthcare settings'
        },
        {
            family: 'materialIcons',
            icon: 'clean-hands',
            text: 'Proper sterilization of medical equipment'
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
    treatment: 'Treatment of Enterobacter hormaechei infections can be challenging due to intrinsic and acquired antibiotic resistance. The bacterium is naturally resistant to ampicillin and first-generation cephalosporins. Treatment requires susceptibility testing and often involves carbapenems or newer beta-lactam/beta-lactamase inhibitor combinations. In severe cases, combination therapy may be necessary.'
};

const EnterobacterHormaechei: FC = () => {
    return <BacteriaPage bacteria={enterobacterHormaecheiData} />;
};

export default EnterobacterHormaechei;
