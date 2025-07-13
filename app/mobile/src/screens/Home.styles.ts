import styled from 'styled-components/native';
import { themeColors, themeTypography } from '../theme/GlobalTheme';
import { rem } from '../utils/Responsive';

export const Root = styled.View`
  flex: 1;
  background-color: ${themeColors.white};
  align-items: center;
  justify-content: center;
  padding: ${rem(1.25)}px;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${rem(2)}px;
`;

export const HeaderRow = styled.View`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const Lottie = styled.View`
  width: ${rem(12.5)}px;
  height: ${rem(12.5)}px;
`;

export const Greeting = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.text};
  position: absolute;
  bottom: ${rem(0.25)}px;
  left: ${rem(0.25)}px;
`;

export const UserName = styled.Text`
  ${themeTypography.h1};
  color: ${themeColors.primary};
  margin-bottom: ${rem(1)}px;
`;

export const Grid = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Box = styled.TouchableOpacity`
  width: 48%;
  aspect-ratio: 1;
  background-color: ${themeColors.accent};
  border-radius: ${rem(1)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${rem(1)}px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
`;

export const BoxIcon = styled.View`
  margin-bottom: ${rem(0.5)}px;
  align-items: center;
  justify-content: center;
`;

export const BoxLabel = styled.Text`
  ${themeTypography.p};
  color: ${themeColors.primary};
  text-align: center;
`;
