import i18n from './i18n';

describe('i18n translations', () => {
    beforeEach(() => {
        i18n.changeLanguage('en');
    });

    it('should translate TEST_MOBILE key correctly in English', () => {
        const translation = i18n.t('TEST_MOBILE');
        expect(translation).toBe('This is a test for the Mobile-EN translation (DO NOT REMOVE!)');
    });

    it('should change language to German and translate TEST_MOBILE key correctly', async () => {
        await i18n.changeLanguage('de');

        const translation = i18n.t('TEST_MOBILE');
        expect(translation).toBe('Dies ist ein Test für die Mobile-DE-Übersetzung (NICHT ENTFERNEN!)');
    });
});
