import React from 'react';
import { render } from '@testing-library/react-native';
import { LandingScreen } from './LandingScreen';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Unit Tests for LandingScreen', () => {
    it('shows the header BugSense', () => {
        const { getByText } = render(<LandingScreen />);
        expect(getByText('bugsense')).toBeTruthy();
    });
});
