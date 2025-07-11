import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const enterococcusFaecalisData = {
    id: '2',
    name: 'Enterococcus faecalis',
    scientificName: 'Enterococcus faecalis',
    image: require('../../assets/images/bacteria/enterococcus-faecalis.png'),
    description: 'Enterococcus faecalis is a Gram-positive bacterium that is part of the normal intestinal flora in humans and animals. While generally harmless in healthy individuals, it can cause serious infections, particularly in hospital settings and in immunocompromised patients.',
    type: 'Gram-positive',
    shape: 'Cocci (spherical)',
    transmission: [
        'Person-to-person contact',
        'Contaminated medical devices',
        'Hospital-acquired infections',
        'Fecal-oral transmission',
        'Contaminated food or water'
    ],
    symptoms: [
        'Urinary tract infections',
        'Bacteremia (bloodstream infections)',
        'Endocarditis (heart valve infections)',
        'Intra-abdominal infections',
        'Wound infections',
        'Meningitis (rare)'
    ],
    prevention: [
        {
            family: 'fontAwesome5',
            icon: 'hands-wash',
            text: 'Practice good hand hygiene, especially in healthcare settings'
        },
        {
            family: 'materialIcons',
            icon: 'clean-hands',
            text: 'Proper sterilization of medical equipment'
        },
        {
            family: 'materialIcons',
            icon: 'do-not-touch',
            text: 'Isolation protocols for infected patients'
        },
        {
            family: 'fontAwesome6',
            icon: 'prescription-bottle-medical',
            text: 'Judicious use of antibiotics to prevent resistance'
        }
    ],
    treatment: 'Treatment of Enterococcus faecalis infections can be challenging due to increasing antibiotic resistance. Vancomycin-resistant Enterococcus (VRE) is a major concern. Treatment typically involves combination antibiotic therapy, and the choice of antibiotics depends on susceptibility testing. In severe cases, surgical intervention may be required for abscess drainage or infected device removal.'
};

const EnterococcusFaecalis: FC = () => {
    return <BacteriaPage bacteria={enterococcusFaecalisData} />;
};

export default EnterococcusFaecalis;
