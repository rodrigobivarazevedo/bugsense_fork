import i18n from './i18n';

describe('i18n translations', () => {
    beforeEach(() => {
        i18n.changeLanguage('en');
    });

    it('should translate TEST_FRONTEND key correctly in English', () => {
        const translation = i18n.t('TEST_FRONTEND');
        expect(translation).toBe('This is a test for the Frontend-EN translation (DO NOT REMOVE!)');
    });

    it('should change language to German and translate TEST_FRONTEND key correctly', async () => {
        await i18n.changeLanguage('de');

        const translation = i18n.t('TEST_FRONTEND');
        expect(translation).toBe('Dies ist ein Test für die Frontend-DE-Übersetzung (NICHT ENTFERNEN!)');
    });
});
