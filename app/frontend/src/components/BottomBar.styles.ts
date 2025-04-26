import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '../theme/global';
import { EdgeInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { rem } from '../utils/responsive';

interface ContainerProps {
    insets: EdgeInsets;
}

interface IconProps {
    isActive: boolean;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: ${(props: ContainerProps) => props.insets.bottom - rem(0.75)}px;
  padding-left: ${(props: ContainerProps) => props.insets.left}px;
  padding-right: ${(props: ContainerProps) => props.insets.right}px;
  background-color: ${themeColors.secondary};
  border-top-width: ${rem(0.0625)}px;
  border-top-color: ${themeColors.secondary};
  height: ${Platform.OS === 'ios' ? rem(4) : rem(3)}px;
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: ${rem(2.5)}px;
`;

export const Icon = styled(MaterialIcons) <IconProps>`
  color: ${(props: IconProps) => props.isActive ? themeColors.primary : themeColors.gray};
  font-size: ${rem(1.5)}px;
`;

export const ActiveIndicator = styled.View`
  width: ${rem(0.5)}px;
  height: ${rem(0.25)}px;
  background-color: ${themeColors.primary};
  border-radius: ${rem(0.125)}px;
  margin-top: ${rem(0.25)}px;
`; 