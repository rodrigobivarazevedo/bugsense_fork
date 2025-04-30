import React, { useState } from 'react';
import Logo from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './Login.styles';
import { themeColors } from '../theme/GlobalTheme';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();

    const handleLogin = () => {
        // TODO: Implement login logic
        console.log('Login attempted with:', { username, password });
        navigation.navigate('Home');
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
                <S.ForgotPasswordText>{t('Password forgotten?')}</S.ForgotPasswordText>
            </S.ForgotPasswordButton>

            <S.LoginButton onPress={handleLogin} disabled={!username || !password}>
                <S.LoginButtonText>{t('Login')}</S.LoginButtonText>
            </S.LoginButton>
        </S.Container>
    );
};

export default Login;
