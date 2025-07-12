import { FC, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Logo from '../components/Logo';
import RenderIcon from '../components/RenderIcon';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';

type DoctorLoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

interface Institution {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const DoctorLogin: FC<DoctorLoginScreenProps> = ({ navigation }) => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [doctorId, setDoctorId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [institutionsLoading, setInstitutionsLoading] = useState(true);
    const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const fetchInstitutions = async () => {
        try {
            setInstitutionsLoading(true);
            const response = await Api.get('institutions/');
            setInstitutions(response.data);
        } catch (err: any) {
            console.error('Failed to fetch institutions', err);
            Alert.alert(t('error'), t('failed_to_load_institutions'));
        } finally {
            setInstitutionsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!selectedInstitution) {
            Alert.alert(t('error'), t('please_select_an_institution'));
            return;
        }

        if (!doctorId || !password) {
            Alert.alert(t('error'), t('please_fill_in_all_fields'));
            return;
        }

        try {
            setLoading(true);
            const response = await Api.post('doctor-login/', {
                institution_id: selectedInstitution.id,
                doctor_id: doctorId,
                password: password,
            });

            const { access, refresh, doctor } = response.data;

            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);
            await AsyncStorage.setItem('user', JSON.stringify(doctor));
            await AsyncStorage.setItem('userType', 'doctor');

            console.log('Doctor login successful:', { doctorId, institution: selectedInstitution.name });
            navigation.navigate('Main', { screen: 'Home' });
        } catch (err: any) {
            console.error('Doctor login error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('login_failed'), message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Container>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <S.LogoContainer>
                    <Logo />
                </S.LogoContainer>

                {/* Institution Selection */}
                <S.InputContainer>
                    <S.InputWrapper>
                        <S.StyledInput
                            placeholder={t('select_institution')}
                            placeholderTextColor={themeColors.primary}
                            value={selectedInstitution?.name || ''}
                            editable={false}
                            onPressIn={() => setShowInstitutionDropdown(!showInstitutionDropdown)}
                        />
                        <S.IconContainer>
                            <TouchableOpacity onPress={() => setShowInstitutionDropdown(!showInstitutionDropdown)}>
                                <RenderIcon
                                    family="materialIcons"
                                    icon={showInstitutionDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                    fontSize={28}
                                    color={themeColors.primary}
                                />
                            </TouchableOpacity>
                        </S.IconContainer>
                    </S.InputWrapper>
                    {institutionsLoading && (
                        <S.ErrorText style={{ color: themeColors.primary }}>
                            {t('loading_institutions')}
                        </S.ErrorText>
                    )}
                    {showInstitutionDropdown && !institutionsLoading && (
                        <S.DropdownContainer>
                            {institutions.map((institution) => (
                                <S.DropdownItem
                                    key={institution.id}
                                    onPress={() => {
                                        setSelectedInstitution(institution);
                                        setShowInstitutionDropdown(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <S.DropdownText>{institution.name}</S.DropdownText>
                                </S.DropdownItem>
                            ))}
                        </S.DropdownContainer>
                    )}
                </S.InputContainer>

                {/* Doctor ID */}
                <S.InputContainer>
                    <S.InputWrapper>
                        <S.StyledInput
                            placeholder={t('doctor_id')}
                            placeholderTextColor={themeColors.primary}
                            value={doctorId}
                            onChangeText={setDoctorId}
                            autoCapitalize="none"
                        />
                    </S.InputWrapper>
                </S.InputContainer>

                {/* Password */}
                <S.InputContainer>
                    <S.InputWrapper>
                        <S.StyledInput
                            placeholder={t('enter_your_password')}
                            placeholderTextColor={themeColors.primary}
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <S.IconContainer>
                            <TouchableOpacity onPress={() => setPasswordVisible(v => !v)}>
                                <RenderIcon
                                    family="materialIcons"
                                    icon={passwordVisible ? 'visibility-off' : 'visibility'}
                                    fontSize={28}
                                    color={themeColors.primary}
                                />
                            </TouchableOpacity>
                        </S.IconContainer>
                    </S.InputWrapper>
                </S.InputContainer>

                <S.ActionButton
                    onPress={handleLogin}
                    disabled={!selectedInstitution || !doctorId || !password || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <S.ActionButtonText>{t('login_as_doctor')}</S.ActionButtonText>
                    )}
                </S.ActionButton>

                <S.LinkContainer>
                    <S.LinkText>{t('are_you_a_patient')}</S.LinkText>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <S.Link>
                            {t('login_as_patient')}
                        </S.Link>
                    </TouchableOpacity>
                </S.LinkContainer>

                <LanguageSwitcher />
            </ScrollView>
        </S.Container>
    );
};

export default DoctorLogin; 