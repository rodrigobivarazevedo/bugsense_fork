import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'fontAwesome6', icon: 'bowl-food' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'fontAwesome6', icon: 'glass-water' }
];

const EscherichiaColi: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.escherichia_coli.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.escherichia_coli.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.escherichia_coli.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '1',
        name: t('bacteria.escherichia_coli.name'),
        scientificName: t('bacteria.escherichia_coli.scientific_name'),
        image: require('../../assets/images/bacteria/escherichia-coli.png'),
        description: t('bacteria.escherichia_coli.description'),
        type: t('bacteria.escherichia_coli.type'),
        shape: t('bacteria.escherichia_coli.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.escherichia_coli.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default EscherichiaColi;
