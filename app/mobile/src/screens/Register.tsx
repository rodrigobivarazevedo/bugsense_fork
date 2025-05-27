import React, { useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import Api from '../api/Client';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { t } = useTranslation();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert(t('Error'), t('Passwords do not match'));
            return;
        }

        try {
            const response = await Api.post('register/', {
                full_name: fullName,
                email,
                password,
            });

            if (response.data) {
                Alert.alert(
                    t('Success'),
                    t('Registration successful! Please login.'),
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            }
        } catch (err: any) {
            console.error('Registration error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('Registration failed'), message);
        }
    };

    const isFormValid = (
        fullName &&
        email &&
        password &&
        confirmPassword &&
        password === confirmPassword
    );

    return (
        <S.Container>
            <S.LogoContainer>
                <Logo />
            </S.LogoContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Full Name')}
                        placeholderTextColor={themeColors.primary}
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                    />
                </S.InputWrapper>
            </S.InputContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Email Address')}
                        placeholderTextColor={themeColors.primary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </S.InputWrapper>
            </S.InputContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Password')}
                        placeholderTextColor={themeColors.primary}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </S.InputWrapper>
            </S.InputContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Confirm Password')}
                        placeholderTextColor={themeColors.primary}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </S.InputWrapper>
            </S.InputContainer>

            <S.ActionButton onPress={handleRegister} disabled={!isFormValid}>
                <S.ActionButtonText>{t('Register')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('Already have an account?')}</S.LinkText>
                <S.Link onPress={() => navigation.navigate('Login')}>
                    {t('Login')}
                </S.Link>
            </S.LinkContainer>
        </S.Container>
    );
};

export default Register;
