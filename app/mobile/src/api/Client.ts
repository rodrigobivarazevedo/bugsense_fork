import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL;

const Api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// TODO: Remove console logs after testing in development

Api.interceptors.request.use(async (config: any) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', JSON.stringify({
        method: config.method.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        headers: {
            ...config.headers,
            Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : undefined
        }
    }, null, 2));

    return config;
});

Api.interceptors.response.use(
    (response) => {
        console.log('API Response:', JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        }, null, 2));
        return response;
    },
    async (error) => {
        if (error.response) {
            console.error('API Error Response:', JSON.stringify({
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            }, null, 2));
        } else if (error.request) {
            console.error('API Error Request:', JSON.stringify(error.request, null, 2));
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default Api;
