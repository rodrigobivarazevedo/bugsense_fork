import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/global';
import { EdgeInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { rem } from '../utils/responsive';

interface ContainerProps {
    insets: EdgeInsets;
}

const customColors = {
    border: '#D8EBE0',
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: ${(props: ContainerProps) => props.insets.bottom - rem(0.75)}px;
  padding-left: ${(props: ContainerProps) => props.insets.left}px;
  padding-right: ${(props: ContainerProps) => props.insets.right}px;
  background-color: ${colors.accent};
  border-top-width: ${rem(0.0625)}px;
  border-top-color: ${customColors.border};
  height: ${Platform.OS === 'ios' ? rem(4) : rem(3)}px;
`;

export const Icon = styled(MaterialIcons)`
  color: ${colors.primary};
  font-size: ${rem(1.5)}px;
`; 