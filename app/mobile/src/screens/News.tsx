import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as S from './News.styles';
import { useTranslation } from 'react-i18next';

export const News: FC = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <S.Root contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 30 : 60 }}>
            <S.Content>
                <S.PlaceholderContainer>
                    <S.PlaceholderText>{t('updates_from_bugsense_coming_soon')}</S.PlaceholderText>
                </S.PlaceholderContainer>
            </S.Content>
        </S.Root>
    );
};

export default News;
