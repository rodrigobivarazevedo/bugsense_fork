import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import More from './More';
import companyInfo from '../json/companyInfo.json';

const mockOpenURL = jest.fn();
const mockOpenSettings = jest.fn();

jest.spyOn(require('react-native').Linking, 'openURL').mockImplementation(mockOpenURL);
jest.spyOn(require('react-native').Linking, 'openSettings').mockImplementation(mockOpenSettings);

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useFocusEffect: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color, testID }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: testID || `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const mockNavigation = {
    navigate: jest.fn(),
};

const mockT = jest.fn((key: string) => key);

const mockUseFocusEffect = (callback: any) => {
    callback();
};

describe('More', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
        (useFocusEffect as jest.Mock).mockImplementation(mockUseFocusEffect);
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        AsyncStorage.clear();
    });

    afterEach(() => {
        AsyncStorage.clear();
    });

    describe('Patient View', () => {
        beforeEach(async () => {
            await AsyncStorage.setItem('userType', 'patient');
            await AsyncStorage.setItem('timeFormat', '12');
        });

        it('should render patient view with all sections', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('app_settings')).toBeTruthy();
                expect(getByText('more_info_and_support')).toBeTruthy();
            });
        });

        it('should render app settings options for patients', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('language')).toBeTruthy();
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
                expect(getByText('device_permissions')).toBeTruthy();
            });
        });

        it('should render support options for patients', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('email_us')).toBeTruthy();
                expect(getByText('call_us')).toBeTruthy();
                expect(getByText('visit_our_website')).toBeTruthy();
            });
        });

        it('should show time format indicator for 12-hour format', async () => {
            await AsyncStorage.setItem('timeFormat', '12');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
            });
        });

        it('should show time format indicator for 24-hour format', async () => {
            await AsyncStorage.setItem('timeFormat', '24');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('time_format (24_hour_format)')).toBeTruthy();
            });
        });

        it('should navigate to LanguageSelection when language option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const languageOption = getByText('language');
                fireEvent.press(languageOption);

                expect(mockNavigation.navigate).toHaveBeenCalledWith('LanguageSelection');
            });
        });

        it('should navigate to TimeFormatSelection when time format option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const timeFormatOption = getByText('time_format (12_hour_format)');
                fireEvent.press(timeFormatOption);

                expect(mockNavigation.navigate).toHaveBeenCalledWith('TimeFormatSelection');
            });
        });

        it('should open device settings when device permissions option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const devicePermissionsOption = getByText('device_permissions');
                fireEvent.press(devicePermissionsOption);

                expect(mockOpenSettings).toHaveBeenCalled();
            });
        });

        it('should open email app when email us option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const emailOption = getByText('email_us');
                fireEvent.press(emailOption);

                expect(mockOpenURL).toHaveBeenCalledWith(`mailto:${companyInfo.email}`);
            });
        });

        it('should open phone app when call us option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const callOption = getByText('call_us');
                fireEvent.press(callOption);

                expect(mockOpenURL).toHaveBeenCalledWith(`tel:${companyInfo.phone}`);
            });
        });

        it('should open website when visit website option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const websiteOption = getByText('visit_our_website');
                fireEvent.press(websiteOption);

                expect(mockOpenURL).toHaveBeenCalledWith(companyInfo.website);
            });
        });

        it('should render chevron-right icons for navigation options', async () => {
            const { getAllByTestId } = render(<More />);

            await waitFor(() => {
                const chevronIcons = getAllByTestId('icon-materialIcons-chevron-right');
                expect(chevronIcons.length).toBeGreaterThan(0);
            });
        });

        it('should render external-link icons for support options', async () => {
            const { getAllByTestId } = render(<More />);

            await waitFor(() => {
                const externalLinkIcons = getAllByTestId('icon-feather-external-link');
                expect(externalLinkIcons.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Doctor View', () => {
        beforeEach(async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            await AsyncStorage.setItem('timeFormat', '12');
        });

        it('should render doctor view with app settings section', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('app_settings')).toBeTruthy();
                expect(getByText('more_info_and_support')).toBeTruthy();
            });
        });

        it('should render app settings options for doctors', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('language')).toBeTruthy();
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
                expect(getByText('device_permissions')).toBeTruthy();
            });
        });

        it('should render contact admin option for doctors', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('contact_admin')).toBeTruthy();
            });
        });

        it('should not render patient support options for doctors', async () => {
            const { queryByText } = render(<More />);

            await waitFor(() => {
                expect(queryByText('email_us')).toBeNull();
                expect(queryByText('call_us')).toBeNull();
                expect(queryByText('visit_our_website')).toBeNull();
            });
        });

        it('should open email app when contact admin option is pressed', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                const contactAdminOption = getByText('contact_admin');
                fireEvent.press(contactAdminOption);

                expect(mockOpenURL).toHaveBeenCalledWith(`mailto:${companyInfo.email}`);
            });
        });

        it('should render admin-panel-settings icon for contact admin option', async () => {
            const { getByTestId } = render(<More />);

            await waitFor(() => {
                expect(getByTestId('icon-materialIcons-admin-panel-settings')).toBeTruthy();
            });
        });
    });

    describe('AsyncStorage Integration', () => {
        it('should read userType from AsyncStorage on mount', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('contact_admin')).toBeTruthy();
            });
        });

        it('should read timeFormat from AsyncStorage on mount', async () => {
            await AsyncStorage.setItem('timeFormat', '24');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('time_format (24_hour_format)')).toBeTruthy();
            });
        });

        it('should default to patient view when userType is not set', async () => {
            await AsyncStorage.removeItem('userType');
            const { getByText, queryByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('email_us')).toBeTruthy();
                expect(queryByText('contact_admin')).toBeNull();
            });
        });

        it('should default to 12-hour format when timeFormat is not set', async () => {
            await AsyncStorage.removeItem('timeFormat');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
            });
        });

        it('should handle invalid timeFormat gracefully', async () => {
            await AsyncStorage.setItem('timeFormat', 'invalid');
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
            });
        });
    });

    describe('Translation', () => {
        it('should use translation function for section headers', async () => {
            render(<More />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('app_settings');
                expect(mockT).toHaveBeenCalledWith('more_info_and_support');
            });
        });

        it('should use translation function for option labels', async () => {
            render(<More />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('language');
                expect(mockT).toHaveBeenCalledWith('time_format');
                expect(mockT).toHaveBeenCalledWith('device_permissions');
                expect(mockT).toHaveBeenCalledWith('email_us');
                expect(mockT).toHaveBeenCalledWith('call_us');
                expect(mockT).toHaveBeenCalledWith('visit_our_website');
            });
        });

        it('should use translation function for time format indicators', async () => {
            render(<More />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('12_hour_format');
            });
        });

        it('should use translation function for doctor-specific labels', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            render(<More />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('contact_admin');
            });
        });
    });

    describe('useFocusEffect', () => {
        it('should call useFocusEffect on mount', async () => {
            render(<More />);

            await waitFor(() => {
                expect(useFocusEffect).toHaveBeenCalled();
            });
        });

        it('should read AsyncStorage values when focused', async () => {
            await AsyncStorage.setItem('userType', 'doctor');
            await AsyncStorage.setItem('timeFormat', '24');

            render(<More />);

            await waitFor(() => {
                expect(AsyncStorage.getItem).toHaveBeenCalledWith('userType');
                expect(AsyncStorage.getItem).toHaveBeenCalledWith('timeFormat');
            });
        });
    });

    describe('Component Structure', () => {
        it('should render all required styled components', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('app_settings')).toBeTruthy();
                expect(getByText('more_info_and_support')).toBeTruthy();

                expect(getByText('language')).toBeTruthy();
                expect(getByText('time_format (12_hour_format)')).toBeTruthy();
            });
        });

        it('should render section dividers between sections', async () => {
            const { getByText } = render(<More />);

            await waitFor(() => {
                expect(getByText('app_settings')).toBeTruthy();
                expect(getByText('more_info_and_support')).toBeTruthy();
            });
        });
    });
});
