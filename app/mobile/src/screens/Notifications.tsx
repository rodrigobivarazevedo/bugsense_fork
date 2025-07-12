import { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { styles } from './Notifications.styles';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { formatDateTimeGerman } from '../utils/DateTimeFormatter';
import { getTranslatedTestStatus } from '../utils/TestResultsStatus';
import { useTranslation } from 'react-i18next';

interface NotificationItem {
    id: number;
    qr_data: string;
    created_at: string;
    result_status: string;
    patient?: {
        full_name: string;
        id: string;
        dob: string;
    };
}

export const Notifications: FC = () => {
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<string>('patient');

    useEffect(() => {
        AsyncStorage.getItem('userType').then(type => {
            if (type && typeof type === 'string') {
                setUserType(type);
            }
        });
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await Api.get('qr-codes/list/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const readyTests = response.data.filter((test: NotificationItem) =>
                    test.result_status === 'ready'
                );

                setNotifications(readyTests);
            } catch (err: any) {
                setError(t('failed_to_load_notifications'));
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [isFocused]);

    const handleNotificationPress = (notification: NotificationItem) => {
        navigation.navigate('ViewTest', { test: notification });
    };

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                        {t('test_result_ready')}
                    </Text>
                    <Text style={styles.notificationTime}>
                        {formatDateTimeGerman(item.created_at)}
                    </Text>
                </View>
                <Text style={styles.notificationMessage}>
                    {t('test_result_ready_message')}
                </Text>
                {userType === 'doctor' && item.patient && (
                    <View style={styles.notificationPatient}>
                        <Text style={styles.notificationPatientText}>
                            {t('patient_colon', { name: item.patient.full_name || 'N/A' })}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#888" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{t('failed_to_load_notifications')}</Text>
                </View>
            </View>
        );
    }

    if (notifications.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.noNotificationsContainer}>
                    <Text style={styles.noNotificationsText}>
                        {t('no_new_notifications')}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
};

export default Notifications;
