import { FC, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import EscherichiaColi from './individual_bacteria/EscherichiaColi';
import EnterococcusFaecalis from './individual_bacteria/EnterococcusFaecalis';
import KlebsiellaPneumoniae from './individual_bacteria/KlebsiellaPneumoniae';
import StaphylococcusSaprophyticus from './individual_bacteria/StaphylococcusSaprophyticus';
import StaphylococcusAureus from './individual_bacteria/StaphylococcusAureus';
import EnterobacterHormaechei from './individual_bacteria/EnterobacterHormaechei';
import PseudomonasAeruginosa from './individual_bacteria/PseudomonasAeruginosa';
import ProteusMirabilis from './individual_bacteria/ProteusMirabilis';

const bacteriaPages = {
    'escherichia-coli': EscherichiaColi,
    'enterococcus-faecalis': EnterococcusFaecalis,
    'klebsiella-pneumoniae': KlebsiellaPneumoniae,
    'staphylococcus-saprophyticus': StaphylococcusSaprophyticus,
    'staphylococcus-aureus': StaphylococcusAureus,
    'enterobacter-hormaechei': EnterobacterHormaechei,
    'pseudomonas-aeruginosa': PseudomonasAeruginosa,
    'proteus-mirabilis': ProteusMirabilis,
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
