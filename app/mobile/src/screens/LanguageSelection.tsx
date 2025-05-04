import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './LanguageSelection.styles';
import i18n from '../translations/i18n';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
];

export const LanguageSelection = () => {
    const { t } = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('select_language')}</Text>
            {languages.map((language) => (
                <TouchableOpacity
                    key={language.code}
                    style={[
                        styles.languageButton,
                        currentLanguage === language.code && styles.languageButtonActive,
                    ]}
                    onPress={() => changeLanguage(language.code)}
                >
                    <Text style={styles.languageText}>{language.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default LanguageSelection;
