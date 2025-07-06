import { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Test Details</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{test?.created_at ? formatDateTime(test.created_at) : '-'}</Text>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{test?.status || '-'}</Text>
                <Text style={styles.label}>QR Data:</Text>
                <Text style={styles.value}>{test?.qr_data || '-'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Image</Text>
                <Text style={styles.placeholder}>[Upload field coming soon]</Text>
                {/* @ts-ignore */}
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => navigation.navigate('Scan', { testId: test?.id })}
                    activeOpacity={0.8}
                >
                    <Text style={styles.uploadButtonText}>Upload/Scan Image for this Test</Text>
                </TouchableOpacity>
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
                        <Text style={styles.resultLabel}>Antibiotic: <Text style={styles.resultValue}>{result.antibiotic || '-'}</Text></Text>
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
