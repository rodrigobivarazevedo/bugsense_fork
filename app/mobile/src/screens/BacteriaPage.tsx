import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import RenderIcon from '../components/RenderIcon';
import * as S from './BacteriaPage.styles';

interface BacteriaInfo {
    id: string;
    name: string;
    scientificName: string;
    image: any;
    description: string;
    type: string;
    shape: string;
    transmission: string[];
    symptoms: string[];
    prevention: {
        family: string;
        icon: string;
        text: string;
    }[];
    treatment: string;
}

interface BacteriaPageProps {
    bacteria: BacteriaInfo;
}

export const BacteriaPage: FC<BacteriaPageProps> = ({ bacteria }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <S.Root contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 30 : 60 }}>
            <S.Header>
                <S.BacteriaImage
                    source={bacteria.image}
                    resizeMode="cover"
                />
                <S.Title>{bacteria.name}</S.Title>
                <S.ScientificName>{bacteria.scientificName}</S.ScientificName>
            </S.Header>

            <S.Content>
                <S.Section>
                    <S.SectionTitle>{t('overview')}</S.SectionTitle>
                    <S.Description>{bacteria.description}</S.Description>

                    <S.InfoGrid>
                        <S.InfoItem>
                            <S.InfoLabel>{t('type')}</S.InfoLabel>
                            <S.InfoValue>{bacteria.type}</S.InfoValue>
                        </S.InfoItem>
                        <S.InfoItem>
                            <S.InfoLabel>{t('shape')}</S.InfoLabel>
                            <S.InfoValue>{bacteria.shape}</S.InfoValue>
                        </S.InfoItem>
                    </S.InfoGrid>
                </S.Section>

                <S.Section>
                    <S.SectionTitle>{t('transmission')}</S.SectionTitle>
                    <S.SymptomsList>
                        {bacteria.transmission.map((item, index) => (
                            <S.SymptomItem key={index}>
                                <S.BulletPoint />
                                <S.SymptomText>{item}</S.SymptomText>
                            </S.SymptomItem>
                        ))}
                    </S.SymptomsList>
                </S.Section>

                <S.Section>
                    <S.SectionTitle>{t('symptoms')}</S.SectionTitle>
                    <S.SymptomsList>
                        {bacteria.symptoms.map((symptom, index) => (
                            <S.SymptomItem key={index}>
                                <S.BulletPoint />
                                <S.SymptomText>{symptom}</S.SymptomText>
                            </S.SymptomItem>
                        ))}
                    </S.SymptomsList>
                </S.Section>

                <S.Section>
                    <S.SectionTitle>{t('prevention')}</S.SectionTitle>
                    <S.PreventionList>
                        {bacteria.prevention.map((item, index) => (
                            <S.PreventionItem key={index}>
                                <S.PreventionIcon>
                                    <RenderIcon
                                        family={item.family as any}
                                        icon={item.icon}
                                        fontSize={20}
                                        color="primary"
                                    />
                                </S.PreventionIcon>
                                <S.PreventionText>{item.text}</S.PreventionText>
                            </S.PreventionItem>
                        ))}
                    </S.PreventionList>
                </S.Section>

                <S.Section>
                    <S.SectionTitle>{t('treatment')}</S.SectionTitle>
                    <S.Description>{bacteria.treatment}</S.Description>
                </S.Section>
            </S.Content>
        </S.Root>
    );
};

export default BacteriaPage;
