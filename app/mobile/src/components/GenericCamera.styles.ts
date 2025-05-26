import styled from 'styled-components/native';
import { CameraView } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { rem } from '../utils/Responsive';
import { themeColors } from '../theme/GlobalTheme';

export const Root = styled.View`
  flex: 1;
  background-color: ${themeColors.white};
`;

export const PermissionsContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${rem(1)}px;
`;

export const StyledCamera = styled(CameraView)`
  flex: 1;
`;

export const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${rem(1.25)}px;
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const Button = styled(TouchableOpacity)`
  background-color: ${themeColors.secondary};
  padding: ${rem(0.75)}px;
  border-radius: ${rem(0.5)}px;
`;

export const ButtonText = styled.Text`
  font-size: ${rem(1)}px;
  color: ${themeColors.black};
`;
