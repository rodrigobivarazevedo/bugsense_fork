import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'materialIcons', icon: 'do-not-touch' },
    { family: 'fontAwesome6', icon: 'prescription-bottle-medical' }
];

const EnterococcusFaecalis: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.enterococcus_faecalis.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.enterococcus_faecalis.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.enterococcus_faecalis.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '2',
        name: t('bacteria.enterococcus_faecalis.name'),
        scientificName: t('bacteria.enterococcus_faecalis.scientific_name'),
        image: require('../../assets/images/bacteria/enterococcus-faecalis.png'),
        description: t('bacteria.enterococcus_faecalis.description'),
        type: t('bacteria.enterococcus_faecalis.type'),
        shape: t('bacteria.enterococcus_faecalis.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.enterococcus_faecalis.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default EnterococcusFaecalis;
