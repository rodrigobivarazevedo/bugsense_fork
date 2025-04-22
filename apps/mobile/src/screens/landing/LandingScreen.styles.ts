import styled from 'styled-components/native';
import { colors, typography } from '../../theme/global';

export const Root = styled.View`
  flex: 1;
  background-color: ${colors.bg};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Title = styled.Text`
  ${typography.h1};
  color: ${colors.primary};
  margin-bottom: 12px;
`;

export const Subtitle = styled.Text`
  ${typography.p};
  text-align: center;
  margin-bottom: 24px;
  color: ${colors.text};
`;

export const Button = styled.TouchableOpacity`
  padding-vertical: 14px;
  padding-horizontal: 32px;
  border-radius: 8px;
  background-color: ${colors.accent};
`;

export const ButtonText = styled.Text`
  ${typography.p};
  font-weight: 600;
  color: ${colors.bg};
`;
