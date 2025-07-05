import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import RenderIcon from '../components/RenderIcon';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api/Client';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
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
            navigation.navigate('Home');
        } catch (err: any) {
            console.error('Login error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('Login failed'), message); // TODO: Add error handling
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
                        placeholder={t('Email Address')}
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
                        placeholder={t('Enter your password')}
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
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <S.ForgotPasswordText>
                        {t('Forgot password?')}
                    </S.ForgotPasswordText>
                </TouchableOpacity>
            </S.ForgotPasswordButton>

            <S.ActionButton onPress={handleLogin} disabled={!username || !password}>
                <S.ActionButtonText>{t('Login')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('Don\'t have an account?')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <S.Link>
                        {t('Register')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>

            <S.LinkContainer>
                <S.LinkText>{t('Are you medical personnel?')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
                    <S.Link>
                        {t('Login as Doctor')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>
        </S.Container>
    );
};

export default Login;
