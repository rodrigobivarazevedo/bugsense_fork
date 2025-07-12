import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'fontAwesome6', icon: 'glass-water' },
    { family: 'materialIcons', icon: 'do-not-touch' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const PseudomonasAeruginosa: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.pseudomonas_aeruginosa.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.pseudomonas_aeruginosa.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.pseudomonas_aeruginosa.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '7',
        name: t('bacteria.pseudomonas_aeruginosa.name'),
        scientificName: t('bacteria.pseudomonas_aeruginosa.scientific_name_abbreviated'),
        image: require('../../assets/images/bacteria/pseudomonas-aeruginosa.png'),
        description: t('bacteria.pseudomonas_aeruginosa.description'),
        type: t('bacteria.pseudomonas_aeruginosa.type'),
        shape: t('bacteria.pseudomonas_aeruginosa.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.pseudomonas_aeruginosa.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default PseudomonasAeruginosa;
