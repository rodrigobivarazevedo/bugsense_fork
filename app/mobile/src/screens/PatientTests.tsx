import { FC, useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    SectionList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { styles } from './Tests.styles';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { formatDate, formatTime } from '../utils/DateTimeFormatter';
import { useTranslation } from 'react-i18next';

function groupByDate(results: any[]) {
    const groups: { [date: string]: any[] } = {};
    results.forEach(item => {
        const date = item.created_at.split('T')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
    });
    return Object.entries(groups).map(([date, data]) => ({ date, data }));
}

const PatientTests: FC = () => {
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    // @ts-ignore
    const { patientId } = route.params || {};

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');

    useEffect(() => {
        AsyncStorage.getItem('timeFormat').then(format => {
            if (format === '24' || format === '12') {
                setTimeFormat(format);
            }
        });
    }, [isFocused]);

    useFocusEffect(
        useCallback(() => {
            const fetchResults = async () => {
                if (!patientId) return;
                setLoading(true);
                setError(null);
                try {
                    const token = await AsyncStorage.getItem('token');
                    const response = await Api.get(`results/list/?user_id=${patientId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setResults(response.data);
                } catch (err: any) {
                    setError(t('failed_to_load_patient_test_results'));
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }, [isFocused, patientId])
    );

    const grouped = groupByDate(results);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (results.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.noTestsContainer}>
                    <Text style={styles.noTestsText}>{t('no_tests_available_for_this_patient')}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SectionList
                contentContainerStyle={styles.contentContainer}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={true}
                sections={grouped.map(section => ({
                    title: formatDate(section.date, 'long', false, true),
                    data: section.data,
                }))}
                keyExtractor={item => item.id.toString()}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeaderSticky}>
                        <Text style={styles.sectionHeader}>
                            {title}
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ViewTest', { test: item })} activeOpacity={0.7}>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemTime}>{formatTime(item.created_at, timeFormat)}</Text>
                            <View style={styles.listItemStatusContainer}>
                                <View
                                    style={[
                                        styles.statusIndicator,
                                        item.status === 'ongoing' || item.status === 'preliminary_assessment'
                                            ? styles.statusIndicatorYellow
                                            : styles.statusIndicatorGreen,
                                    ]}
                                />
                                <Text style={styles.listItemStatus}>{getTranslatedTestStatus(item.status, t)}</Text>
                            </View>
                            {item.infection_detected !== undefined && (
                                <Text style={styles.listItemValue}>
                                    {t('infection_colon')}: {item.infection_detected ? t('yes') : t('no')}
                                </Text>
                            )}
                            {item.species && (
                                <Text style={styles.listItemValue}>
                                    {t('species_colon')}: {item.species}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default PatientTests; 