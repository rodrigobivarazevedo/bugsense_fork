import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';

export const useNotifications = () => {
    const [hasNotifications, setHasNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setHasNotifications(false);
                setLoading(false);
                return;
            }

            const response = await Api.get('qr-codes/list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const readyTests = response.data.filter((test: any) =>
                test.result_status === 'ready'
            );

            setHasNotifications(readyTests.length > 0);
        } catch (error) {
            console.error('Error checking notifications:', error);
            setHasNotifications(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkNotifications();
    }, []);

    return { hasNotifications, loading, refetch: checkNotifications };
};
