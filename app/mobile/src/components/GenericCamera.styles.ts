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

export const TopControlsContainer = styled.View`
  position: absolute;
  top: ${rem(1)}px;
  left: ${rem(0.75)}px;
  gap: ${rem(0.5)}px;
`;

export const Button = styled(TouchableOpacity)`
  background-color: ${themeColors.secondary};
  padding: ${rem(0.75)}px;
  border-radius: ${rem(0.5)}px;
`;

export const BottomControlsContainer = styled.View`
  position: absolute;
  bottom: ${rem(1.5)}px;
  width: 100%;
  align-items: center;
`;

export const ControlButton = styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.35);
  padding: ${rem(0.75)}px ${rem(1)}px;
  border-radius: ${rem(0.5)}px;
`;

export const SnapButton = styled(TouchableOpacity)`
  width: ${rem(4)}px;
  height: ${rem(4)}px;
  border-radius: ${rem(2)}px;
  border: ${rem(0.25)}px solid ${themeColors.white};
  align-items: center;
  justify-content: center;
`;

export const SnapButtonInner = styled.View`
  width: ${rem(3)}px;
  height: ${rem(3)}px;
  border-radius: ${rem(1.5)}px;
  background-color: ${themeColors.white};
`;

export const ButtonText = styled.Text`
  font-size: ${rem(0.875)}px;
  color: ${themeColors.black};
`;
