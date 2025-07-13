import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import de from './de.json';
import bacteriaDiscoverEn from './bacteria_discover_en.json';
import bacteriaDiscoverDe from './bacteria_discover_de.json';

const LANGUAGE_KEY = '@language';

const getStoredLanguage = async (): Promise<string> => {
    try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        return storedLanguage || 'en';
    } catch (error) {
        console.error('Error getting stored language:', error);
        return 'en';
    }
};

const storeLanguage = async (language: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
        console.error('Error storing language:', error);
    }
};

const initializeI18n = async () => {
    const storedLanguage = await getStoredLanguage();

    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v4',
            lng: storedLanguage,
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: en,
                    bacteria_discover: bacteriaDiscoverEn
                },
                de: {
                    translation: de,
                    bacteria_discover: bacteriaDiscoverDe
                },
            },
            ns: ['translation', 'bacteria_discover'],
            defaultNS: 'translation',
            interpolation: {
                escapeValue: false,
            },
        });

    const originalChangeLanguage = i18n.changeLanguage;
    i18n.changeLanguage = async (language: string) => {
        await storeLanguage(language);
        return originalChangeLanguage.call(i18n, language);
    };
};

initializeI18n();

export default i18n;
