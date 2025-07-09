import styled from 'styled-components/native';
import { themeColors, themeTypography } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const Root = styled.ScrollView`
  flex: 1;
  background-color: ${themeColors.white};
`;

export const Content = styled.View`
  flex: 1;
  padding: ${rem(1.25)}px;
  justify-content: center;
  align-items: center;
  min-height: 100%;
`;

export const PlaceholderContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${rem(2)}px;
`;

export const PlaceholderText = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  text-align: center;
  opacity: 0.7;
`; 