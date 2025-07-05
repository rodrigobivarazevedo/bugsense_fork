import { FC, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './LanguageSelection.styles';
import { rem } from '../utils/Responsive';
import { useTranslation } from 'react-i18next';

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

    const changeFormat = async (format: '12' | '24') => {
        await AsyncStorage.setItem('timeFormat', format);
        setCurrentFormat(format);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Time Format</Text>
            {timeFormats.map((format) => (
                <TouchableOpacity
                    key={format.code}
                    style={[
                        styles.languageButton,
                        currentFormat === format.code && styles.languageButtonActive,
                    ]}
                    onPress={() => changeFormat(format.code as '12' | '24')}
                >
                    <Text style={styles.languageText}>{format.name}</Text>
                    {currentFormat === format.code && (
                        <Text style={{ fontSize: rem(1.5), color: '#6c63ff', fontWeight: 'bold' }}>✓</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TimeFormatSelection; 