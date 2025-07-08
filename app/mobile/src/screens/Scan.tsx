import { FC, useState } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import GenericCamera from '../components/GenericCamera';
import ScanInstructionsModal from '../components/modal/ScanInstructionsModal';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import { styles } from './Scan.styles';
import TestKitSelectModal from '../components/modal/TestKitSelectModal';

type ScanType = 'qr-code' | 'test-strip' | null;

export const Scan: FC = () => {
    const [selectedScanType, setSelectedScanType] = useState<ScanType>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [pendingQR, setPendingQR] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [showTestKitModal, setShowTestKitModal] = useState(false);
    const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSelectScanType = (type: ScanType) => {
        setSelectedScanType(type);
    };

    const handleLaunchCamera = () => {
        setShowInstructionsModal(true);
    };

    const handleInstructionsConfirm = () => {
        setShowInstructionsModal(false);
        setShowCamera(true);
    };

    const handleInstructionsCancel = () => {
        setShowInstructionsModal(false);
    };

    const handleQRCodeScanned = (qrData: string) => {
        if (hasScanned) return;
        setHasScanned(true);
        setPendingQR(qrData);
        setShowConfirmModal(true);
    };

    const handleConfirmLinkKit = async () => {
        setShowConfirmModal(false);
        if (!pendingQR) return;
        try {
            const userString = await AsyncStorage.getItem('user');
            if (!userString) {
                Alert.alert('Error', 'User data not found. Please log in again.');
                resetScan();
                return;
            }

            const user = JSON.parse(userString);
            const userId = user.id || user.user_id;

            if (!userId) {
                Alert.alert('Error', 'User ID not found. Please log in again.');
                resetScan();
                return;
            }

            const response = await Api.post('qr-codes/', {
                user_id: userId,
                qr_data: pendingQR
            });

            Alert.alert('Success', 'QR code scanned and linked successfully!', [
                { text: 'OK', onPress: () => resetScan() }
            ]);
        } catch (error) {
            console.error('Error sending QR code data:', error);
            Alert.alert('Error', 'Failed to process QR code. Please try again.', [
                { text: 'OK', onPress: () => resetScan() }
            ]);
        }
    };

    const handleCancelLinkKit = () => {
        setShowConfirmModal(false);
        setHasScanned(false);
        setPendingQR(null);
    };

    const fetchOngoingTestKits = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await Api.get('qr-codes/list/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.filter((kit: any) => kit.result_status !== 'closed');
    };

    const handlePictureTaken = async (photoUri: string) => {
        if (selectedScanType === 'test-strip') {
            setPendingPhoto(photoUri);
            setShowTestKitModal(true);
        }
    };

    const handleTestKitModalClose = () => {
        setShowTestKitModal(false);
        setPendingPhoto(null);
    };

    const handleTestKitModalConfirm = async (qrData: string) => {
        setShowTestKitModal(false);
        if (!pendingPhoto) return;
        setUploading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', {
                uri: pendingPhoto,
                name: 'test_strip.jpg',
                type: 'image/jpeg',
            } as any);
            const storage = 'local';
            await Api.post(
                `upload/?qr_data=${encodeURIComponent(qrData)}&storage=${storage}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                    service: 'ml',
                } as any
            );
            Alert.alert('Success', 'Image uploaded successfully!');
            setShowCamera(false);
            setSelectedScanType(null);
            setHasScanned(false);
            setPendingQR(null);
        } catch (err) {
            Alert.alert('Upload failed', 'Could not upload image.');
        } finally {
            setUploading(false);
            setPendingPhoto(null);
        }
    };

    const resetScan = () => {
        setShowCamera(false);
        setSelectedScanType(null);
        setHasScanned(false);
        setPendingQR(null);
    };

    if (showCamera && selectedScanType) {
        return (
            <>
                <GenericCamera
                    allowFlashToggle
                    allowFlipCamera
                    showImagePreview={selectedScanType === 'test-strip'}
                    scanMode={selectedScanType === 'qr-code' ? 'qr-code' : 'photo'}
                    onPictureTaken={handlePictureTaken}
                    onQRCodeScanned={selectedScanType === 'qr-code' ? handleQRCodeScanned : undefined}
                />
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    onClose={handleCancelLinkKit}
                    onConfirm={handleConfirmLinkKit}
                    message={"This test kit will be linked to your profile. Do you want to continue?"}
                />
                <TestKitSelectModal
                    isOpen={showTestKitModal}
                    onClose={handleTestKitModalClose}
                    onConfirm={handleTestKitModalConfirm}
                    fetchTestKits={fetchOngoingTestKits}
                />
            </>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>What would you like to scan?</Text>
            <View style={styles.optionsRow}>
                <TouchableOpacity
                    style={[styles.optionCard, selectedScanType === 'qr-code' && styles.selectedCard]}
                    onPress={() => handleSelectScanType('qr-code')}
                >
                    <Text style={styles.optionTitle}>Test Kit QR Code</Text>
                    <Text style={styles.optionDesc}>Scan the QR code on your test kit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.optionCard, selectedScanType === 'test-strip' && styles.selectedCard]}
                    onPress={() => handleSelectScanType('test-strip')}
                >
                    <Text style={styles.optionTitle}>Test Strip</Text>
                    <Text style={styles.optionDesc}>Scan the test strip result</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.launchButton, !selectedScanType && styles.disabledButton]}
                onPress={handleLaunchCamera}
                disabled={!selectedScanType}
            >
                <Text style={styles.launchButtonText}>Launch Camera</Text>
            </TouchableOpacity>
            <ScanInstructionsModal
                isOpen={showInstructionsModal}
                onClose={handleInstructionsCancel}
                onConfirm={handleInstructionsConfirm}
                scanType={selectedScanType as 'qr-code' | 'test-strip'}
            />
        </View>
    );
};

export default Scan;
