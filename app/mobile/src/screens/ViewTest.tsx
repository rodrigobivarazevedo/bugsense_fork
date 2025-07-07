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

const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Test Details</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{result?.created_at ? formatDateTime(result.created_at) : '-'}</Text>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{result?.status || '-'}</Text>
                <Text style={styles.label}>QR Data:</Text>
                <Text style={styles.value}>{result?.qr_data || '-'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Image</Text>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImage}
                    activeOpacity={0.8}
                >
                    <Text style={styles.uploadButtonText}>Pick Image from Gallery</Text>
                </TouchableOpacity>
                {image && (
                    <>
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={uploadImage}
                            disabled={uploading}
                        >
                            <Text style={styles.uploadButtonText}>
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Results</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#888" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : result ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>Species: <Text style={styles.resultValue}>{result.species || '-'}</Text></Text>
                        <Text style={styles.resultLabel}>Concentration: <Text style={styles.resultValue}>{result.concentration || '-'}</Text></Text>
                        <Text style={styles.resultLabel}>Infection Detected: <Text style={styles.resultValue}>{result.infection_detected ? 'Yes' : 'No'}</Text></Text>
                        <Text style={styles.resultLabel}>Status: <Text style={styles.resultValue}>{result.status || '-'}</Text></Text>
                        <Text style={styles.resultLabel}>Created At: <Text style={styles.resultValue}>{result.created_at ? formatDateTime(result.created_at) : '-'}</Text></Text>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>No results available for this test yet.</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ViewTest;
