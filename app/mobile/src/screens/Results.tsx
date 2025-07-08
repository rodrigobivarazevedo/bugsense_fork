import { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    SectionList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { styles } from './Results.styles';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import RenderIcon from '../components/RenderIcon';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'long', day: '2-digit' });
}

function formatTime(dateStr: string, timeFormat: '12' | '24') {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12',
    });
}

function groupByDate(results: any[]) {
    const groups: { [date: string]: any[] } = {};
    results.forEach(item => {
        const date = item.created_at.split('T')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
    });
    return Object.entries(groups).map(([date, data]) => ({ date, data }));
}

export const Results: FC = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await Api.get('qr-codes/list/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResults(response.data);
            } catch (err: any) {
                setError('Failed to load results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

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

    return (
        <View style={styles.container}>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Scan')}
                    activeOpacity={0.8}
                >
                    <View style={styles.addButtonIcon}>
                        <RenderIcon
                            family="materialIcons"
                            icon="add"
                            fontSize={styles.addButtonIcon.fontSize}
                            color={styles.addButtonIcon.color}
                        />
                    </View>
                    <Text style={styles.addButtonText}>Add new</Text>
                </TouchableOpacity>
            </View>
            <SectionList
                contentContainerStyle={styles.contentContainer}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={true}
                sections={grouped.map(section => ({
                    title: formatDate(section.date),
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
                                        item.result_status === 'ongoing' || item.result_status === 'preliminary_assessment'
                                            ? styles.statusIndicatorYellow
                                            : styles.statusIndicatorGreen,
                                    ]}
                                />
                                <Text style={styles.listItemStatus}>{getTranslatedTestStatus(item.result_status)}</Text>
                            </View>
                            {userType === 'doctor' && item.patient && (
                                <View style={styles.listItemPatient}>
                                    <Text style={styles.listItemLabel}>Patient Name:</Text>
                                    <Text style={styles.listItemValue}>{item.patient.full_name || '-'}</Text>
                                    <Text style={styles.listItemLabel}>ID:</Text>
                                    <Text style={styles.listItemValue}>{item.patient.id || '-'}</Text>
                                    <Text style={styles.listItemLabel}>DOB:</Text>
                                    <Text style={styles.listItemValue}>{item.patient.dob || '-'}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Results;
