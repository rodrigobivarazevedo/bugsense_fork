import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '../translations/i18n';
import { useTranslation } from 'react-i18next';
import RenderIcon from '../components/RenderIcon';
import { styles } from './LanguageSelection.styles';
import { rem } from '../utils/Responsive';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
];

export const LanguageSelection: React.FC = () => {
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
                    {currentLanguage === language.code && (
                        <RenderIcon
                            family="materialIcons"
                            icon="check"
                            fontSize={rem(1.75)}
                            color="primary"
                        />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default LanguageSelection;
