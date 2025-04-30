import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Account.styles';
import RenderIcon from '../components/RenderIcon';
import Logo from '../components/Logo';
import { rem } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, TextInput, Modal, TouchableOpacity } from 'react-native';
import { themeColors } from '../theme/global';

export const Account: React.FC = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // State for editable fields
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    const [userData, setUserData] = useState({
        userName: 'Jane Julian Vernonica Doe',
        email: 'somtochukwumbuko@gmail.com',
        phone: '0162-7033954',
        gender: 'Female',
        // ... other fields will be added later
    });

    const handleEdit = (field: string) => {
        setEditingField(field);
        setTempValue(userData[field as keyof typeof userData]);
    };

    const handleSave = () => {
        if (editingField) {
            setUserData(prev => ({
                ...prev,
                [editingField]: tempValue
            }));
            setEditingField(null);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    const handlePhoneChange = (text: string) => {
        // Only allow numbers, spaces, and hyphens
        const cleanedText = text.replace(/[^0-9\s-]/g, '');
        setTempValue(cleanedText);
    };

    const handleGenderSelect = (gender: string) => {
        setUserData(prev => ({
            ...prev,
            gender
        }));
        setEditingField(null);
    };

    // TODO: get user data from API
    const dateJoined = '01.04.2022';
    const dob = '02.02.2002';
    const address = 'Alois-Gäbl-Str. 4\n84347 Pfarrkirchen\nDeutschland';

    const renderEditableField = (field: string, value: string) => {
        if (editingField === field) {
            if (field === 'gender') {
                return (
                    <Modal
                        visible={true}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={handleCancel}
                    >
                        <S.ModalOverlay onPress={handleCancel}>
                            <S.ModalContent>
                                <S.ModalTitle>{t('Select Gender')}</S.ModalTitle>
                                <TouchableOpacity onPress={() => handleGenderSelect('Male')}>
                                    <S.ModalOption>
                                        <S.ModalOptionText>Male</S.ModalOptionText>
                                    </S.ModalOption>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleGenderSelect('Female')}>
                                    <S.ModalOption>
                                        <S.ModalOptionText>Female</S.ModalOptionText>
                                    </S.ModalOption>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleGenderSelect('Not Specified')}>
                                    <S.ModalOption>
                                        <S.ModalOptionText>Not Specified</S.ModalOptionText>
                                    </S.ModalOption>
                                </TouchableOpacity>
                            </S.ModalContent>
                        </S.ModalOverlay>
                    </Modal>
                );
            }
            return (
                <TextInput
                    value={tempValue}
                    onChangeText={field === 'phone' ? handlePhoneChange : setTempValue}
                    onSubmitEditing={handleSave}
                    onBlur={handleSave}
                    autoFocus
                    keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                    style={{
                        color: themeColors.primary,
                        fontSize: 16,
                        fontWeight: '600',
                        padding: 0,
                        marginBottom: rem(0.5),
                    }}
                />
            );
        }
        return <S.ItemValue>{value}</S.ItemValue>;
    };

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
                        <S.UserName>{userData.userName}</S.UserName>
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
                        {renderEditableField('userName', userData.userName)}
                    </S.ItemTextCol>
                    <S.EditIconBtnLight onPress={() => handleEdit('userName')}>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Gender')}</S.ItemLabel>
                        {renderEditableField('gender', userData.gender)}
                    </S.ItemTextCol>
                    <S.EditIconBtnLight onPress={() => handleEdit('gender')}>
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
                        {renderEditableField('email', userData.email)}
                    </S.ItemTextCol>
                    <S.EditIconBtnLight onPress={() => handleEdit('email')}>
                        <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                    </S.EditIconBtnLight>
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Phone number')}</S.ItemLabel>
                        {renderEditableField('phone', userData.phone)}
                    </S.ItemTextCol>
                    <S.EditIconBtnLight onPress={() => handleEdit('phone')}>
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
