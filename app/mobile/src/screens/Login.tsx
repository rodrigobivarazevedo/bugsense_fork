import React, { useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
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

    const handleForgotPassword = () => {
        // TODO: Implement forgot password logic
        console.log('Forgot password');
    };

    return (
        <S.Container>
            <S.LogoContainer>
                <Logo />
            </S.LogoContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Username or Email')}
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
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <S.IconContainer>
                        <Ionicons name="finger-print" size={28} color={themeColors.primary} />
                    </S.IconContainer>
                </S.InputWrapper>
            </S.InputContainer>

            <S.ForgotPasswordButton onPress={handleForgotPassword}>
                <S.ForgotPasswordText>{t('Forgot password?')}</S.ForgotPasswordText>
            </S.ForgotPasswordButton>

            <S.ActionButton onPress={handleLogin} disabled={!username || !password}>
                <S.ActionButtonText>{t('Login')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('Don\'t have an account?')}</S.LinkText>
                <S.Link onPress={() => navigation.navigate('Register')}>
                    {t('Register')}
                </S.Link>
            </S.LinkContainer>
        </S.Container>
    );
};

export default Login;
