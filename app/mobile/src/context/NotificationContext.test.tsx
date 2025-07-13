import React from 'react';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';
import { NotificationProvider, useNotificationContext } from './NotificationContext';
import { suppressConsoleError, resumeConsoleError } from '../utils/UnitTestUtils';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../api/Client');
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {
            extra: {
                API_URL: 'http://test-api.com',
            },
        },
    },
}));
jest.mock('react-native', () => ({
    AppState: {
        addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
}));

describe('NotificationContext', () => {
    beforeAll(() => {
        suppressConsoleError();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-token');
        (Api.get as jest.Mock).mockResolvedValue({ data: [] });
    });

    afterAll(() => {
        resumeConsoleError();
    });

    it('should provide notification context with correct values', () => {
        const TestComponent = () => {
            useNotificationContext();
            return null;
        };

        expect(() => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );
        }).not.toThrow();
    });
});
