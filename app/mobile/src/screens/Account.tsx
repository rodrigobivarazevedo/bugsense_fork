import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Account.styles';
import RenderIcon from '../components/RenderIcon';
import Logo from '../components/Logo';
import { rem } from '../utils/Responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, TextInput, Modal, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import GenericDateTimePicker from '../components/GenericDateTimePicker';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

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
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // Address search states
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [pendingValue, setPendingValue] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation();

    const handleEdit = (field: string) => {
        setEditingField(field);
        const fieldValue = user?.[field as keyof typeof user];
        setTempValue(typeof fieldValue === 'string' ? fieldValue : '');
        if (field === 'address') {
            setSearchQuery('');
            setAddressSuggestions([]);
            setShowAddressModal(true);
        }
        if (field === 'dob') {
            setShowDatePicker(true);
        }
    };

    // Called when user tries to save (onSubmitEditing/onBlur)
    const handleSave = async () => {
        if (editingField === 'full_name' || editingField === 'email') {
            setPendingValue(tempValue);
            setShowConfirmationModal(true);
        } else if (editingField && user) {
            try {
                const response = await Api.put('users/me/', {
                    [editingField]: tempValue
                });
                setUser(response.data);
                setEditingField(null);
                setAddressSuggestions([]);
                setShowAddressModal(false);
            } catch (error) {
                console.error('Error updating field:', error);
                Alert.alert(t('Error'), t('Failed to update field. Please try again.'));
            }
        }
    };

    // Called when user confirms in modal
    const handleConfirmSave = async () => {
        if ((editingField === 'full_name' || editingField === 'email') && user) {
            try {
                const response = await Api.put('users/me/', {
                    [editingField]: pendingValue
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error updating field:', error);
                Alert.alert(t('Error'), t('Failed to update field. Please try again.'));
            }
        }
        setEditingField(null);
        setShowConfirmationModal(false);
        setPendingValue('');
    };

    const handleCancel = () => {
        setEditingField(null);
        setAddressSuggestions([]);
        setShowAddressModal(false);
        setShowConfirmationModal(false);
        setPendingValue('');
    };

    const handlePhoneChange = (text: string) => {
        // Only allow numbers, spaces, and hyphens
        const cleanedText = text.replace(/[^0-9\s-]/g, '');
        setTempValue(cleanedText);
    };

    const handleGenderSelect = async (gender: string) => {
        if (user) {
            try {
                const response = await Api.put('users/me/', {
                    gender
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error updating gender:', error);
                Alert.alert(t('Error'), t('Failed to update gender. Please try again.'));
            }
        }
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

    const handleAddressSelect = async (address: AddressSuggestion) => {
        setTempValue(address.display_name);
        const [street, ...rest] = address.display_name.split(',');
        const [postcode, city] = rest[0].trim().split(' ');
        const country = rest[rest.length - 1].trim();

        if (user) {
            try {
                const response = await Api.put('users/me/', {
                    street: street.trim(),
                    postcode,
                    city,
                    country
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error updating address:', error);
                Alert.alert(t('Error'), t('Failed to update address. Please try again.'));
            }
        }
        setEditingField(null);
        setAddressSuggestions([]);
        setShowAddressModal(false);
    };

    const handleDateChange = async (date: Date) => {
        setShowDatePicker(false);
        const formatted = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        if (user) {
            try {
                const response = await Api.put('users/me/', {
                    dob: formatted
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error updating date of birth:', error);
                Alert.alert(t('Error'), t('Failed to update date of birth. Please try again.'));
            }
        }
        setEditingField(null);
    };

    const handlePhoneSave = async () => {
        if (user) {
            try {
                const response = await Api.put('users/me/', {
                    phone_number: tempValue
                });
                setUser(response.data);
                setEditingField(null);
            } catch (error) {
                console.error('Error updating phone number:', error);
                Alert.alert(t('Error'), t('Failed to update phone number. Please try again.'));
            }
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const renderEditableField = (field: string, value: string) => {
        if (userType === 'doctor') {
            return <S.ItemValue>{value}</S.ItemValue>;
        }

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
            if (field === 'dob') {
                return (
                    <>
                        <S.ItemValue>{user?.dob}</S.ItemValue>
                        <GenericDateTimePicker
                            value={user?.dob ? new Date(user?.dob.split('.').reverse().join('-')) : new Date()}
                            mode="date"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            visible={showDatePicker}
                            onCancel={() => setShowDatePicker(false)}
                        />
                    </>
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

    // state for current user profile
    const [user, setUser] = useState<null | {
        full_name: string;
        date_joined: string;
        gender: string;
        dob: string;
        email: string;
        phone_number: string;
        street: string;
        city: string;
        postcode: string;
        country: string;
        is_doctor?: boolean;
        institution_name?: string;
        doctor_id?: string;
    }>(null);

    const [userType, setUserType] = useState<string>('patient');

    useEffect(() => {
        Api.get('users/me/')
            .then(res => setUser(res.data))
            .catch(err => console.error('Could not load profile', err));

        // Get user type from AsyncStorage
        AsyncStorage.getItem('userType').then(type => {
            if (type && typeof type === 'string') {
                setUserType(type);
            }
        });
    }, []);

    // Fetch when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    (navigation as any).reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                    return;
                }
                try {
                    const res = await Api.get('users/me/');
                    if (isActive) setUser(res.data);

                    // Get user type from AsyncStorage
                    const type = await AsyncStorage.getItem('userType');
                    if (type && typeof type === 'string' && isActive) {
                        setUserType(type);
                    }
                } catch (err: any) {
                    if (err.response?.status === 401) {
                        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userType']);
                        (navigation as any).reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    } else {
                        console.error('Could not load profile', err);
                        Alert.alert(t('Error'), t('Could not load profile'));
                    }
                }
            })();

            return () => {
                isActive = false;
            };
        }, [navigation, t])
    );

    const handleSignOut = async () => {
        const refresh = await AsyncStorage.getItem('refreshToken');
        if (refresh) await Api.post('logout/', { refresh });
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userType']);
        Api.defaults.headers.Authorization = '';

        (navigation as any).reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleDelete = () => {
        Alert.alert(
            t('Delete My Account'),
            t('Are you sure you want to delete your account? This cannot be undone.'),
            [
                { text: t('Cancel'), style: 'cancel' },
                {
                    text: t('Delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await Api.delete('users/me/');
                            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userType']);
                            (navigation as any).reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (err: any) {
                            console.error('Delete failed', err);
                            Alert.alert(t('Error'), t('Could not delete account. Please try again.'));
                        }
                    }
                }
            ]
        );
    };

    if (!user) {
        return (
            <S.Scroll>
                <S.UserName>{t('Loading...')}</S.UserName>
            </S.Scroll>
        );
    }

    return (
        <S.Scroll contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 0 : 24 }}>
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
                        <S.UserName>{user?.full_name}</S.UserName>
                        <S.DateJoined>{t('Joined')} {user?.date_joined}</S.DateJoined>

                        <S.UserTypeIndicator>
                            <S.UserTypeText>
                                {userType === 'doctor' ? t('Medical Personnel') : t('Patient')}
                            </S.UserTypeText>
                        </S.UserTypeIndicator>

                        {userType === 'doctor' && user?.institution_name && (
                            <S.InstitutionInfo>
                                <S.InstitutionLabel>{t('Institution')}</S.InstitutionLabel>
                                <S.InstitutionName>{user.institution_name}</S.InstitutionName>
                            </S.InstitutionInfo>
                        )}

                        {userType === 'doctor' && user?.doctor_id && (
                            <S.DoctorIdInfo>
                                <S.DoctorIdLabel>{t('Doctor ID')}</S.DoctorIdLabel>
                                <S.DoctorIdValue>{user.doctor_id}</S.DoctorIdValue>
                            </S.DoctorIdInfo>
                        )}

                        {userType === 'patient' && (
                            <S.QRButton>
                                <RenderIcon
                                    family="materialCommunity"
                                    icon="qrcode"
                                    fontSize={rem(1.5)}
                                    color="primary"
                                />
                                <S.QRButtonText>{t('View my QR code')}</S.QRButtonText>
                            </S.QRButton>
                        )}
                    </S.ProfileInfo>
                </S.ProfileCardContent>
            </S.ProfileCard>

            <S.SectionTitle>{t('Account Details')}</S.SectionTitle>

            <S.LightCard>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Name')}</S.ItemLabel>
                        {renderEditableField('full_name', user?.full_name)}
                    </S.ItemTextCol>
                    {userType === 'patient' && (
                        <S.EditIconBtnLight onPress={() => handleEdit('full_name')}>
                            <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                        </S.EditIconBtnLight>
                    )}
                </S.ItemRow>

                {userType === 'patient' && (
                    <>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('Gender')}</S.ItemLabel>
                                {renderEditableField('gender', user?.gender)}
                            </S.ItemTextCol>
                            <S.EditIconBtnLight onPress={() => handleEdit('gender')}>
                                <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                            </S.EditIconBtnLight>
                        </S.ItemRow>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('Date of birth')}</S.ItemLabel>
                                {renderEditableField('dob', user?.dob)}
                            </S.ItemTextCol>
                            <S.EditIconBtnLight onPress={() => handleEdit('dob')}>
                                <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                            </S.EditIconBtnLight>
                        </S.ItemRow>
                    </>
                )}
            </S.LightCard>

            <S.SectionTitle>{t('Contact Data')}</S.SectionTitle>

            <S.LightCard>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Email address')}</S.ItemLabel>
                        {renderEditableField('email', user?.email)}
                    </S.ItemTextCol>
                    {userType === 'patient' && (
                        <S.EditIconBtnLight onPress={() => handleEdit('email')}>
                            <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                        </S.EditIconBtnLight>
                    )}
                </S.ItemRow>
                <S.ItemRow>
                    <S.ItemTextCol>
                        <S.ItemLabel>{t('Phone number')}</S.ItemLabel>
                        {renderEditableField('phone_number', user?.phone_number)}
                    </S.ItemTextCol>
                    {userType === 'patient' && (
                        <S.EditIconBtnLight onPress={() => handleEdit('phone_number')}>
                            <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                        </S.EditIconBtnLight>
                    )}
                </S.ItemRow>
                {userType === 'patient' && (
                    <S.ItemRow>
                        <S.ItemTextCol>
                            <S.ItemLabel>{t('Address')}</S.ItemLabel>
                            {renderEditableField('street', user?.street + '\n' + user?.postcode + ' ' + user?.city + '\n' + user?.country)}
                        </S.ItemTextCol>
                        <S.EditIconBtnLight onPress={() => handleEdit('street')}>
                            <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                        </S.EditIconBtnLight>
                    </S.ItemRow>
                )}
            </S.LightCard>

            {userType === 'patient' && (
                <S.DeleteButton onPress={handleDelete}>
                    <S.DeleteButtonText>{t('Delete My Account')}</S.DeleteButtonText>
                </S.DeleteButton>
            )}

            <S.ActionButton>
                <S.ActionButtonText>{t('Change password')}</S.ActionButtonText>
            </S.ActionButton>
            <S.ActionButton onPress={handleSignOut}>
                <S.ActionButtonText>{t('Sign out')}</S.ActionButtonText>
            </S.ActionButton>

            <ConfirmationModal
                isOpen={showConfirmationModal}
                onClose={handleCancel}
                onConfirm={handleConfirmSave}
                heading={"Save Changes"}
                message={editingField === 'full_name'
                    ? t('Are you sure you want to update your name?')
                    : t('Are you sure you want to update your email address?')}
                confirmText={t('Confirm')}
                cancelText={t('Cancel')}
            />
        </S.Scroll>
    );
};

export default Account;
