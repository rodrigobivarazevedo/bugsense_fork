import { FC, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import RenderIcon from '../components/RenderIcon';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const UserLogin: FC<LoginScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { t } = useTranslation();

    const handleLogin = async () => {
        try {
            const response = await Api.post('login/', {
                email: username,
                password: password,
            });

            const { access, refresh, user } = response.data;

            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('userType', 'patient');

            console.log('Login attempted with:', { username });
            navigation.navigate('Main', { screen: 'Home' });
        } catch (err: any) {
            console.error('Login error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('login_failed'), message);
        }
    };

    return (
        <S.Container>
            <S.LogoContainer>
                <Logo />
            </S.LogoContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('email_address')}
                        placeholderTextColor={themeColors.primary}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </S.InputWrapper>
            </S.InputContainer>

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
                        <TouchableOpacity>
                            <RenderIcon
                                family="ionIcons"
                                icon="finger-print"
                                fontSize={28}
                                color={themeColors.primary}
                            />
                        </TouchableOpacity>
                    </S.IconContainer>
                </S.InputWrapper>
            </S.InputContainer>

            <S.ForgotPasswordButton>
                <TouchableOpacity onPress={() => navigation.navigate('PasswordRecoveryStep1', { initialEmail: username })}>
                    <S.ForgotPasswordText>
                        {t('forgot_password')}
                    </S.ForgotPasswordText>
                </TouchableOpacity>
            </S.ForgotPasswordButton>

            <S.ActionButton onPress={handleLogin} disabled={!username || !password}>
                <S.ActionButtonText>{t('login')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('dont_have_an_account')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <S.Link>
                        {t('register')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>

            <S.LinkContainer>
                <S.LinkText>{t('are_you_medical_personnel')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
                    <S.Link>
                        {t('login_as_doctor')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>

            <LanguageSwitcher />
        </S.Container>
    );
};

export default UserLogin;
