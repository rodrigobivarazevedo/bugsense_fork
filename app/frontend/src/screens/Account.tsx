import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Account.styles';
import RenderIcon from '../components/RenderIcon';
import Logo from '../components/Logo';
import { rem } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export const Account: React.FC = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // TODO: get user data from API
    const userName = 'Jane Julian Vernonica Doe';
    const dateJoined = '01.04.2022';
    const gender = 'Female';
    const dob = '02.02.2002';
    const email = 'somtochukwumbuko@gmail.com';
    const phone = '0162-7033954';
    const address = 'Alois-Gäbl-Str. 4\n84347 Pfarrkirchen\nDeutschland';

    return (
        <S.Scroll contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? insets.bottom + 24 : 0 }}>
            <S.ProfileCard>
                <S.ProfileCardBgLogo>
                    <Logo width={120} height={120} opacity={0.07} />
                </S.ProfileCardBgLogo>
                <S.ProfileCardContent>
                    <S.ProfileImage>
                        <RenderIcon
                            family="materialIcons"
                            icon="account-circle"
                            fontSize={rem(4)}
                            color="primary"
                        />
                    </S.ProfileImage>
                    <S.ProfileInfo>
                        <S.UserName>{userName}</S.UserName>
                        <S.DateJoined>{t('Joined')} {dateJoined}</S.DateJoined>
                        <S.QRButton>
                            <RenderIcon
                                family="materialCommunity"
                                icon="qrcode"
                                fontSize={rem(1.5)}
                                color="primary"
                            />
                            <S.QRButtonText>{t('View my QR code')}</S.QRButtonText>
                        </S.QRButton>
                    </S.ProfileInfo>
                </S.ProfileCardContent>
                <S.EditIconBtn>
                    <RenderIcon
                        family="materialIcons"
                        icon="edit"
                        fontSize={rem(1.5)}
                        color="white"
                    />
                </S.EditIconBtn>
            </S.ProfileCard>

            <S.SectionTitle>{t('Account Details')}</S.SectionTitle>
            <S.LightCard>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Name')}</S.ItemLabel>
                        <S.ItemValue>{userName}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Gender')}</S.ItemLabel>
                        <S.ItemValue>{gender}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Date of birth')}</S.ItemLabel>
                        <S.ItemValue>{dob}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
            </S.LightCard>

            <S.SectionTitle>{t('Contact Data')}</S.SectionTitle>
            <S.LightCard>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Email address')}</S.ItemLabel>
                        <S.ItemValue>{email}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Phone number')}</S.ItemLabel>
                        <S.ItemValue>{phone}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Address')}</S.ItemLabel>
                        <S.ItemValue>{address}</S.ItemValue>
                    </S.ItemTextCol>
                    <S.EditIconBtnLight>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
            </S.LightCard>

            <S.DeleteButton>
                <S.DeleteButtonText>{t('Delete My Account')}</S.DeleteButtonText>
            </S.DeleteButton>

            <S.ActionButton>
                <S.ActionButtonText>{t('Change password')}</S.ActionButtonText>
            </S.ActionButton>
            <S.ActionButton>
                <S.ActionButtonText>{t('Sign out')}</S.ActionButtonText>
            </S.ActionButton>
        </S.Scroll>
    );
};

export default Account;
