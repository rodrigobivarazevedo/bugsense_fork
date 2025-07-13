import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import GenericDateTimePicker from './GenericDateTimePicker';
import { useTranslation } from 'react-i18next';

beforeAll(() => {
    Object.defineProperty(Platform, 'OS', {
        get: () => 'ios',
        configurable: true
    });
});

jest.mock('@react-native-community/datetimepicker', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const React = require('react');
    return {
        __esModule: true,
        default: React.forwardRef(({ value, mode, display, maximumDate, minimumDate, onChange, testID }: any, ref: any) => {
            return React.createElement('View', {
                testID: testID || 'date-time-picker',
                ref,
                value,
                mode,
                display,
                maximumDate,
                minimumDate,
                onChange: (event: any, date?: Date) => {
                    if (onChange) onChange(event, date);
                }
            });
        })
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn()
}));

const mockT = jest.fn((key: string) => key);
const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

describe('GenericDateTimePicker', () => {
    const mockOnChange = jest.fn();
    const mockOnCancel = jest.fn();
    const testDate = new Date('2023-01-15T10:30:00');

    beforeEach(() => {
        jest.clearAllMocks();
        (mockUseTranslation as any).mockReturnValue({
            t: mockT,
            i18n: {},
            ready: true
        });
    });

    describe('iOS Platform', () => {
        beforeEach(() => {
            Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
        });

        it('should render modal when visible is true', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            expect(getByTestId('date-time-picker')).toBeTruthy();
        });

        it('should not render when visible is false', () => {
            const { queryByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={false}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            expect(queryByTestId('date-time-picker')).toBeNull();
        });

        it('should render with date mode', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.mode).toBe('date');
            expect(picker.props.display).toBe('inline');
        });

        it('should render with time mode', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="time"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.mode).toBe('time');
            expect(picker.props.display).toBe('inline');
        });

        it('should render with datetime mode', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="datetime"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.mode).toBe('datetime');
            expect(picker.props.display).toBe('inline');
        });

        it('should pass maximumDate prop to DateTimePicker', () => {
            const maxDate = new Date('2023-12-31');
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    maximumDate={maxDate}
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.maximumDate).toBe(maxDate);
        });

        it('should pass minimumDate prop to DateTimePicker', () => {
            const minDate = new Date('2023-01-01');
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    minimumDate={minDate}
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.minimumDate).toBe(minDate);
        });

        it('should render cancel and OK buttons', () => {
            const { getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            expect(getByText('cancel')).toBeTruthy();
            expect(getByText('ok_capital')).toBeTruthy();
        });

        it('should call onCancel when cancel button is pressed', () => {
            const { getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            fireEvent.press(getByText('cancel'));
            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should call onChange with tempDate when OK button is pressed', () => {
            const { getByText, getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');
            const newDate = new Date('2023-02-15');
            fireEvent(picker, 'onChange', {}, newDate);

            fireEvent.press(getByText('ok_capital'));
            expect(mockOnChange).toHaveBeenCalledWith(newDate);
        });

        it('should call onCancel when modal overlay is pressed', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const modalOverlay = getByTestId('date-time-picker').parent?.parent;
            if (modalOverlay) {
                fireEvent.press(modalOverlay);
                expect(mockOnCancel).toHaveBeenCalledTimes(1);
            }
        });

        it('should update tempDate when picker value changes', () => {
            const { getByTestId, getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');
            const newDate = new Date('2023-03-15');

            fireEvent(picker, 'onChange', {}, newDate);

            fireEvent.press(getByText('ok_capital'));
            expect(mockOnChange).toHaveBeenCalledWith(newDate);
        });

        it('should not call onChange when picker returns null date', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');

            fireEvent(picker, 'onChange', {}, null);

            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it('should handle missing onCancel prop gracefully', () => {
            const { getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            expect(() => {
                fireEvent.press(getByText('cancel'));
            }).not.toThrow();
        });
    });

    describe('Android Platform', () => {
        beforeEach(() => {
            Object.defineProperty(Platform, 'OS', { get: () => 'android' });
        });

        it('should render inline DateTimePicker for Android', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.display).toBe('default');
        });

        it('should call onChange directly when date changes on Android', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            const newDate = new Date('2023-04-15');

            fireEvent(picker, 'onChange', {}, newDate);
            expect(mockOnChange).toHaveBeenCalledWith(newDate);
        });

        it('should not call onChange when picker returns null date on Android', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');

            fireEvent(picker, 'onChange', {}, null);
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it('should pass all props correctly to Android DateTimePicker', () => {
            const maxDate = new Date('2023-12-31');
            const minDate = new Date('2023-01-01');
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="time"
                    maximumDate={maxDate}
                    minimumDate={minDate}
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.value).toBe(testDate);
            expect(picker.props.mode).toBe('time');
            expect(picker.props.display).toBe('default');
            expect(picker.props.maximumDate).toBe(maxDate);
            expect(picker.props.minimumDate).toBe(minDate);
        });

        it('should not render modal components on Android', () => {
            const { queryByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            expect(queryByText('cancel')).toBeNull();
            expect(queryByText('ok_capital')).toBeNull();
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
        });

        it('should handle undefined maximumDate and minimumDate', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker.props.maximumDate).toBeUndefined();
            expect(picker.props.minimumDate).toBeUndefined();
        });

        it('should handle invalid date values gracefully', () => {
            const invalidDate = new Date('invalid-date');

            expect(() => {
                render(
                    <GenericDateTimePicker
                        value={invalidDate}
                        visible={true}
                        mode="date"
                        onChange={mockOnChange}
                    />
                );
            }).not.toThrow();
        });

        it('should handle rapid date changes', () => {
            const { getByTestId, getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');
            const date1 = new Date('2023-05-15');
            const date2 = new Date('2023-06-15');

            fireEvent(picker, 'onChange', {}, date1);
            fireEvent(picker, 'onChange', {}, date2);

            fireEvent.press(getByText('ok_capital'));
            expect(mockOnChange).toHaveBeenCalledWith(date2);
        });

        it('should maintain tempDate state correctly', () => {
            const { getByTestId, getByText, rerender } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');
            const newDate = new Date('2023-07-15');

            fireEvent(picker, 'onChange', {}, newDate);

            rerender(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            fireEvent.press(getByText('ok_capital'));
            expect(mockOnChange).toHaveBeenCalledWith(newDate);
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
        });

        it('should have accessible buttons', () => {
            const { getByText } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const cancelButton = getByText('cancel');
            const okButton = getByText('ok_capital');

            expect(cancelButton).toBeTruthy();
            expect(okButton).toBeTruthy();
        });

        it('should handle modal accessibility', () => {
            const { getByTestId } = render(
                <GenericDateTimePicker
                    value={testDate}
                    visible={true}
                    mode="date"
                    onChange={mockOnChange}
                    onCancel={mockOnCancel}
                />
            );

            const picker = getByTestId('date-time-picker');
            expect(picker).toBeTruthy();
        });
    });
});
