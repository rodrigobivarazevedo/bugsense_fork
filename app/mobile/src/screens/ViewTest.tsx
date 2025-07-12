import { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ViewTest.styles';
import RenderIcon from '../components/RenderIcon';
import { themeColors } from '../theme/GlobalTheme';
import * as Clipboard from 'expo-clipboard';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { useTranslation } from 'react-i18next';
import ScanInstructionsModal from '../components/modal/ScanInstructionsModal';
import { formatDateTimeGerman } from '../utils/DateTimeFormatter';
import { navigateToBacteriaDiscoverPage, getSpeciesDisplayName } from '../utils/BacteriaSpeciesUtils';

const ViewTest: FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    // @ts-ignore
    const { test } = route.params || {};
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showScanModal, setShowScanModal] = useState(false);
    const [shouldOpenPicker, setShouldOpenPicker] = useState(false);

    useEffect(() => {
        const fetchResult = async () => {
            if (!test?.qr_data) return;
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await Api.get(`results/list/?qr_data=${encodeURIComponent(test.qr_data)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResult(response.data && response.data.length > 0 ? response.data[0] : null);
            } catch (err) {
                setError(t('failed_to_load_test_results'));
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [test?.qr_data]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(t('permission_required'), t('permission_to_access_media_library_required'));
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return;
        setUploading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', {
                uri: image,
                name: 'test_image.jpg',
                type: 'image/jpeg',
            } as any);
            const qrData = test?.qr_data;
            const storage = 'local'; // TODO: Change to 'gcs' when deployed to Google Cloud Storage
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
            Alert.alert(t('success'), t('image_uploaded_successfully'));
            setImage(null);
        } catch (err) {
            Alert.alert(t('upload_failed'), t('could_not_upload_image'));
        } finally {
            setUploading(false);
        }
    };

    const goToScan = () => {
        // @ts-ignore
        navigation.navigate('Scan', { testId: test?.id });
    };

    const handleCopyQrData = async () => {
        await Clipboard.setStringAsync(test?.qr_data || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleScanModalConfirm = () => {
        setShowScanModal(false);
        setShouldOpenPicker(true);
    };

    const handleScanModalClose = () => {
        setShowScanModal(false);
    };

    const handleScanModalDismiss = () => {
        if (shouldOpenPicker) {
            setShouldOpenPicker(false);
            pickImage();
        }
    };

    const handlePickFromGallery = () => {
        setShowScanModal(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>{t('test_started_at_colon')}</Text>
                <Text style={styles.value}>{formatDateTimeGerman(result?.created_at)}</Text>
                <Text style={styles.label}>{t('test_status_colon')}</Text>
                <Text style={styles.value}>{getTranslatedTestStatus(result?.status, t) || '-'}</Text>
                <Text style={styles.label}>{t('test_qr_data_colon')}</Text>
                <View style={styles.qrRow}>
                    <Text
                        style={styles.qrValue}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {result?.qr_data || '-'}
                    </Text>
                    <TouchableOpacity style={styles.copyButton} onPress={handleCopyQrData}>
                        <RenderIcon
                            family="materialIcons"
                            icon={copied ? 'check' : 'content-copy'}
                            fontSize={18}
                            color={themeColors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {result?.status !== 'closed' && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('upload_image')}</Text>
                    <View style={styles.imageButtonsWrapper}>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handlePickFromGallery}
                            activeOpacity={0.85}
                        >
                            <RenderIcon
                                family="materialIcons"
                                icon="photo-library"
                                fontSize={20}
                                color={themeColors.white}
                            />
                            <Text style={styles.uploadButtonText}>
                                {t('pick_from_gallery')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={goToScan}
                            activeOpacity={0.85}
                        >
                            <RenderIcon
                                family="entypo"
                                icon="camera"
                                fontSize={20}
                                color={themeColors.primary}
                            />
                            <Text style={styles.scanButtonText}>
                                {t('launch_scanner')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {image && (
                        <>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                                <TouchableOpacity
                                    style={styles.deleteImageButton}
                                    onPress={() => setImage(null)}
                                    activeOpacity={0.7}
                                >
                                    <RenderIcon
                                        family="materialIcons"
                                        icon="delete"
                                        fontSize={22}
                                        color={themeColors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={[styles.uploadButton, uploading && { backgroundColor: themeColors.themeGray }]}
                                onPress={uploadImage}
                                disabled={uploading}
                            >
                                <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <ScanInstructionsModal
                        isOpen={showScanModal}
                        onClose={handleScanModalClose}
                        onConfirm={handleScanModalConfirm}
                        scanType="upload-test-strip"
                        onDismiss={handleScanModalDismiss}
                    />
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('detailed_result')}</Text>
                {loading ? (
                    <ActivityIndicator size="small" color={themeColors.primary} />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : result ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>{t('infection_detected_colon')}: <Text style={styles.resultValue}>{
                            result.infection_detected ? result.infection_detected ? t('yes') : t('no') : '-'
                        }</Text></Text>
                        <View style={styles.speciesRow}>
                            <Text style={styles.resultLabel}>{t('species_colon')}: <Text style={styles.resultValue}>{getSpeciesDisplayName(result.species) || '-'}</Text></Text>
                            {result.species && result.species !== 'Sterile' && (
                                <TouchableOpacity
                                    style={styles.infoButton}
                                    onPress={() => navigateToBacteriaDiscoverPage(navigation, result.species)}
                                    activeOpacity={0.7}
                                >
                                    <RenderIcon
                                        family="ionIcons"
                                        icon="information-circle"
                                        fontSize={20}
                                        color={themeColors.primary}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.resultLabel}>{t('concentration_colon')}: <Text style={styles.resultValue}>{
                            result.concentration ? `${result.concentration} CFU/mL` : '-'
                        }</Text></Text>
                        <Text style={styles.resultLabel}>{t('test_completed_at_colon')}: <Text style={styles.resultValue}>{test.closed_at ? formatDateTimeGerman(test.closed_at) : '-'}</Text></Text>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>{t('no_results_available_for_this_test_yet')}</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ViewTest;
