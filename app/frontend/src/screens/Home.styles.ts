import styled from 'styled-components/native';
import { colors, typography } from '../theme/global';
import { rem } from '../utils/responsive';

export const Root = styled.View`
  flex: 1;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  padding: ${rem(1.25)}px;
`;

export const Title = styled.Text`
  ${typography.h1};
  color: ${colors.primary};
  margin-bottom: ${rem(0.75)}px;
`;

export const Subtitle = styled.Text`
  ${typography.p};
  text-align: center;
  margin-bottom: ${rem(1.5)}px;
  color: ${colors.text};
`;

export const Button = styled.TouchableOpacity`
  padding-vertical: ${rem(0.875)}px;
  padding-horizontal: ${rem(2)}px;
  border-radius: ${rem(0.5)}px;
  background-color: ${colors.primary};
`;

export const ButtonText = styled.Text`
  ${typography.p};
  font-weight: 600;
  color: ${colors.white};
`;
