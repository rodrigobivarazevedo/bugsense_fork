import {
    FC,
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';
import { AppState } from 'react-native';

interface NotificationContextProps {
    hasNotifications: boolean;
    loading: boolean;
    refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>({
    hasNotifications: false,
    loading: false,
    refetch: async () => { },
});

export const NotificationProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasNotifications, setHasNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setHasNotifications(false);
                setLoading(false);
                return;
            }
            const response = await Api.get('qr-codes/list/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const readyTests = response.data.filter((test: any) => test.result_status === 'ready');
            setHasNotifications(readyTests.length > 0);
        } catch (error) {
            setHasNotifications(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Polling: refetch every minute
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);
        return () => clearInterval(interval);
    }, [refetch]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                refetch();
            }
        });
        return () => subscription.remove();
    }, [refetch]);

    return (
        <NotificationContext.Provider value={{ hasNotifications, loading, refetch }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext);
