import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as S from './Discover.styles';
import { Platform } from 'react-native';

const bacteriaList = [
    {
        id: 'escherichia-coli',
        name: 'Escherichia coli',
        description: 'escherichia_coli_disoverPage_quick_description',
        image: require('../assets/images/bacteria/escherichia-coli.png')
    },
    {
        id: 'enterococcus-faecalis',
        name: 'Enterococcus faecalis',
        description: 'enterococcus_faecalis_disoverPage_quick_description',
        image: require('../assets/images/bacteria/enterococcus-faecalis.png')
    },
    {
        id: 'klebsiella-pneumoniae',
        name: 'Klebsiella pneumoniae',
        description: 'klebsiella_pneumoniae_disoverPage_quick_description',
        image: require('../assets/images/bacteria/klebsiella-pneumoniae.png')
    },
    {
        id: 'staphylococcus-saprophyticus',
        name: 'Staphylococcus saprophyticus',
        description: 'staphylococcus_saprophyticus_disoverPage_quick_description',
        image: require('../assets/images/bacteria/staphylococcus-saprophyticus.png')
    },
    {
        id: 'staphylococcus-aureus',
        name: 'Staphylococcus aureus',
        description: 'staphylococcus_aureus_disoverPage_quick_description',
        image: require('../assets/images/bacteria/staphylococcus-aureus.png')
    },
    {
        id: 'enterobacter-hormaechei',
        name: 'Enterobacter hormaechei',
        description: 'enterobacter_hormaechei_disoverPage_quick_description',
        image: require('../assets/images/bacteria/enterobacter-hormaechei.png')
    },
    {
        id: 'pseudomonas-aeruginosa',
        name: 'Pseudomonas aeruginosa',
        description: 'pseudomonas_aeruginosa_disoverPage_quick_description',
        image: require('../assets/images/bacteria/pseudomonas-aeruginosa.png')
    },
    {
        id: 'proteus-mirabilis',
        name: 'Proteus mirabilis',
        description: 'proteus_mirabilis_disoverPage_quick_description',
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
                            {t(bacteria.description)}
                        </S.BacteriaDescription>
                    </S.BacteriaCard>
                ))}
            </S.BacteriaGrid>
        </S.Root>
    );
};

export default Discover;
