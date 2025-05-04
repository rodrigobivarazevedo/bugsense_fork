import React from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderIcon from '../components/RenderIcon';
import companyInfo from '../utils/companyInfo.json';
import * as S from './More.styles';

const options = [
    {
        section: 'App settings',
        content: [
            {
                iconFamily: 'ionIcons',
                icon: 'language',
                label: 'Language',
                onPress: (navigation: any) => navigation.navigate('LanguageSelection')
            },
            {
                iconFamily: 'materialIcons',
                icon: 'perm-device-info',
                label: 'Device permissions',
                onPress: () => {/* TODO: navigate or open settings */ }
            },
        ],
    },
    {
        section: 'More info and support',
        content: [
            {
                iconFamily: 'materialIcons',
                icon: 'email',
                label: 'Email us',
                onPress: () => Linking.openURL(`mailto:${companyInfo.email}`)
            },
            {
                iconFamily: 'materialIcons',
                icon: 'phone',
                label: 'Call us',
                onPress: () => Linking.openURL(`tel:${companyInfo.phone}`)
            },
            {
                iconFamily: 'materialCommunity',
                icon: 'web',
                label: 'Visit our website',
                onPress: () => Linking.openURL(companyInfo.website)
            },
        ],
    },
];

export const More: React.FC = () => {
    const navigation = useNavigation();
    return (
        <S.Container>
            {options.map((section, idx) => (
                <React.Fragment key={section.section}>
                    {idx !== 0 && <S.SectionDivider />}
                    <S.SectionHeader>{section.section}</S.SectionHeader>
                    {section.content.map((opt) => (
                        <S.OptionButton key={opt.label} onPress={() => opt.onPress(navigation)}>
                            <S.OptionIconTextWrapper>
                                <RenderIcon family={opt.iconFamily as any} icon={opt.icon} fontSize={22} color="primary" />
                                <S.OptionText>{opt.label}</S.OptionText>
                            </S.OptionIconTextWrapper>
                            <S.OptionArrow>
                                <RenderIcon family="materialIcons" icon="chevron-right" fontSize={28} color="primary" />
                            </S.OptionArrow>
                        </S.OptionButton>
                    ))}
                </React.Fragment>
            ))}
        </S.Container>
    );
};

export default More;
