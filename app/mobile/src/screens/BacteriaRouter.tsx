import { FC, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import EscherichiaColi from './individual_bacteria/EscherichiaColi';
import Salmonella from './individual_bacteria/Salmonella';
// import ListeriaMonocytogenes from './individual_bacteria/ListeriaMonocytogenes';
// import StaphylococcusAureus from './individual_bacteria/StaphylococcusAureus';
// import Campylobacter from './individual_bacteria/Campylobacter';
// import ClostridiumPerfringens from './individual_bacteria/ClostridiumPerfringens';
// import StreptococcusPyogenes from './individual_bacteria/StreptococcusPyogenes';
// import StreptococcusPneumoniae from './individual_bacteria/StreptococcusPneumoniae';

const bacteriaPages = {
    'escherichia-coli': EscherichiaColi,
    'salmonella': Salmonella,
    // 'listeria-monocytogenes': ListeriaMonocytogenes,
    // 'staphylococcus-aureus': StaphylococcusAureus,
    // 'campylobacter': Campylobacter,
    // 'clostridium-perfringens': ClostridiumPerfringens,
    // 'streptococcus-pyogenes': StreptococcusPyogenes,
    // 'streptococcus-pneumoniae': StreptococcusPneumoniae,
};

export const BacteriaRouter: FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };

    useEffect(() => {
        const bacteriaName = id.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        navigation.setOptions({ title: bacteriaName });
    }, [id, navigation]);

    const BacteriaComponent = bacteriaPages[id as keyof typeof bacteriaPages];

    if (!BacteriaComponent) {
        return null;
    }

    return <BacteriaComponent />;
};

export default BacteriaRouter;
