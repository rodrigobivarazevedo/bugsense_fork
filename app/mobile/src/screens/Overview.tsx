import React, { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Overview.styles';
import Api from '../api/Client';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { formatDate, formatTime } from '../utils/DateTimeFormatter';
import { themeColors } from '../theme/GlobalTheme';

interface TestItem {
    id: number;
    qr_data: string;
    created_at: string;
    result_status: string;
    patient?: {
        id: number;
        full_name: string;
        email: string;
        dob?: string;
    };
}

export const Overview: FC = () => {
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const [ongoingTests, setOngoingTests] = useState<TestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<string>('patient');
    const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');

    useEffect(() => {
        AsyncStorage.getItem('userType').then(type => {
            if (type && typeof type === 'string') {
                setUserType(type);
            }
        });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('timeFormat').then(format => {
            if (format === '24' || format === '12') {
                setTimeFormat(format);
            }
        });
    }, [isFocused]);

    const fetchOngoingTests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await Api.get('qr-codes/list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const ongoing = response.data.filter((test: TestItem) =>
                ['ongoing', 'preliminary_assessment', 'ready'].includes(test.result_status)
            );

            setOngoingTests(ongoing);
            setError(null);
        } catch (err: any) {
            setError(t('failed_to_load_results'));
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchOngoingTests().finally(() => setLoading(false));
        }
    }, [isFocused]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOngoingTests();
        setRefreshing(false);
    };

    const handleTestPress = (test: TestItem) => {
        navigation.navigate('ViewTest', { test });
    };

    const getStatusIndicatorStyle = (status: string) => {
        switch (status) {
            case 'ongoing':
                return styles.statusIndicatorOngoing;
            case 'preliminary_assessment':
                return styles.statusIndicatorPreliminary;
            case 'ready':
                return styles.statusIndicatorReady;
            default:
                return styles.statusIndicatorOngoing;
        }
    };

    const renderTestCard = (test: TestItem) => (
        <TouchableOpacity
            key={test.id}
            style={styles.testCard}
            onPress={() => handleTestPress(test)}
            activeOpacity={0.7}
        >
            <View style={styles.testCardHeader}>
                <Text style={styles.testCardTitle}>
                    {userType === 'doctor' ? t('test') : t('test')} #{test.id}
                </Text>
                <View style={styles.testCardTimeContainer}>
                    <Text style={styles.testCardDate}>
                        {formatDate(test.created_at, 'short', true)}
                    </Text>
                    <Text style={styles.testCardTime}>
                        {formatTime(test.created_at, timeFormat)}
                    </Text>
                </View>
            </View>

            <View style={styles.testCardStatus}>
                <View style={[styles.statusIndicator, getStatusIndicatorStyle(test.result_status)]} />
                <Text style={styles.statusText}>
                    {getTranslatedTestStatus(test.result_status, t)}
                </Text>
            </View>

            {userType === 'doctor' && test.patient && (
                <View style={styles.patientInfo}>
                    <View style={styles.patientInfoRow}>
                        <Text style={styles.patientInfoLabel}>{t('patient_name_colon')}</Text>
                        <Text style={styles.patientInfoValue}>{test.patient.full_name}</Text>
                    </View>
                    <View style={styles.patientInfoRow}>
                        <Text style={styles.patientInfoLabel}>{t('id_colon')}</Text>
                        <Text style={styles.patientInfoValue}>{test.patient.id}</Text>
                    </View>
                    <View style={styles.patientInfoRow}>
                        <Text style={styles.patientInfoLabel}>{t('dob_colon')}</Text>
                        <Text style={styles.patientInfoValue}>
                            {test.patient.dob || t('dob_not_available')}
                        </Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderNoTests = () => (
        <View style={styles.noTestsContainer}>
            <Text style={styles.noTestsIcon}>🔬</Text>
            <Text style={styles.noTestsTitle}>
                {userType === 'doctor'
                    ? t('no_ongoing_tests_for_patients')
                    : t('no_ongoing_tests')
                }
            </Text>
            <Text style={styles.noTestsText}>
                {userType === 'doctor'
                    ? t('no_ongoing_tests_for_patients_description')
                    : t('no_ongoing_tests_description')
                }
            </Text>
        </View>
    );

    const renderError = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchOngoingTests}>
                <Text style={styles.retryButtonText}>{t('retry')}</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>
                    {userType === 'doctor'
                        ? t('overview_subtitle_doctor')
                        : t('overview_subtitle_patient')
                    }
                </Text>
            </View>

            <ScrollView
                style={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {error ? (
                    renderError()
                ) : ongoingTests.length > 0 ? (
                    <View style={styles.ongoingTestsSection}>
                        <Text style={styles.sectionTitle}>
                            {userType === 'doctor'
                                ? t('ongoing_tests_for_patients')
                                : t('ongoing_tests')
                            }
                        </Text>
                        {ongoingTests.map(renderTestCard)}
                    </View>
                ) : (
                    renderNoTests()
                )}
            </ScrollView>
        </View>
    );
};

export default Overview;
