import {
    formatDateTimeGerman,
    formatDate,
    formatTime,
    getTimeBasedGreeting
} from './DateTimeFormatter';

jest.mock('../translations/i18n', () => ({
    language: 'en'
}));

describe('DateTimeFormatter', () => {
    it('should format date in German format', () => {
        const result = formatDateTimeGerman('2024-01-15T10:30:00Z');
        expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/);
    });

    it('should return dash for empty date', () => {
        expect(formatDateTimeGerman('')).toBe('-');
        expect(formatDateTimeGerman(null as any)).toBe('-');
    });

    it('should format date with different options', () => {
        const result = formatDate('2024-01-15T10:30:00Z', 'long', true, false);
        expect(result).toMatch(/January 15, 2024/);
    });

    it('should format time in 12-hour format', () => {
        const result = formatTime('2024-01-15T14:30:00Z', '12');
        expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/);
    });

    it('should return time-based greeting', () => {
        const greeting = getTimeBasedGreeting();
        expect(['good_morning', 'good_afternoon', 'good_evening']).toContain(greeting);
    });
}); 