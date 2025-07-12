import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'materialIcons', icon: 'do-not-touch' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const EnterobacterHormaechei: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.enterobacter_hormaechei.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.enterobacter_hormaechei.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.enterobacter_hormaechei.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '6',
        name: t('bacteria.enterobacter_hormaechei.name'),
        scientificName: t('bacteria.enterobacter_hormaechei.scientific_name'),
        image: require('../../assets/images/bacteria/enterobacter-hormaechei.png'),
        description: t('bacteria.enterobacter_hormaechei.description'),
        type: t('bacteria.enterobacter_hormaechei.type'),
        shape: t('bacteria.enterobacter_hormaechei.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.enterobacter_hormaechei.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default EnterobacterHormaechei;
