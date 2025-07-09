import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './LanguageSwitcher.styles';

interface LanguageSwitcherProps {
    style?: any;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const toggleLanguage = async () => {
        const newLanguage = currentLanguage === 'en' ? 'de' : 'en';
        await i18n.changeLanguage(newLanguage);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={toggleLanguage}>
                <Text style={styles.text}>
                    {currentLanguage === 'en'
                        ? 'Sprache ändern • Deutsch'
                        : 'Change Language • English'
                    }
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LanguageSwitcher;
