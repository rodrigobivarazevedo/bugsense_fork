import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Account.styles';
import RenderIcon from '../components/RenderIcon';
import Logo from '../components/Logo';
import { rem } from '../utils/Responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { themeColors } from '../theme/GlobalTheme';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import GenericDateTimePicker from '../components/GenericDateTimePicker';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import Api from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatDate } from '../utils/DateTimeFormatter';
import ChangePasswordModal from '../components/modal/ChangePasswordModal';
import {
    securityQuestions,
    SecurityQuestionsData,
    validateSecurityQuestionsForUpdate,
    getAvailableQuestionsForIndex as getAvailableQuestionsUtil,
    hasSecurityQuestionsChanges as hasSecurityQuestionsChangesUtil
} from '../utils/SecurityQuestions';

export const Account: FC = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // State for editable fields
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    const [pendingValue, setPendingValue] = useState<string>('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showSecurityQuestionsConfirmationModal, setShowSecurityQuestionsConfirmationModal] = useState(false);

    // Address editing states
    const [addressFields, setAddressFields] = useState({
        street: '',
        city: '',
        postcode: '',
        country: ''
    });
    const [originalAddressFields, setOriginalAddressFields] = useState({
        street: '',
        city: '',
        postcode: '',
        country: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Security questions editing states
    const [securityQuestionsData, setSecurityQuestionsData] = useState<SecurityQuestionsData>({
        security_question_1: '',
        security_answer_1: '',
        security_question_2: '',
        security_answer_2: '',
        security_question_3: '',
        security_answer_3: ''
    });
    const [originalSecurityQuestions, setOriginalSecurityQuestions] = useState<SecurityQuestionsData>({
        security_question_1: '',
        security_answer_1: '',
        security_question_2: '',
        security_answer_2: '',
        security_question_3: '',
        security_answer_3: ''
    });
    const [showSecurityQuestionDropdown, setShowSecurityQuestionDropdown] = useState(false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    const [securityQuestionsEditMode, setSecurityQuestionsEditMode] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    const navigation = useNavigation();

    // Refs for address TextInput fields
    const streetInputRef = useRef<TextInput>(null);
    const cityInputRef = useRef<TextInput>(null);
    const postcodeInputRef = useRef<TextInput>(null);

    // Refs for security answer TextInput fields
    const securityAnswer1Ref = useRef<TextInput>(null);
    const securityAnswer2Ref = useRef<TextInput>(null);
    const securityAnswer3Ref = useRef<TextInput>(null);

    const availableQuestions = securityQuestions(t);

    const handleEdit = (field: string) => {
        setEditingField(field);
        const fieldValue = user?.[field as keyof typeof user];
        setTempValue(typeof fieldValue === 'string' ? fieldValue : '');
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
            } catch (error) {
                console.error('Error updating field:', error);
                Alert.alert(t('error'), t('failed_to_update_field'));
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
                Alert.alert(t('error'), t('failed_to_update_field'));
            }
        }
        setEditingField(null);
        setShowConfirmationModal(false);
        setPendingValue('');
    };

    const handleCancel = () => {
        setEditingField(null);
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
                Alert.alert(t('error'), t('failed_to_update_gender'));
            }
        }
        setEditingField(null);
    };

    const handleDateChange = async (date: Date) => {
        setShowDatePicker(false);
        const formatted = date.toISOString().split('T')[0];
        if (user) {
            try {
                const response = await Api.put('users/me/', {
                    dob: formatted
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error updating date of birth:', error);
                Alert.alert(t('error'), t('failed_to_update_date_of_birth'));
            }
        }
        setEditingField(null);
    };

    // Address field handlers
    const handleAddressFieldChange = (field: string, value: string) => {
        setAddressFields(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddressSave = async () => {
        // Blur all address input fields
        streetInputRef.current?.blur();
        cityInputRef.current?.blur();
        postcodeInputRef.current?.blur();

        if (user) {
            try {
                const response = await Api.put('users/me/', addressFields);
                setUser(response.data);
                setOriginalAddressFields(addressFields);
                Alert.alert(t('success'), t('address_updated_successfully'));
            } catch (error) {
                console.error('Error updating address:', error);
                Alert.alert(t('error'), t('failed_to_update_address'));
            }
        }
    };

    const handleAddressCancel = () => {
        // Blur all address input fields
        streetInputRef.current?.blur();
        cityInputRef.current?.blur();
        postcodeInputRef.current?.blur();

        setAddressFields(originalAddressFields);
    };

    // Check if address fields have changed
    const hasAddressChanges = () => {
        return (
            addressFields.street !== originalAddressFields.street ||
            addressFields.city !== originalAddressFields.city ||
            addressFields.postcode !== originalAddressFields.postcode ||
            addressFields.country !== originalAddressFields.country
        );
    };

    // Security questions handlers
    const handleSecurityQuestionChange = (questionNumber: number, field: 'question' | 'answer', value: string) => {
        const questionKey = `security_question_${questionNumber}` as keyof typeof securityQuestionsData;
        const answerKey = `security_answer_${questionNumber}` as keyof typeof securityQuestionsData;

        setSecurityQuestionsData(prev => ({
            ...prev,
            [field === 'question' ? questionKey : answerKey]: value
        }));
    };

    const handleSecurityQuestionSelect = (question: string, questionNumber: number) => {
        handleSecurityQuestionChange(questionNumber, 'question', question);
        setShowSecurityQuestionDropdown(false);
        setSelectedQuestionIndex(null);
    };

    const getAvailableQuestionsForIndex = (questionNumber: number) => {
        return getAvailableQuestionsUtil(securityQuestionsData, questionNumber, availableQuestions);
    };

    const handleSecurityQuestionsSave = async () => {
        // Blur all security answer input fields
        securityAnswer1Ref.current?.blur();
        securityAnswer2Ref.current?.blur();
        securityAnswer3Ref.current?.blur();

        if (user) {
            try {
                const dataToSend: Partial<SecurityQuestionsData> = {};

                if (securityQuestionsData.security_question_1 && securityQuestionsData.security_answer_1) {
                    dataToSend.security_question_1 = securityQuestionsData.security_question_1;
                    dataToSend.security_answer_1 = securityQuestionsData.security_answer_1;
                }
                if (securityQuestionsData.security_question_2 && securityQuestionsData.security_answer_2) {
                    dataToSend.security_question_2 = securityQuestionsData.security_question_2;
                    dataToSend.security_answer_2 = securityQuestionsData.security_answer_2;
                }
                if (securityQuestionsData.security_question_3 && securityQuestionsData.security_answer_3) {
                    dataToSend.security_question_3 = securityQuestionsData.security_question_3;
                    dataToSend.security_answer_3 = securityQuestionsData.security_answer_3;
                }

                const response = await Api.put('users/me/', dataToSend);
                setUser(response.data);
                setOriginalSecurityQuestions(securityQuestionsData);
                Alert.alert(t('success'), t('security_questions_updated_successfully'));
                setSecurityQuestionsEditMode(false);
            } catch (error) {
                console.error('Error updating security questions:', error);
                Alert.alert(t('error'), t('failed_to_update_security_questions'));
            }
        }
    };

    const handleSecurityQuestionsSaveConfirm = async () => {
        setShowSecurityQuestionsConfirmationModal(false);
        await handleSecurityQuestionsSave();
    };

    const handleSecurityQuestionsCancel = () => {
        // Blur all security answer input fields
        securityAnswer1Ref.current?.blur();
        securityAnswer2Ref.current?.blur();
        securityAnswer3Ref.current?.blur();

        setSecurityQuestionsData(originalSecurityQuestions);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        const countryName = typeof country.name === 'string' ? country.name : String(country.name);
        handleAddressFieldChange('country', countryName);
        setShowCountryPicker(false);
    };

    // Check if security questions have changed
    const hasSecurityQuestionsChanges = () => {
        return hasSecurityQuestionsChangesUtil(securityQuestionsData, originalSecurityQuestions);
    };

    const canSaveSecurityQuestions = () => {
        return validateSecurityQuestionsForUpdate(securityQuestionsData, originalSecurityQuestions);
    };

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
        security_question_1: string;
        security_question_2: string;
        security_question_3: string;
        is_doctor?: boolean;
        institution_name?: string;
        doctor_id?: string;
    }>(null);

    const [userType, setUserType] = useState<string>('patient');

    useEffect(() => {
        Api.get('users/me/')
            .then(res => {
                setUser(res.data);
                // Initialize address fields
                setAddressFields({
                    street: res.data.street || '',
                    city: res.data.city || '',
                    postcode: res.data.postcode || '',
                    country: res.data.country || ''
                });
                setOriginalAddressFields({
                    street: res.data.street || '',
                    city: res.data.city || '',
                    postcode: res.data.postcode || '',
                    country: res.data.country || ''
                });
                // Initialize security questions fields
                setSecurityQuestionsData({
                    security_question_1: res.data.security_question_1 || '',
                    security_answer_1: '',
                    security_question_2: res.data.security_question_2 || '',
                    security_answer_2: '',
                    security_question_3: res.data.security_question_3 || '',
                    security_answer_3: ''
                });
                setOriginalSecurityQuestions({
                    security_question_1: res.data.security_question_1 || '',
                    security_answer_1: '',
                    security_question_2: res.data.security_question_2 || '',
                    security_answer_2: '',
                    security_question_3: res.data.security_question_3 || '',
                    security_answer_3: ''
                });
            })
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
        useCallback(() => {
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
                    if (isActive) {
                        setUser(res.data);
                        // Update address fields
                        setAddressFields({
                            street: res.data.street || '',
                            city: res.data.city || '',
                            postcode: res.data.postcode || '',
                            country: res.data.country || ''
                        });
                        setOriginalAddressFields({
                            street: res.data.street || '',
                            city: res.data.city || '',
                            postcode: res.data.postcode || '',
                            country: res.data.country || ''
                        });
                        // Update security questions fields
                        setSecurityQuestionsData({
                            security_question_1: res.data.security_question_1 || '',
                            security_answer_1: '',
                            security_question_2: res.data.security_question_2 || '',
                            security_answer_2: '',
                            security_question_3: res.data.security_question_3 || '',
                            security_answer_3: ''
                        });
                        setOriginalSecurityQuestions({
                            security_question_1: res.data.security_question_1 || '',
                            security_answer_1: '',
                            security_question_2: res.data.security_question_2 || '',
                            security_answer_2: '',
                            security_question_3: res.data.security_question_3 || '',
                            security_answer_3: ''
                        });
                    }

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
                        Alert.alert(t('error'), t('could_not_load_profile'));
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
            t('delete_my_account'),
            t('are_you_sure_you_want_to_delete_your_account_this_cannot_be_undone'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
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
                            Alert.alert(t('error'), t('could_not_delete_account'));
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
                                {renderEditableField('dob', formatDate(user?.dob, 'long', true))}
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
            </S.LightCard>

            {userType === 'patient' && (
                <>
                    <S.SectionTitle>{t('Address')}</S.SectionTitle>
                    <S.LightCard>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('Street')}</S.ItemLabel>
                                {editingField === 'street' ? (
                                    <TextInput
                                        value={addressFields.street}
                                        onChangeText={(value) => handleAddressFieldChange('street', value)}
                                        placeholder={t('Enter street address')}
                                        style={{
                                            color: themeColors.primary,
                                            fontSize: 16,
                                            fontWeight: '600',
                                            padding: 0,
                                            marginBottom: rem(0.5),
                                        }}
                                        ref={streetInputRef}
                                        autoFocus
                                        onBlur={() => setEditingField(null)}
                                    />
                                ) : (
                                    <S.ItemValue>{addressFields.street}</S.ItemValue>
                                )}
                            </S.ItemTextCol>
                            {editingField !== 'street' && (
                                <S.EditIconBtnLight onPress={() => setEditingField('street')}>
                                    <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                                </S.EditIconBtnLight>
                            )}
                        </S.ItemRow>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('City')}</S.ItemLabel>
                                {editingField === 'city' ? (
                                    <TextInput
                                        value={addressFields.city}
                                        onChangeText={(value) => handleAddressFieldChange('city', value)}
                                        placeholder={t('Enter city')}
                                        style={{
                                            color: themeColors.primary,
                                            fontSize: 16,
                                            fontWeight: '600',
                                            padding: 0,
                                            marginBottom: rem(0.5),
                                        }}
                                        ref={cityInputRef}
                                        autoFocus
                                        onBlur={() => setEditingField(null)}
                                    />
                                ) : (
                                    <S.ItemValue>{addressFields.city}</S.ItemValue>
                                )}
                            </S.ItemTextCol>
                            {editingField !== 'city' && (
                                <S.EditIconBtnLight onPress={() => setEditingField('city')}>
                                    <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                                </S.EditIconBtnLight>
                            )}
                        </S.ItemRow>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('Postcode')}</S.ItemLabel>
                                {editingField === 'postcode' ? (
                                    <TextInput
                                        value={addressFields.postcode}
                                        onChangeText={(value) => handleAddressFieldChange('postcode', value)}
                                        placeholder={t('Enter postcode')}
                                        style={{
                                            color: themeColors.primary,
                                            fontSize: 16,
                                            fontWeight: '600',
                                            padding: 0,
                                            marginBottom: rem(0.5),
                                        }}
                                        ref={postcodeInputRef}
                                        autoFocus
                                        onBlur={() => setEditingField(null)}
                                    />
                                ) : (
                                    <S.ItemValue>{addressFields.postcode}</S.ItemValue>
                                )}
                            </S.ItemTextCol>
                            {editingField !== 'postcode' && (
                                <S.EditIconBtnLight onPress={() => setEditingField('postcode')}>
                                    <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                                </S.EditIconBtnLight>
                            )}
                        </S.ItemRow>
                        <S.ItemRow>
                            <S.ItemTextCol>
                                <S.ItemLabel>{t('Country')}</S.ItemLabel>
                                <S.ItemValue>{addressFields.country || t('Select a country')}</S.ItemValue>
                            </S.ItemTextCol>
                            {editingField !== 'country' && (
                                <S.EditIconBtnLight style={{ alignSelf: 'center' }} onPress={() => setEditingField('country')}>
                                    <RenderIcon family="materialIcons" icon="edit" fontSize={rem(1.25)} color="primary" />
                                </S.EditIconBtnLight>
                            )}
                        </S.ItemRow>
                        {editingField === 'country' && (
                            <CountryPicker
                                visible={true}
                                onClose={() => setEditingField(null)}
                                onSelect={handleCountrySelect}
                                countryCode={selectedCountry?.cca2 as CountryCode}
                                withFilter
                                withFlag
                                withCountryNameButton
                                withModal
                                withAlphaFilter
                                theme={{
                                    backgroundColor: themeColors.white,
                                    primaryColor: themeColors.primary,
                                    primaryColorVariant: themeColors.secondary,
                                    onBackgroundTextColor: themeColors.primary,
                                    filterPlaceholderTextColor: themeColors.themeGray,
                                }}
                            />
                        )}
                        {hasAddressChanges() && (
                            <S.AccountActionContainer>
                                <S.AccountCancelButton onPress={handleAddressCancel}>
                                    <S.AccountCancelButtonText>{t('Cancel')}</S.AccountCancelButtonText>
                                </S.AccountCancelButton>
                                <S.AccountSaveButton onPress={handleAddressSave}>
                                    <S.AccountSaveButtonText>{t('Save Changes')}</S.AccountSaveButtonText>
                                </S.AccountSaveButton>
                            </S.AccountActionContainer>
                        )}
                    </S.LightCard>

                    <S.SectionTitle>{t('Security Questions')}</S.SectionTitle>
                    <S.LightCard style={{ position: 'relative' }}>
                        {securityQuestionsEditMode ? (
                            <>
                                {[1, 2, 3].map((num) => (
                                    <S.SecurityQuestionBlock key={`qna${num}`}>
                                        <S.ItemLabel>{t('Question')} {num}</S.ItemLabel>
                                        <S.SelectorRow
                                            onPress={() => {
                                                setSelectedQuestionIndex(num);
                                                setShowSecurityQuestionDropdown(selectedQuestionIndex !== num || !showSecurityQuestionDropdown);
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <S.SelectorText>
                                                {securityQuestionsData[`security_question_${num}` as keyof typeof securityQuestionsData] || t('Select Security Question')}
                                            </S.SelectorText>
                                            <S.SelectorIcon>▼</S.SelectorIcon>
                                        </S.SelectorRow>
                                        {showSecurityQuestionDropdown && selectedQuestionIndex === num && (
                                            <S.DropdownContainer>
                                                {getAvailableQuestionsForIndex(num).map((question, idx) => (
                                                    <S.DropdownItem
                                                        key={idx}
                                                        onPress={() => handleSecurityQuestionSelect(question, num)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <S.DropdownText>{question}</S.DropdownText>
                                                    </S.DropdownItem>
                                                ))}
                                            </S.DropdownContainer>
                                        )}
                                        <S.AnswerInput
                                            value={securityQuestionsData[`security_answer_${num}` as keyof typeof securityQuestionsData]}
                                            onChangeText={(value: string) => handleSecurityQuestionChange(num, 'answer', value)}
                                            placeholder={t('Enter your answer')}
                                            placeholderTextColor={themeColors.themeGray}
                                            ref={num === 1 ? securityAnswer1Ref : num === 2 ? securityAnswer2Ref : securityAnswer3Ref}
                                        />
                                    </S.SecurityQuestionBlock>
                                ))}
                                {hasSecurityQuestionsChanges() && (
                                    <S.AccountActionContainer>
                                        <S.AccountCancelButton onPress={() => {
                                            setSecurityQuestionsEditMode(false);
                                            handleSecurityQuestionsCancel();
                                        }}>
                                            <S.AccountCancelButtonText>{t('Cancel')}</S.AccountCancelButtonText>
                                        </S.AccountCancelButton>
                                        <S.AccountSaveButton
                                            disabled={!(hasSecurityQuestionsChanges() && canSaveSecurityQuestions())}
                                            onPress={() => setShowSecurityQuestionsConfirmationModal(true)}
                                        >
                                            <S.AccountSaveButtonText
                                                disabled={!(hasSecurityQuestionsChanges() && canSaveSecurityQuestions())}
                                            >
                                                {t('Save Changes')}
                                            </S.AccountSaveButtonText>
                                        </S.AccountSaveButton>
                                    </S.AccountActionContainer>
                                )}
                            </>
                        ) : (
                            <>
                                {securityQuestionsData.security_question_1 ||
                                    securityQuestionsData.security_question_2 ||
                                    securityQuestionsData.security_question_3 ? (
                                    <>
                                        {[1, 2, 3].map((num) => (
                                            securityQuestionsData[`security_question_${num}` as keyof typeof securityQuestionsData] ? (
                                                <S.ItemRow key={`viewq${num}`}>
                                                    <S.ItemTextCol>
                                                        <S.ItemLabel>{t('Question')} {num}</S.ItemLabel>
                                                        <S.ItemValue>
                                                            {securityQuestionsData[`security_question_${num}` as keyof typeof securityQuestionsData]}
                                                        </S.ItemValue>
                                                    </S.ItemTextCol>
                                                </S.ItemRow>
                                            ) : null
                                        ))}
                                        <S.ActionButton onPress={() => setSecurityQuestionsEditMode(true)}>
                                            <S.ActionButtonText>{t('Update Security Questions')}</S.ActionButtonText>
                                        </S.ActionButton>
                                    </>
                                ) : (
                                    <>
                                        <S.ItemRow>
                                            <S.ItemTextCol>
                                                <S.ItemLabel>
                                                    {t('You have not set any security questions.Please set security questions to make sure you can reset your password.')}
                                                </S.ItemLabel>
                                            </S.ItemTextCol>
                                        </S.ItemRow>
                                        <S.ActionButton onPress={() => setSecurityQuestionsEditMode(true)}>
                                            <S.ActionButtonText>{t('Add Security Questions')}</S.ActionButtonText>
                                        </S.ActionButton>
                                    </>
                                )}
                            </>
                        )}
                    </S.LightCard>
                </>
            )}

            {userType === 'patient' && (
                <S.DeleteButton onPress={handleDelete}>
                    <S.DeleteButtonText>{t('Delete My Account')}</S.DeleteButtonText>
                </S.DeleteButton>
            )}

            <S.ActionButton onPress={() => setShowChangePasswordModal(true)}>
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
            <ConfirmationModal
                isOpen={showSecurityQuestionsConfirmationModal}
                onClose={() => setShowSecurityQuestionsConfirmationModal(false)}
                onConfirm={handleSecurityQuestionsSaveConfirm}
                heading={t('Update Security Questions')}
                message={t('Are you sure you want to update your security questions? The answers to the questions you edited will be updated.')}
                confirmText={t('Confirm')}
                cancelText={t('Cancel')}
            />
            <ChangePasswordModal
                visible={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSuccess={() => { }}
            />
        </S.Scroll>
    );
};

export default Account;
