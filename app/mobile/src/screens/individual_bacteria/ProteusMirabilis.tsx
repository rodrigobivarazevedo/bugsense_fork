import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'fontAwesome6', icon: 'glass-water' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const ProteusMirabilis: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.proteus_mirabilis.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.proteus_mirabilis.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.proteus_mirabilis.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '8',
        name: t('bacteria.proteus_mirabilis.name'),
        scientificName: t('bacteria.proteus_mirabilis.scientific_name_abbreviated'),
        image: require('../../assets/images/bacteria/proteus-mirabilis.png'),
        description: t('bacteria.proteus_mirabilis.description'),
        type: t('bacteria.proteus_mirabilis.type'),
        shape: t('bacteria.proteus_mirabilis.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.proteus_mirabilis.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default ProteusMirabilis;
