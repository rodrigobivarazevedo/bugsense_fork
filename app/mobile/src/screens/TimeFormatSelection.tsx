import { FC, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import SimpleSelectPage from '../components/SimpleSelectPage';

export const TimeFormatSelection: FC = () => {
    const [currentFormat, setCurrentFormat] = useState<'12' | '24'>('12');
    const { t } = useTranslation();
    const timeFormats = [
        { code: '12', name: `${t('12_hour_format')} (AM/PM)` },
        { code: '24', name: t('24_hour_format') },
    ];

    useEffect(() => {
        AsyncStorage.getItem('timeFormat').then(format => {
            if (format === '24' || format === '12') {
                setCurrentFormat(format);
            }
        });
    }, []);

    const changeFormat = (format: string) => {
        if (format === '12' || format === '24') {
            AsyncStorage.setItem('timeFormat', format);
            setCurrentFormat(format);
        }
    };

    return (
        <SimpleSelectPage
            title={t('select_time_format')}
            options={timeFormats}
            selected={currentFormat}
            onSelect={changeFormat}
        />
    );
};

export default TimeFormatSelection;
