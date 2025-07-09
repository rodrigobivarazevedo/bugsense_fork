import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as S from './Discover.styles';
import { Platform } from 'react-native';

const bacteriaList = [
    {
        id: 'escherichia-coli',
        name: 'Escherichia coli',
        description: 'Common gut bacteria that can cause foodborne illness',
        image: require('../assets/images/bacteria/escherichia-coli.png')
    },
    {
        id: 'enterococcus-faecalis',
        name: 'Enterococcus faecalis',
        description: 'Common gut bacteria that can cause foodborne illness',
        image: require('../assets/images/bacteria/enterococcus-faecalis.png')
    },
    {
        id: 'klebsiella-pneumoniae',
        name: 'Klebsiella pneumoniae',
        description: 'Common bacteria that can cause pneumonia',
        image: require('../assets/images/bacteria/klebsiella-pneumoniae.png')
    },
    {
        id: 'staphylococcus-saprophyticus',
        name: 'Staphylococcus saprophyticus',
        description: 'Common bacteria that can cause skin infections',
        image: require('../assets/images/bacteria/staphylococcus-saprophyticus.png')
    },
    {
        id: 'staphylococcus-aureus',
        name: 'Staphylococcus aureus',
        description: 'Common bacteria that can cause skin infections',
        image: require('../assets/images/bacteria/staphylococcus-aureus.png')
    },
    {
        id: 'enterobacter-hormaechei',
        name: 'Enterobacter hormaechei',
        description: 'Common bacteria that can cause foodborne illness',
        image: require('../assets/images/bacteria/enterobacter-hormaechei.png')
    },
    {
        id: 'pseudomonas-aeruginosa',
        name: 'Pseudomonas aeruginosa',
        description: 'Common bacteria that can cause pneumonia',
        image: require('../assets/images/bacteria/pseudomonas-aeruginosa.png')
    },
    {
        id: 'proteus-mirabilis',
        name: 'Proteus mirabilis',
        description: 'Common bacteria that can cause foodborne illness',
        image: require('../assets/images/bacteria/proteus-mirabilis.png')
    }
];

export const Discover: FC<any> = ({ navigation }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const handleBacteriaPress = (id: string) => {
        navigation.navigate('BacteriaRouter', { id });
    };

    return (
        <S.Root contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 30 : 60 }}>
            <S.Title>{t('discover_bacteria')}</S.Title>
            <S.Subtitle>{t('discover_bacteria_subtitle')}</S.Subtitle>
            <S.BacteriaGrid>
                {bacteriaList.map((bacteria) => (
                    <S.BacteriaCard
                        key={bacteria.id}
                        onPress={() => handleBacteriaPress(bacteria.id)}
                    >
                        <S.BacteriaImage
                            source={bacteria.image}
                            resizeMode="cover"
                        />
                        <S.BacteriaName>{bacteria.name}</S.BacteriaName>
                        <S.BacteriaDescription>
                            {bacteria.description}
                        </S.BacteriaDescription>
                    </S.BacteriaCard>
                ))}
            </S.BacteriaGrid>
        </S.Root>
    );
};

export default Discover;
