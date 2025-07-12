import { FC, useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import GenericCamera from '../components/GenericCamera';
import ScanInstructionsModal from '../components/modal/ScanInstructionsModal';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import { styles } from './Scan.styles';
import TestKitSelectModal from '../components/modal/TestKitSelectModal';
import PatientSelectModal from '../components/modal/PatientSelectModal';
import TestSelectModal from '../components/modal/TestSelectModal';

type ScanType = 'qr-code' | 'test-strip' | null;

interface Patient {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    dob: string | null;
}

export const Scan: FC = () => {
    const [selectedScanType, setSelectedScanType] = useState<ScanType>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [pendingQR, setPendingQR] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [showTestKitModal, setShowTestKitModal] = useState(false);
    const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

    // Doctor-specific states
    const [userType, setUserType] = useState<string>('patient');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showTestSelectModal, setShowTestSelectModal] = useState(false);

    useEffect(() => {
        // Get user type from AsyncStorage
        AsyncStorage.getItem('userType').then(type => {
            if (type && typeof type === 'string') {
                setUserType(type);
            }
        });
    }, []);

    const handleSelectScanType = (type: ScanType) => {
        setSelectedScanType(type);
        if (userType === 'doctor') {
            // For doctors, show patient selection after scan type selection
            setShowPatientModal(true);
        }
    };

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowPatientModal(false);
        setShowInstructionsModal(true);
    };

    const handlePatientModalClose = () => {
        setShowPatientModal(false);
        setSelectedScanType(null);
        setSelectedPatient(null);
    };

    const handleLaunchCamera = () => {
        if (userType === 'doctor' && !selectedPatient) {
            setShowPatientModal(true);
        } else {
            setShowInstructionsModal(true);
        }
    };

    const handleInstructionsConfirm = () => {
        setShowInstructionsModal(false);
        setShowCamera(true);
    };

    const handleInstructionsCancel = () => {
        setShowInstructionsModal(false);
        if (userType === 'doctor') {
            setSelectedPatient(null);
            setSelectedScanType(null);
        }
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
            let userId;

            if (userType === 'doctor') {
                if (!selectedPatient) {
                    Alert.alert('Error', 'No patient selected.');
                    resetScan();
                    return;
                }
                userId = selectedPatient.id;
            } else {
                const userString = await AsyncStorage.getItem('user');
                if (!userString) {
                    Alert.alert('Error', 'User data not found. Please log in again.');
                    resetScan();
                    return;
                }

                const user = JSON.parse(userString);
                userId = user.id || user.user_id;

                if (!userId) {
                    Alert.alert('Error', 'User ID not found. Please log in again.');
                    resetScan();
                    return;
                }
            }

            const response = await Api.post('qr-codes/', {
                user_id: userId,
                qr_data: pendingQR
            });

            const successMessage = userType === 'doctor'
                ? `QR code scanned and linked to patient '${selectedPatient?.full_name}' successfully!`
                : 'QR code scanned and linked successfully!';

            Alert.alert('Success', successMessage, [
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
        const response = await Api.get('qr-codes/list/');
        return response.data.filter((kit: any) => kit.result_status !== 'closed');
    };

    const handlePictureTaken = async (photoUri: string) => {
        if (selectedScanType === 'test-strip') {
            setPendingPhoto(photoUri);
            if (userType === 'doctor') {
                // For doctors, show test selection modal
                setShowTestSelectModal(true);
            } else {
                // For patients, show test kit selection modal
                setShowTestKitModal(true);
            }
        }
    };

    const handleTestKitModalClose = () => {
        setShowTestKitModal(false);
        setPendingPhoto(null);
    };

    const handleTestKitModalConfirm = async (qrData: string) => {
        setShowTestKitModal(false);
        if (!pendingPhoto) return;
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: pendingPhoto,
                name: 'test_strip.jpg',
                type: 'image/jpeg',
            } as any);
            const storage = 'local'; // TODO: Change to 'gcs' when deployed to Google Cloud Storage
            await Api.post(
                `upload/?qr_data=${encodeURIComponent(qrData)}&storage=${storage}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    service: 'ml',
                } as any
            );
            Alert.alert('Success', 'Image uploaded successfully!', [
                { text: 'OK', onPress: () => resetScan() }
            ]);
        } catch (err) {
            Alert.alert('Upload failed', 'Could not upload image.');
        } finally {
            setPendingPhoto(null);
        }
    };

    const handleTestSelectModalClose = () => {
        setShowTestSelectModal(false);
        setPendingPhoto(null);
    };

    const handleTestSelectModalConfirm = async (qrData: string) => {
        setShowTestSelectModal(false);
        if (!pendingPhoto) return;
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: pendingPhoto,
                name: 'test_strip.jpg',
                type: 'image/jpeg',
            } as any);
            const storage = 'local'; // TODO: Change to 'gcs' when deployed to Google Cloud Storage
            await Api.post(
                `upload/?qr_data=${encodeURIComponent(qrData)}&storage=${storage}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    service: 'ml',
                } as any
            );
            Alert.alert('Success', `Image uploaded successfully for patient '${selectedPatient?.full_name}'!`, [
                { text: 'OK', onPress: () => resetScan() }
            ]);
        } catch (err) {
            Alert.alert('Upload failed', 'Could not upload image.');
        } finally {
            setPendingPhoto(null);
        }
    };

    const resetScan = () => {
        setShowCamera(false);
        setSelectedScanType(null);
        setHasScanned(false);
        setPendingQR(null);
        setSelectedPatient(null);
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
                    message={userType === 'doctor'
                        ? `This test kit will be linked to patient '${selectedPatient?.full_name}'. Do you want to continue?`
                        : "This test kit will be linked to your profile. Do you want to continue?"
                    }
                />
                <TestKitSelectModal
                    isOpen={showTestKitModal}
                    onClose={handleTestKitModalClose}
                    onConfirm={handleTestKitModalConfirm}
                    fetchTestKits={fetchOngoingTestKits}
                />
                <TestSelectModal
                    isOpen={showTestSelectModal}
                    onClose={handleTestSelectModalClose}
                    onConfirm={handleTestSelectModalConfirm}
                    patientId={selectedPatient?.id || 0}
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

            {userType === 'doctor' && selectedPatient && (
                <View style={styles.patientInfo}>
                    <Text style={styles.patientInfoText}>
                        Selected Patient: {selectedPatient.full_name}
                    </Text>
                </View>
            )}

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

            <PatientSelectModal
                isOpen={showPatientModal}
                onClose={handlePatientModalClose}
                onConfirm={handlePatientSelect}
            />
        </View>
    );
};

export default Scan;
