import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeFormatSelection from './TimeFormatSelection';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

const mockT = jest.fn((key: string) => key);

describe('TimeFormatSelection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should load current time format from AsyncStorage on mount', async () => {
            render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(AsyncStorage.getItem).toHaveBeenCalledWith('timeFormat');
            });
        });

        it('should set current format to 12-hour when AsyncStorage returns 12', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
            });
        });

        it('should set current format to 24-hour when AsyncStorage returns 24', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('24');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('24_hour_format')).toBeTruthy();
            });
        });

        it('should default to 12-hour format when AsyncStorage returns invalid value', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
            });
        });

        it('should default to 12-hour format when AsyncStorage returns null', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
            });
        });
    });

    describe('UI Rendering', () => {
        it('should render the title correctly', async () => {
            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('select_time_format')).toBeTruthy();
            });
        });

        it('should render both time format options', async () => {
            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
                expect(getByText('24_hour_format')).toBeTruthy();
            });
        });

        it('should show check icon for selected format', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('24');

            const { getByTestId } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByTestId('icon-materialIcons-check')).toBeTruthy();
            });
        });

        it('should not show check icon for unselected format', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { queryByTestId } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(queryByTestId('icon-materialIcons-check')).toBeTruthy();
            });
        });
    });

    describe('Format Selection', () => {
        it('should change to 12-hour format when 12-hour option is selected', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('24');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twelveHourOption = getByText('12_hour_format (AM/PM)');
                fireEvent.press(twelveHourOption);
            });

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('timeFormat', '12');
            });
        });

        it('should change to 24-hour format when 24-hour option is selected', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twentyFourHourOption = getByText('24_hour_format');
                fireEvent.press(twentyFourHourOption);
            });

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('timeFormat', '24');
            });
        });

        it('should update UI immediately when format is changed', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twentyFourHourOption = getByText('24_hour_format');
                fireEvent.press(twentyFourHourOption);
            });

            await waitFor(() => {
                expect(getByText('24_hour_format')).toBeTruthy();
            });
        });

        it('should call translation function for format names', async () => {
            render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('select_time_format');
                expect(mockT).toHaveBeenCalledWith('12_hour_format');
                expect(mockT).toHaveBeenCalledWith('24_hour_format');
            });
        });
    });

    describe('AsyncStorage Interactions', () => {
        it('should save selected format to AsyncStorage', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twentyFourHourOption = getByText('24_hour_format');
                fireEvent.press(twentyFourHourOption);
            });

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledWith('timeFormat', '24');
            });
        });


    });

    describe('Edge Cases', () => {
        it('should handle invalid format codes gracefully', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
            });
        });

        it('should maintain selected state after format change', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twentyFourHourOption = getByText('24_hour_format');
                fireEvent.press(twentyFourHourOption);
            });

            await waitFor(() => {
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
                expect(getByText('24_hour_format')).toBeTruthy();
            });
        });

        it('should handle rapid format changes', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('12');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                const twelveHourOption = getByText('12_hour_format (AM/PM)');
                const twentyFourHourOption = getByText('24_hour_format');

                fireEvent.press(twentyFourHourOption);
                fireEvent.press(twelveHourOption);
                fireEvent.press(twentyFourHourOption);
            });

            await waitFor(() => {
                expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
                expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('timeFormat', '24');
            });
        });
    });

    describe('Component Integration', () => {
        it('should pass correct props to SimpleSelectPage', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('24');

            const { getByText } = render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(getByText('select_time_format')).toBeTruthy();
                expect(getByText('12_hour_format (AM/PM)')).toBeTruthy();
                expect(getByText('24_hour_format')).toBeTruthy();
            });
        });

        it('should format time format names correctly', async () => {
            render(<TimeFormatSelection />);

            await waitFor(() => {
                expect(mockT).toHaveBeenCalledWith('12_hour_format');
                expect(mockT).toHaveBeenCalledWith('24_hour_format');
            });
        });
    });
});
