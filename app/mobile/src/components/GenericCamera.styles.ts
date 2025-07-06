import styled from 'styled-components/native';
import { CameraView } from 'expo-camera';
import { TouchableOpacity, Image } from 'react-native';
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

export const PreviewImage = styled(Image)`
  flex: 1;
  width: 100%;
  height: 100%;
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

export const ButtonText = styled.Text`
  color: ${themeColors.primary};
  font-weight: bold;
`;

export const BottomControlsContainer = styled.View`
  position: absolute;
  bottom: ${rem(1.5)}px;
  width: 100%;
  flex-direction: row;
  padding-horizontal: ${rem(2)}px;
  align-items: center;
  justify-content: space-between;
`;

export const ImagePreviewControlsContainer = styled.View`
  position: absolute;
  bottom: ${rem(2)}px;
  width: 100%;
  flex-direction: row;
  padding-horizontal: ${rem(2)}px;
  align-items: center;
  justify-content: space-between;
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

export const TakePictureContainer = styled.View`
  position: absolute;
  bottom: ${rem(2)}px;
  width: 100%;
  align-items: center;
`;

export const QRCodeOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

export const QRCodeFrame = styled.View`
  width: ${rem(15)}px;
  height: ${rem(15)}px;
  border: ${rem(0.25)}px solid ${themeColors.white};
  border-radius: ${rem(1)}px;
  background-color: transparent;
`;

export const QRCodeInstructions = styled.View`
  position: absolute;
  bottom: ${rem(4)}px;
  left: ${rem(2)}px;
  right: ${rem(2)}px;
  align-items: center;
`;

export const QRCodeInstructionsText = styled.Text`
  color: ${themeColors.white};
  font-size: ${rem(1)}px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: ${rem(0.5)}px ${rem(1)}px;
  border-radius: ${rem(0.25)}px;
`;
