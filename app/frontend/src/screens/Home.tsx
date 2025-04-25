import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Home.styles';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.Root>
      <S.Title>
        Welcome to the app
      </S.Title>
      <S.Subtitle>
        {t('check_health_in_colors')}
      </S.Subtitle>
      <S.Button onPress={() => { /* navigate */ }}>
        <S.ButtonText>{t('get_started')}</S.ButtonText>
      </S.Button>
    </S.Root>
  );
};

export default Home;
