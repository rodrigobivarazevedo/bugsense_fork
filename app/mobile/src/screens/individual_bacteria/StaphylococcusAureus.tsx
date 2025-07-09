import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const staphylococcusAureusData = {
    id: '5',
    name: 'Staphylococcus aureus',
    scientificName: 'Staphylococcus aureus',
    image: require('../../assets/images/bacteria/staphylococcus-aureus.png'),
    description: 'Staphylococcus aureus is a Gram-positive bacterium that can cause a wide range of infections, from minor skin infections to life-threatening conditions. It is known for its ability to develop resistance to antibiotics, particularly methicillin-resistant S. aureus (MRSA).',
    type: 'Gram-positive',
    shape: 'Cocci (spherical)',
    transmission: [
        'Direct skin-to-skin contact',
        'Contaminated surfaces and objects',
        'Droplet transmission (coughing, sneezing)',
        'Healthcare settings (HA-MRSA)',
        'Community settings (CA-MRSA)'
    ],
    symptoms: [
        'Skin infections (boils, abscesses, cellulitis)',
        'Pneumonia',
        'Bloodstream infections (sepsis)',
        'Bone and joint infections',
        'Endocarditis (heart valve infections)',
        'Toxic shock syndrome'
    ],
    prevention: [
        {
            icon: 'wash',
            text: 'Frequent hand washing with soap and water'
        },
        {
            icon: 'clean',
            text: 'Keep wounds clean and covered until healed'
        },
        {
            icon: 'personal',
            text: 'Avoid sharing personal items (towels, razors)'
        },
        {
            icon: 'antibiotics',
            text: 'Complete prescribed antibiotic courses'
        }
    ],
    treatment: 'Treatment depends on the type and severity of infection. Methicillin-susceptible S. aureus (MSSA) can be treated with beta-lactam antibiotics. MRSA requires alternative antibiotics like vancomycin, daptomycin, or linezolid. Severe infections may require surgical drainage and intravenous antibiotics. Prevention of resistance through proper antibiotic stewardship is crucial.'
};

const StaphylococcusAureus: FC = () => {
    return <BacteriaPage bacteria={staphylococcusAureusData} />;
};

export default StaphylococcusAureus;
