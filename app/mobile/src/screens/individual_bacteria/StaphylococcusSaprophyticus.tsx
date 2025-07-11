import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const staphylococcusSaprophyticusData = {
    id: '4',
    name: 'Staphylococcus saprophyticus',
    scientificName: 'Staphylococcus saprophyticus',
    image: require('../../assets/images/bacteria/staphylococcus-saprophyticus.png'),
    description: 'Staphylococcus saprophyticus is a Gram-positive bacterium that is a common cause of urinary tract infections, particularly in young sexually active women. It is part of the normal skin flora and is generally less pathogenic than other staphylococcal species.',
    type: 'Gram-positive',
    shape: 'Cocci (spherical)',
    transmission: [
        'Sexual activity',
        'Poor personal hygiene',
        'Contaminated surfaces',
        'Skin-to-skin contact',
        'Fecal contamination'
    ],
    symptoms: [
        'Frequent urination',
        'Burning sensation during urination',
        'Urgency to urinate',
        'Cloudy or bloody urine',
        'Lower abdominal pain',
        'Fever (in some cases)'
    ],
    prevention: [
        {
            family: 'fontAwesome5',
            icon: 'hands-wash',
            text: 'Maintain good personal hygiene, especially after sexual activity'
        },
        {
            family: 'fontAwesome6',
            icon: 'glass-water',
            text: 'Stay well-hydrated and urinate frequently'
        },
        {
            family: 'materialIcons',
            icon: 'clean-hands',
            text: 'Wipe from front to back after using the bathroom'
        },
        {
            family: 'ionIcons',
            icon: 'shirt',
            text: 'Wear cotton underwear and avoid tight-fitting clothing'
        }
    ],
    treatment: 'Staphylococcus saprophyticus is generally susceptible to common antibiotics used for urinary tract infections. Treatment typically involves a short course of antibiotics (3-7 days). However, antibiotic resistance is increasing, so susceptibility testing may be recommended. Drinking plenty of fluids and maintaining good hygiene practices are also important for recovery.'
};

const StaphylococcusSaprophyticus: FC = () => {
    return <BacteriaPage bacteria={staphylococcusSaprophyticusData} />;
};

export default StaphylococcusSaprophyticus;
