import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Account.styles';
import RenderIcon from '../components/RenderIcon';
import Logo from '../components/Logo';
import { rem } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, TextInput, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { themeColors } from '../theme/global';

interface AddressSuggestion {
    display_name: string;
    lat: string;
    lon: string;
}

const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
            {
                headers: {
                    'User-Agent': 'BugSense-App/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        return data.map((item: any) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));
    } catch (error) {
        console.error('Error searching addresses:', error);
        return [];
    }
};

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
        address: 'Alois-Gäbl-Str. 4\n84347 Pfarrkirchen\nDeutschland',
    });

    // Address search states
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleEdit = (field: string) => {
        setEditingField(field);
        setTempValue(userData[field as keyof typeof userData]);
        if (field === 'address') {
            setSearchQuery('');
            setAddressSuggestions([]);
            setShowAddressModal(true);
        }
    };

    const handleSave = () => {
        if (editingField) {
            setUserData(prev => ({
                ...prev,
                [editingField]: tempValue
            }));
            setEditingField(null);
            setAddressSuggestions([]);
            setShowAddressModal(false);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setAddressSuggestions([]);
        setShowAddressModal(false);
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

    const handleAddressSearch = (query: string) => {
        setSearchQuery(query);
        setTempValue(query);

        if (query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for debouncing
        const timeout = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await searchAddresses(query);
                setAddressSuggestions(results);
            } catch (error) {
                console.error('Error searching addresses:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce

        setSearchTimeout(timeout);
    };

    const handleAddressSelect = (address: AddressSuggestion) => {
        setTempValue(address.display_name);
        setUserData(prev => ({
            ...prev,
            address: address.display_name
        }));
        setEditingField(null);
        setAddressSuggestions([]);
        setShowAddressModal(false);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    // TODO: get user data from API
    const dateJoined = '01.04.2022';
    const dob = '02.02.2002';

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
            if (field === 'address') {
                return (
                    <Modal
                        visible={showAddressModal}
                        transparent
                        animationType="fade"
                        onRequestClose={handleCancel}
                    >
                        <S.ModalOverlay onPress={handleCancel}>
                            <S.SuggestionsModalContent onStartShouldSetResponder={() => true}>
                                <TextInput
                                    value={tempValue}
                                    onChangeText={handleAddressSearch}
                                    onSubmitEditing={handleSave}
                                    autoFocus
                                    style={{
                                        color: themeColors.primary,
                                        fontSize: 16,
                                        fontWeight: '600',
                                        padding: 0,
                                        marginBottom: rem(0.5),
                                        backgroundColor: '#F5F5F5',
                                        borderRadius: 8,
                                        paddingHorizontal: 12,
                                    }}
                                />
                                {isSearching && (
                                    <S.LoadingContainer>
                                        <ActivityIndicator color={themeColors.primary} />
                                    </S.LoadingContainer>
                                )}
                                <ScrollView style={{ maxHeight: 200, marginTop: 8 }}>
                                    {addressSuggestions.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={`${suggestion.lat}-${suggestion.lon}`}
                                            onPress={() => handleAddressSelect(suggestion)}
                                        >
                                            <S.SuggestionItem>
                                                <S.SuggestionText>{suggestion.display_name}</S.SuggestionText>
                                            </S.SuggestionItem>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </S.SuggestionsModalContent>
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
                        {renderEditableField('address', userData.address)}
                    </S.ItemTextCol>
                    <S.EditIconBtnLight onPress={() => handleEdit('address')}>
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
