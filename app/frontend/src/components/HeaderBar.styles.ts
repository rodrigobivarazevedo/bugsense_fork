import styled from 'styled-components/native';
import { themeColors } from '../theme/GlobalTheme';
import { EdgeInsets } from 'react-native-safe-area-context';
import { rem } from '../utils/responsive';

interface ContainerProps {
  insets: EdgeInsets;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${rem(0.25)}px;
  padding-top: ${(props: ContainerProps) => props.insets.top + rem(0.25)}px;
  padding-left: ${(props: ContainerProps) => props.insets.left + rem(1)}px;
  padding-right: ${(props: ContainerProps) => props.insets.right + rem(1)}px;
  background-color: ${themeColors.secondary};
  border-bottom-width: ${rem(0.0625)}px;
  border-bottom-color: ${themeColors.secondary};
`;

export const LogoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;