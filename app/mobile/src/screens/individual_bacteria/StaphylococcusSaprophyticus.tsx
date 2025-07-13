import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import BacteriaPage from '../BacteriaPage';

const preventionIcons = [
    { family: 'fontAwesome5', icon: 'hands-wash' },
    { family: 'fontAwesome6', icon: 'glass-water' },
    { family: 'materialIcons', icon: 'clean-hands' },
    { family: 'ionIcons', icon: 'shirt' }
];

const StaphylococcusSaprophyticus: FC = () => {
    const { t } = useTranslation('bacteria_discover');
    const transmission = t('bacteria.staphylococcus_saprophyticus.transmission.methods', { returnObjects: true }) as string[];
    const symptoms = t('bacteria.staphylococcus_saprophyticus.symptoms.list', { returnObjects: true }) as string[];
    const preventionTips = t('bacteria.staphylococcus_saprophyticus.prevention.tips', { returnObjects: true }) as string[];
    const bacteria = {
        id: '4',
        name: t('bacteria.staphylococcus_saprophyticus.name'),
        scientificName: t('bacteria.staphylococcus_saprophyticus.scientific_name_abbreviated'),
        image: require('../../assets/images/bacteria/staphylococcus-saprophyticus.png'),
        description: t('bacteria.staphylococcus_saprophyticus.description'),
        type: t('bacteria.staphylococcus_saprophyticus.type'),
        shape: t('bacteria.staphylococcus_saprophyticus.shape'),
        transmission,
        symptoms,
        prevention: preventionTips.map((text, idx) => ({
            ...preventionIcons[idx],
            text
        })),
        treatment: t('bacteria.staphylococcus_saprophyticus.treatment.description')
    };
    return <BacteriaPage bacteria={bacteria} />;
};

export default StaphylococcusSaprophyticus;
