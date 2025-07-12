import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'materialIcons', icon: 'do-not-touch' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const StaphylococcusAureus: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.staphylococcus_aureus.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.staphylococcus_aureus.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.staphylococcus_aureus.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '5',
        name: t('bacteria.staphylococcus_aureus.name'),
        scientificName: t('bacteria.staphylococcus_aureus.scientific_name'),
        image: require('../../assets/images/bacteria/staphylococcus-aureus.png'),
        description: t('bacteria.staphylococcus_aureus.description'),
        type: t('bacteria.staphylococcus_aureus.type'),
        shape: t('bacteria.staphylococcus_aureus.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.staphylococcus_aureus.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default StaphylococcusAureus;
