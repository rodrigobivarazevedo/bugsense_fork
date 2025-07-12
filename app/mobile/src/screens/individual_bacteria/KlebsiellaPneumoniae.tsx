import { FC } from 'react';
import BacteriaPage from '../BacteriaPage';
import { useTranslation } from 'react-i18next';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'materialIcons', icon: 'do-not-touch' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const KlebsiellaPneumoniae: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.klebsiella_pneumoniae.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.klebsiella_pneumoniae.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.klebsiella_pneumoniae.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '3',
        name: t('bacteria.klebsiella_pneumoniae.name'),
        scientificName: t('bacteria.klebsiella_pneumoniae.scientific_name_abbreviated'),
        image: require('../../assets/images/bacteria/klebsiella-pneumoniae.png'),
        description: t('bacteria.klebsiella_pneumoniae.description'),
        type: t('bacteria.klebsiella_pneumoniae.type'),
        shape: t('bacteria.klebsiella_pneumoniae.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.klebsiella_pneumoniae.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default KlebsiellaPneumoniae;
