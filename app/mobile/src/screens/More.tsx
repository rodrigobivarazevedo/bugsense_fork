import React from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import RenderIcon from '../components/RenderIcon';
import companyInfo from '../utils/companyInfo.json';
import * as S from './More.styles';

const options = [
    {
        section: 'app_settings',
        content: [
            {
                iconFamily: 'ionIcons',
                icon: 'language',
                label: 'language',
                onPress: (navigation: any) => navigation.navigate('LanguageSelection')
            },
            {
                iconFamily: 'materialIcons',
                icon: 'perm-device-info',
                label: 'device_permissions',
                onPress: () => {/* TODO: navigate or open settings */ }
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
                onPress: () => Linking.openURL(`mailto:${companyInfo.email}`)
            },
            {
                iconFamily: 'materialIcons',
                icon: 'phone',
                label: 'call_us',
                onPress: () => Linking.openURL(`tel:${companyInfo.phone}`)
            },
            {
                iconFamily: 'materialCommunity',
                icon: 'web',
                label: 'visit_our_website',
                onPress: () => Linking.openURL(companyInfo.website)
            },
        ],
    },
];

export const More: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <S.Container>
            {options.map((option, idx) => (
                <React.Fragment key={option.section}>
                    {idx !== 0 && <S.SectionDivider />}
                    <S.SectionHeader>{t(option.section)}</S.SectionHeader>
                    {option.content.map((opt) => (
                        <S.OptionButton key={opt.label} onPress={() => opt.onPress(navigation)}>
                            <S.OptionIconTextWrapper>
                                <RenderIcon family={opt.iconFamily as any} icon={opt.icon} fontSize={22} color="primary" />
                                <S.OptionText>{t(opt.label)}</S.OptionText>
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
                </React.Fragment>
            ))}
        </S.Container>
    );
};

export default More;
