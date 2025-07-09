import { FC } from 'react';
import i18n from '../translations/i18n';
import { useTranslation } from 'react-i18next';
import SimpleSelectPage from '../components/SimpleSelectPage';

export const LanguageSelection: FC = () => {
    const { t } = useTranslation();
    const currentLanguage = i18n.language;

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
    ];

    const changeLanguage = async (languageCode: string) => {
        await i18n.changeLanguage(languageCode);
    };

    return (
        <SimpleSelectPage
            title={t('select_language')}
            options={languages}
            selected={currentLanguage}
            onSelect={changeLanguage}
        />
    );
};

export default LanguageSelection;
