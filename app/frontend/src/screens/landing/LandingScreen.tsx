import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import * as S from './LandingScreen.styles';

export const LandingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Root>
      <Logo />
      <S.Title>{t('bugsense')}</S.Title>
      <S.Subtitle>
        {t('check_health_in_colors')}
      </S.Subtitle>
      <S.Button onPress={() => { /* navigate */ }}>
        <S.ButtonText>{t('get_started')}</S.ButtonText>
      </S.Button>
    </S.Root>
  );
};
