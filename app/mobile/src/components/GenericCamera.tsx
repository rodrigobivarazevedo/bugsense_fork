import React, { useState, useRef } from 'react';
import {
  CameraView,
  useCameraPermissions,
  CameraType,
} from 'expo-camera';
import * as S from './GenericCamera.styles';

export const GenericCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
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

  return (
    <S.Root>
      <S.StyledCamera
        ref={cameraRef}
        facing={facing}
      >
        <S.ButtonContainer>
          <S.Button onPress={snapPicture}>
            <S.ButtonText>Snap</S.ButtonText>
          </S.Button>
          <S.Button
            onPress={() =>
              setFacing(facing === 'back' ? 'front' : 'back')
            }
          >
            <S.ButtonText>Flip</S.ButtonText>
          </S.Button>
        </S.ButtonContainer>
      </S.StyledCamera>
    </S.Root>
  );
}

export default GenericCamera;
