import { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ViewPatient.styles';
import RenderIcon from '../components/RenderIcon';
import { themeColors } from '../theme/GlobalTheme';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { useTranslation } from 'react-i18next';
import { formatDateTimeGerman } from '../utils/DateTimeFormatter';
import { navigateToBacteriaDiscoverPage, getSpeciesDisplayName } from '../utils/BacteriaSpeciesUtils';

interface Patient {
    id: number;
    email: string;
    full_name: string;
    gender: string;
    dob: string | null;
    phone_number: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    date_joined: string;
}

interface TestResult {
    id: number;
    user: number;
    qr_code: number;
    qr_data: string;
    status: string;
    infection_detected?: boolean;
    species?: string;
    concentration?: string;
    created_at: string;
}

const ViewPatient: FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    // @ts-ignore
    const { patientId } = route.params || {};

    const [patient, setPatient] = useState<Patient | null>(null);
    const [recentTest, setRecentTest] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingTest, setLoadingTest] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!patientId) return;
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await Api.get(`doctor/patients/?patient_id=${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.length > 0) {
                    setPatient(response.data[0]);
                } else {
                    setError(t('patient_not_found'));
                }
            } catch (err) {
                setError(t('failed_to_load_patient_details'));
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [patientId]);

    useEffect(() => {
        const fetchRecentTest = async () => {
            if (!patientId) return;
            setLoadingTest(true);
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await Api.get(`results/list/?user_id=${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.length > 0) {
                    // Get the most recent test (first in the list since they're ordered by created_at desc)
                    setRecentTest(response.data[0]);
                }
            } catch (err) {
                console.error('Failed to load recent test:', err);
            } finally {
                setLoadingTest(false);
            }
        };
        fetchRecentTest();
    }, [patientId]);

    const handleViewAllTests = () => {
        // @ts-ignore
        navigation.navigate('PatientTests', { patientId, patientName: patient?.full_name });
    };

    const handleTestPress = (test: TestResult) => {
        // @ts-ignore
        navigation.navigate('ViewTest', { test });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (!patient) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{t('patient_not_found')}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Patient Details Section */}
            <View style={styles.section}>
                <Text style={styles.label}>{t('full_name')}:</Text>
                <Text style={styles.value}>{patient.full_name}</Text>
                <Text style={styles.label}>{t('email')}:</Text>
                <Text style={styles.value}>{patient.email}</Text>
                <Text style={styles.label}>{t('gender')}:</Text>
                <Text style={styles.value}>{patient.gender || '-'}</Text>
                <Text style={styles.label}>{t('date_of_birth')}:</Text>
                <Text style={styles.value}>{patient.dob || '-'}</Text>
                <Text style={styles.label}>{t('phone_number')}:</Text>
                <Text style={styles.value}>{patient.phone_number || '-'}</Text>
                <Text style={styles.label}>{t('address')}:</Text>
                <View style={styles.patientInfoRow}>
                    <Text style={styles.patientInfoValue}>
                        {patient.street ? `${patient.street}, ` : ''}
                        {patient.city ? `${patient.city}, ` : ''}
                        {patient.postcode ? `${patient.postcode}, ` : ''}
                        {patient.country || '-'}
                    </Text>
                </View>
            </View>

            {/* Most Recent Test Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('most_recent_test')}</Text>
                {loadingTest ? (
                    <ActivityIndicator size="small" color={themeColors.primary} />
                ) : recentTest ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>Test Status: <Text style={styles.resultValue}>{getTranslatedTestStatus(recentTest.status, t)}</Text></Text>
                        <Text style={styles.resultLabel}>Test Started At: <Text style={styles.resultValue}>{formatDateTimeGerman(recentTest.created_at)}</Text></Text>
                        {recentTest.infection_detected !== undefined && (
                            <Text style={styles.resultLabel}>Infection Detected: <Text style={styles.resultValue}>{recentTest.infection_detected ? t('yes') : t('no')}</Text></Text>
                        )}
                        {recentTest.species && (
                            <View style={styles.speciesRow}>
                                <Text style={styles.resultLabel}>Species: <Text style={styles.resultValue}>{getSpeciesDisplayName(recentTest.species)}</Text></Text>
                                {recentTest.species !== 'Sterile' && (
                                    <TouchableOpacity
                                        style={styles.infoButton}
                                        onPress={() => navigateToBacteriaDiscoverPage(navigation, recentTest.species!)}
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
                        )}
                        {recentTest.concentration && (
                            <Text style={styles.resultLabel}>Concentration: <Text style={styles.resultValue}>{recentTest.concentration}</Text></Text>
                        )}
                    </View>
                ) : (
                    <Text style={styles.noTestsMessage}>{t('patient_has_no_previous_tests')}</Text>
                )}
            </View>

            {/* View All Tests Button Section */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.viewAllTestsButton}
                    onPress={handleViewAllTests}
                    activeOpacity={0.85}
                >
                    <RenderIcon
                        family="materialIcons"
                        icon="list"
                        fontSize={20}
                        color={themeColors.white}
                    />
                    <Text style={styles.viewAllTestsButtonText}>
                        {t('view_all_tests')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ViewPatient;
