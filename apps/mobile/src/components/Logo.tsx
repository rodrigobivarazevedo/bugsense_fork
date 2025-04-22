import React from 'react';
import * as S from './Logo.styles';

export const Logo: React.FC = () => (
  <S.Container>
    <S.Image source={require('../assets/icon.png')} resizeMode="contain" />
  </S.Container>
);
