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

const formatDateGerman = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const ViewTest: FC = () => {
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
                setError('Failed to load test results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [test?.qr_data]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access media library is required!');
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
            formData.append('test_id', test?.id);
            await Api.post('upload/image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            Alert.alert('Success', 'Image uploaded successfully!');
            setImage(null);
        } catch (err) {
            Alert.alert('Upload failed', 'Could not upload image.');
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Test Started At:</Text>
                <Text style={styles.value}>{formatDateGerman(result?.created_at)}</Text>
                <Text style={styles.label}>Test Status:</Text>
                <Text style={styles.value}>{result?.status || '-'}</Text>
                <Text style={styles.label}>Test QR Data:</Text>
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

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Image</Text>
                <View style={styles.imageButtonsWrapper}>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={pickImage}
                        activeOpacity={0.85}
                    >
                        <RenderIcon
                            family="materialIcons"
                            icon="photo-library"
                            fontSize={20}
                            color={themeColors.white}
                        />
                        <Text style={styles.uploadButtonText}>
                            Pick from Gallery
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
                            Launch Scanner
                        </Text>
                    </TouchableOpacity>
                </View>
                {image && (
                    <>
                        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                        <TouchableOpacity
                            style={[styles.uploadButton, uploading && { backgroundColor: themeColors.themeGray }]}
                            onPress={uploadImage}
                            disabled={uploading}
                        >
                            <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Results</Text>
                {loading ? (
                    <ActivityIndicator size="small" color={themeColors.primary} />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : result ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>Infection Detected: <Text style={styles.resultValue}>{result.infection_detected ? 'Yes' : 'No'}</Text></Text>
                        <Text style={styles.resultLabel}>Species: <Text style={styles.resultValue}>{result.species || '-'}</Text></Text>
                        <Text style={styles.resultLabel}>Concentration: <Text style={styles.resultValue}>{result.concentration || '-'} CFU/mL</Text></Text>
                        <Text style={styles.resultLabel}>Test Completed At: <Text style={styles.resultValue}>{test.closed_at ? formatDateGerman(test.closed_at) : '-'}</Text></Text>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>No results available for this test yet.</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ViewTest;
