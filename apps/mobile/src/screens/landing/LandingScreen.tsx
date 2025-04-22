import React from 'react';
import { Logo } from '../../components/Logo';
import * as S from './LandingScreen.styles';

export const LandingScreen: React.FC = () => (
  <S.Root>
    <Logo />
    <S.Title>BugSense</S.Title>
    <S.Subtitle>
      Check your health in colors.
    </S.Subtitle>
    <S.Button onPress={() => { /* navigate */ }}>
      <S.ButtonText>Get Started</S.ButtonText>
    </S.Button>
  </S.Root>
);
