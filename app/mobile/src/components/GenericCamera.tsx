import React, { useState, useRef } from 'react';
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  FlashMode,
} from 'expo-camera';
import RenderIcon from './RenderIcon';
import { Platform } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import * as S from './GenericCamera.styles';

export const GenericCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <S.Root>
        <S.PermissionsContainer>
          <S.ButtonText>Loading permissions…</S.ButtonText>
        </S.PermissionsContainer>
      </S.Root>
    );
  }

  if (!permission.granted) {
    return (
      <S.Root>
        <S.PermissionsContainer>
          <S.ButtonText>Camera access is required</S.ButtonText>
          <S.Button onPress={requestPermission}>
            <S.ButtonText>Grant Permission</S.ButtonText>
          </S.Button>
        </S.PermissionsContainer>
      </S.Root>
    );
  }

  const snapPicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo?.uri);
  };

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : flash === 'on' ? 'auto' : 'off');
  };

  return (
    <S.Root>
      <S.StyledCamera
        ref={cameraRef}
        facing={facing}
        flashMode={flash}
      >
        <S.TopControlsContainer>
          <S.ControlButton onPress={toggleFlash}>
            {flash === 'on' ? (
              <RenderIcon
                family='materialIcons'
                icon="flash-on"
                fontSize={24}
                color={themeColors.white}
              />
            ) : flash === 'auto' ? (
              <RenderIcon
                family='materialIcons'
                icon="flash-auto"
                fontSize={24}
                color={themeColors.white}
              />
            ) : (
              <RenderIcon
                family='materialIcons'
                icon="flash-off"
                fontSize={24}
                color={themeColors.white}
              />
            )}
          </S.ControlButton>
          <S.ControlButton
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <RenderIcon
              family='materialIcons'
              icon={Platform.OS === 'android' ? 'flip-camera-android' : 'flip-camera-ios'}
              fontSize={24}
              color={themeColors.white}
            />
          </S.ControlButton>
        </S.TopControlsContainer>
        <S.BottomControlsContainer>
          <S.SnapButton onPress={snapPicture}>
            <S.SnapButtonInner />
          </S.SnapButton>
        </S.BottomControlsContainer>
      </S.StyledCamera>
    </S.Root>
  );
}

export default GenericCamera;

// TODO: Check out Barcode feature
// For more features, check out CameraView.tsx, Camera.types.ts, etc.