import { FC, Fragment, useState, useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import RenderIcon from '../components/RenderIcon';
import companyInfo from '../json/companyInfo.json';
import * as S from './More.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const More: FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [userType, setUserType] = useState<string>('patient');
    const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            AsyncStorage.getItem('userType').then(type => {
                if (isActive && type && typeof type === 'string') {
                    setUserType(type);
                }
            });
            AsyncStorage.getItem('timeFormat').then(format => {
                if (isActive && (format === '24' || format === '12')) {
                    setTimeFormat(format);
                }
            });
            return () => {
                isActive = false;
            };
        }, [])
    );

    const options = [
        {
            section: 'app_settings',
            content: [
                {
                    iconFamily: 'ionIcons',
                    icon: 'language',
                    label: 'language',
                    onPress: (navigation: any) => navigation.navigate('LanguageSelection'),
                },
                {
                    iconFamily: 'materialIcons',
                    icon: 'access-time',
                    label: 'time_format',
                    onPress: (navigation: any) => navigation.navigate('TimeFormatSelection'),
                    extra: timeFormat === '24' ? t('24_hour_format') : t('12_hour_format'),
                },
                {
                    iconFamily: 'materialIcons',
                    icon: 'perm-device-info',
                    label: 'device_permissions',
                    onPress: () => Linking.openSettings(),
                },
            ],
        },
        {
            section: 'more_info_and_support',
            content: [
                {
                    iconFamily: 'materialIcons',
                    icon: 'email',
                    label: 'email_us',
                    onPress: () => Linking.openURL(`mailto:${companyInfo.email}`),
                },
                {
                    iconFamily: 'materialIcons',
                    icon: 'phone',
                    label: 'call_us',
                    onPress: () => Linking.openURL(`tel:${companyInfo.phone}`),
                },
                {
                    iconFamily: 'materialCommunity',
                    icon: 'web',
                    label: 'visit_our_website',
                    onPress: () => Linking.openURL(companyInfo.website),
                },
            ],
        },
    ];

    if (userType === 'doctor') {
        return (
            <S.Container>
                <S.SectionHeader>{t('app_settings')}</S.SectionHeader>
                {options[0].content.map((opt) => (
                    <S.OptionButton key={opt.label} onPress={() => opt.onPress(navigation)}>
                        <S.OptionIconTextWrapper>
                            <RenderIcon family={opt.iconFamily as any} icon={opt.icon} fontSize={22} color="primary" />
                            <S.OptionText>
                                {t(opt.label)}
                                {'extra' in opt && opt.extra ? ` (${opt.extra})` : ''}
                            </S.OptionText>
                        </S.OptionIconTextWrapper>
                        <S.OptionArrow>
                            <RenderIcon family="materialIcons" icon="chevron-right" fontSize={28} color="primary" />
                        </S.OptionArrow>
                    </S.OptionButton>
                ))}
                <S.SectionDivider />
                <S.SectionHeader>{t('more_info_and_support')}</S.SectionHeader>
                <S.OptionButton onPress={() => Linking.openURL(`mailto:${companyInfo.email}`)}>
                    <S.OptionIconTextWrapper>
                        <RenderIcon family="materialIcons" icon="admin-panel-settings" fontSize={22} color="primary" />
                        <S.OptionText>{t('contact_admin')}</S.OptionText>
                    </S.OptionIconTextWrapper>
                    <S.OptionArrow>
                        <RenderIcon family="feather" icon="external-link" fontSize={22} color="primary" />
                    </S.OptionArrow>
                </S.OptionButton>
            </S.Container>
        );
    }

    return (
        <S.Container>
            {options.map((option, idx) => (
                <Fragment key={option.section}>
                    {idx !== 0 && <S.SectionDivider />}
                    <S.SectionHeader>{t(option.section)}</S.SectionHeader>
                    {option.content.map((opt) => (
                        <S.OptionButton key={opt.label} onPress={() => opt.onPress(navigation)}>
                            <S.OptionIconTextWrapper>
                                <RenderIcon family={opt.iconFamily as any} icon={opt.icon} fontSize={22} color="primary" />
                                <S.OptionText>
                                    {t(opt.label)}
                                    {'extra' in opt && opt.extra ? ` (${opt.extra})` : ''}
                                </S.OptionText>
                            </S.OptionIconTextWrapper>
                            <S.OptionArrow>
                                {option.section === "more_info_and_support" ? (
                                    <RenderIcon family="feather" icon="external-link" fontSize={22} color="primary" />
                                ) : (
                                    <RenderIcon family="materialIcons" icon="chevron-right" fontSize={28} color="primary" />
                                )}
                            </S.OptionArrow>
                        </S.OptionButton>
                    ))}
                </Fragment>
            ))}
        </S.Container>
    );
};

export default More;
