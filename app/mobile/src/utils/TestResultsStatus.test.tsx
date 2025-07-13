import { getTranslatedTestStatus } from './TestResultsStatus';

describe('TestResultsStatus', () => {
    const mockT = jest.fn((key: string) => key);

    it('should translate known statuses', () => {
        expect(getTranslatedTestStatus('completed', mockT)).toBe('test_status_completed');
        expect(getTranslatedTestStatus('ongoing', mockT)).toBe('test_status_ongoing');
        expect(getTranslatedTestStatus('closed', mockT)).toBe('test_status_closed');
    });

    it('should return original status for unknown statuses', () => {
        expect(getTranslatedTestStatus('unknown_status', mockT)).toBe('unknown_status');
    });
}); 