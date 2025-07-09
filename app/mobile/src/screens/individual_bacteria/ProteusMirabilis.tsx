import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';

const proteusMirabilisData = {
    id: '8',
    name: 'Proteus mirabilis',
    scientificName: 'Proteus mirabilis',
    image: require('../../assets/images/bacteria/proteus-mirabilis.png'),
    description: 'Proteus mirabilis is a Gram-negative bacterium that is a common cause of urinary tract infections and can form urinary stones. It is known for its characteristic swarming motility and its ability to produce urease, which can lead to the formation of struvite stones in the urinary tract.',
    type: 'Gram-negative',
    shape: 'Rod-shaped',
    transmission: [
        'Fecal-oral transmission',
        'Contaminated medical devices',
        'Hospital-acquired infections',
        'Person-to-person contact',
        'Contaminated surfaces'
    ],
    symptoms: [
        'Urinary tract infections',
        'Kidney stones (struvite stones)',
        'Bloodstream infections (sepsis)',
        'Wound infections',
        'Pneumonia',
        'Abdominal pain and discomfort'
    ],
    prevention: [
        {
            icon: 'wash',
            text: 'Maintain good personal hygiene'
        },
        {
            icon: 'water',
            text: 'Stay well-hydrated to prevent urinary stasis'
        },
        {
            icon: 'clean',
            text: 'Proper sterilization of urinary catheters'
        },
        {
            icon: 'antibiotics',
            text: 'Complete prescribed antibiotic courses'
        }
    ],
    treatment: 'Treatment of Proteus mirabilis infections typically involves antibiotics such as cephalosporins, fluoroquinolones, or aminoglycosides. However, the bacterium can develop resistance to multiple antibiotics. For urinary stones caused by P. mirabilis, treatment may require surgical intervention in addition to antibiotics. Prevention of stone formation through adequate hydration and prompt treatment of UTIs is important.'
};

const ProteusMirabilis: FC = () => {
    return <BacteriaPage bacteria={proteusMirabilisData} />;
};

export default ProteusMirabilis;
