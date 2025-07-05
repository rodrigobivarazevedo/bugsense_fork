import { useState, useRef, FC } from 'react';
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

interface GenericCameraProps {
  onPictureTaken: (photo: string) => void;
  onQRCodeScanned?: (qrData: string) => void;
  allowFlashToggle?: boolean;
  allowFlipCamera?: boolean;
  imageQuality?: number;
  showImagePreview?: boolean;
  scanMode?: 'photo' | 'qr-code';
}

export const GenericCamera: FC<GenericCameraProps> = ({
  onPictureTaken,
  onQRCodeScanned,
  allowFlashToggle = false,
  allowFlipCamera = false,
  imageQuality = 0.8,
  showImagePreview = true,
  scanMode = 'photo',
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
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

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: imageQuality,
        skipProcessing: false,
      });

      if (photo?.uri) {
        if (showImagePreview) {
          setPreviewUri(photo.uri);
        } else {
          onPictureTaken(photo.uri);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleQRCodeScanned = ({ data }: { data: string }) => {
    if (onQRCodeScanned) {
      onQRCodeScanned(data);
    }
  };

  const handleImagePreviewReject = () => {
    setPreviewUri(null);
  };

  const handleImagePreviewApprove = () => {
    if (previewUri) {
      onPictureTaken(previewUri);
      setPreviewUri(null);
    }
  };

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };

  if (previewUri) {
    return (
      <S.Root>
        <S.PreviewImage source={{ uri: previewUri }} />
        <S.ImagePreviewControlsContainer>
          <S.ControlButton onPress={handleImagePreviewReject}>
            <RenderIcon
              family='materialIcons'
              icon="close"
              fontSize={32}
              color={themeColors.white}
            />
          </S.ControlButton>
          <S.ControlButton onPress={handleImagePreviewApprove}>
            <RenderIcon
              family='materialIcons'
              icon="check"
              fontSize={32}
              color={themeColors.white}
            />
          </S.ControlButton>
        </S.ImagePreviewControlsContainer>
      </S.Root>
    );
  }

  if (scanMode === 'qr-code') {
    return (
      <S.Root>
        <S.StyledCamera
          ref={cameraRef}
          facing={facing}
          flashMode={flash as FlashMode}
          enableTorch={flash === 'on'}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleQRCodeScanned}
        >
          <S.TopControlsContainer>
            {allowFlipCamera && (
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
            )}
            {allowFlashToggle && facing === 'back' && (
              <S.ControlButton onPress={toggleFlash}>
                {flash === 'on' ? (
                  <RenderIcon
                    family='materialIcons'
                    icon="flash-on"
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
            )}
          </S.TopControlsContainer>
          <S.QRCodeOverlay>
            <S.QRCodeFrame />
            <S.QRCodeInstructions>
              <S.QRCodeInstructionsText>Position QR code within the frame</S.QRCodeInstructionsText>
            </S.QRCodeInstructions>
          </S.QRCodeOverlay>
        </S.StyledCamera>
      </S.Root>
    );
  }

  return (
    <S.Root>
      <S.StyledCamera
        ref={cameraRef}
        facing={facing}
        flashMode={flash as FlashMode}
        enableTorch={flash === 'on'}
      >
        <S.TopControlsContainer>
          {allowFlipCamera && (
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
          )}
          {allowFlashToggle && facing === 'back' && (
            <S.ControlButton onPress={toggleFlash}>
              {flash === 'on' ? (
                <RenderIcon
                  family='materialIcons'
                  icon="flash-on"
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
          )}
        </S.TopControlsContainer>
        <S.TakePictureContainer>
          <S.SnapButton onPress={snapPicture}>
            <S.SnapButtonInner />
          </S.SnapButton>
        </S.TakePictureContainer>
      </S.StyledCamera>
    </S.Root>
  );
}

export default GenericCamera;

// TODO: Turn off shutter sound

// TODO: Check out Barcode feature
// For more features, check out CameraView.tsx, Camera.types.ts, etc.
// Flash modes: off, on, auto
// Zooming