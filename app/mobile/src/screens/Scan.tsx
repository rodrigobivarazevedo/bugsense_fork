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
import { useTranslation } from 'react-i18next';

type ScanType = 'qr-code' | 'test-strip' | null;

interface Patient {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    dob: string | null;
}

export const Scan: FC = () => {
    const { t } = useTranslation();
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
                    Alert.alert(t('error'), t('no_patient_selected'));
                    resetScan();
                    return;
                }
                userId = selectedPatient.id;
            } else {
                const userString = await AsyncStorage.getItem('user');
                if (!userString) {
                    Alert.alert(t('error'), t('user_data_not_found'));
                    resetScan();
                    return;
                }

                const user = JSON.parse(userString);
                userId = user.id || user.user_id;

                if (!userId) {
                    Alert.alert(t('error'), t('user_id_not_found'));
                    resetScan();
                    return;
                }
            }

            await Api.post('qr-codes/', {
                user_id: userId,
                qr_data: pendingQR
            });

            const successMessage = userType === 'doctor'
                ? t('qr_linked_to_patient', { name: selectedPatient?.full_name })
                : t('qr_linked_to_profile');

            Alert.alert(t('success'), successMessage, [
                { text: t('ok_capital'), onPress: () => resetScan() }
            ]);
        } catch (error) {
            console.error('Error sending QR code data:', error);
            Alert.alert(t('error'), t('failed_to_process_qr_code'), [
                { text: t('ok_capital'), onPress: () => resetScan() }
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
            Alert.alert(t('success'), t('image_uploaded_success'), [
                { text: t('ok_capital'), onPress: () => resetScan() }
            ]);
        } catch (err) {
            Alert.alert(t('error'), t('failed_to_upload_image'));
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
            Alert.alert(t('success'), t('image_uploaded_for_patient', { name: selectedPatient?.full_name }), [
                { text: t('ok_capital'), onPress: () => resetScan() }
            ]);
        } catch (err) {
            Alert.alert(t('error'), t('failed_to_upload_image'));
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
                        ? t('confirm_link_kit_to_patient', { name: selectedPatient?.full_name })
                        : t('confirm_link_kit_to_profile')
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
            <Text style={styles.heading}>{t('scan_what_to_scan')}</Text>
            <View style={styles.optionsRow}>
                <TouchableOpacity
                    style={[styles.optionCard, selectedScanType === 'qr-code' && styles.selectedCard]}
                    onPress={() => handleSelectScanType('qr-code')}
                >
                    <Text style={styles.optionTitle}>{t('scan_test_kit_qr')}</Text>
                    <Text style={styles.optionDesc}>{t('scan_test_kit_qr_desc')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.optionCard, selectedScanType === 'test-strip' && styles.selectedCard]}
                    onPress={() => handleSelectScanType('test-strip')}
                >
                    <Text style={styles.optionTitle}>{t('scan_test_strip')}</Text>
                    <Text style={styles.optionDesc}>{t('scan_test_strip_desc')}</Text>
                </TouchableOpacity>
            </View>

            {userType === 'doctor' && selectedPatient && (
                <View style={styles.patientInfo}>
                    <Text style={styles.patientInfoText}>
                        {t('selected_patient', { name: selectedPatient.full_name })}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.launchButton, !selectedScanType && styles.disabledButton]}
                onPress={handleLaunchCamera}
                disabled={!selectedScanType}
            >
                <Text style={styles.launchButtonText}>{t('launch_camera')}</Text>
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
