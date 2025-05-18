import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as S from './Discover.styles';
import { Platform } from 'react-native';

const bacteriaList = [
    {
        id: '1',
        name: 'Escherichia coli',
        description: 'Common gut bacteria that can cause foodborne illness',
        image: require('../assets/images/bacteria/escherichia-coli.png')
    },
    {
        id: '2',
        name: 'Salmonella',
        description: 'Bacteria that can cause food poisoning and typhoid fever',
        image: require('../assets/images/bacteria/salmonella.png')
    },
    {
        id: '3',
        name: 'Listeria monocytogenes',
        description: 'Can cause serious infections, especially in pregnant women',
        image: require('../assets/images/bacteria/listeria-monocytogenes.png')
    },
    {
        id: '4',
        name: 'Staphylococcus aureus',
        description: 'Common bacteria that can cause skin infections',
        image: require('../assets/images/bacteria/staphylococcus-aureus.png')
    },
    {
        id: '5',
        name: 'Campylobacter',
        description: 'Leading cause of bacterial foodborne illness',
        image: require('../assets/images/bacteria/campylobacter.png')
    },
    {
        id: '6',
        name: 'Clostridium perfringens',
        description: 'Bacteria that can cause food poisoning and gas gangrene',
        image: require('../assets/images/bacteria/clostridium-perfringens.png')
    },
    {
        id: '7',
        name: 'Streptococcus pyogenes',
        description: 'Bacteria that can cause strep throat and scarlet fever',
        image: require('../assets/images/bacteria/streptococcus-pyogenes.png')
    },
    {
        id: '8',
        name: 'Streptococcus pneumoniae',
        description: 'Bacteria that can cause pneumonia and meningitis',
        image: require('../assets/images/bacteria/streptococcus-pneumoniae.png')
    },
];

export const Discover: React.FC = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const handleBacteriaPress = (id: string) => {
        console.log(`Pressed bacteria with id: ${id}`);
    };

    return (
        <S.Root contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 30 : 60}}>
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
