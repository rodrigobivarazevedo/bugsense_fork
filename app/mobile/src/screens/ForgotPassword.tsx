import React, { useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import Api from '../api/Client';
import validateEmail from '../utils/ValidateEmail';

type ForgotPasswordScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const { t } = useTranslation();

    const handleEmailChange = (text: string) => {
        setEmail(text);
        const { errorMessage } = validateEmail({ email: text });
        setEmailError(errorMessage);
    };

    const handleSubmit = async () => {
        const { isValid, errorMessage } = validateEmail({ email });
        if (!isValid) {
            setEmailError(errorMessage);
            return;
        }

        try {
            await Api.post('password-reset/', {
                email,
            });

            Alert.alert(
                t('Success'),
                t('If an account exists with this email, you will receive password reset instructions.'),
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (err: any) {
            console.error('Password reset request error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message;
            Alert.alert(t('Error'), message);
        }
    };

    const isFormValid = email && !emailError;

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
                        value={email}
                        onChangeText={handleEmailChange}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </S.InputWrapper>
                {emailError ? (
                    <S.ErrorText>
                        {emailError}
                    </S.ErrorText>
                ) : null}
            </S.InputContainer>

            <S.ActionButton onPress={handleSubmit} disabled={!isFormValid}>
                <S.ActionButtonText>{t('Reset Password')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('Remember your password?')}</S.LinkText>
                <S.Link onPress={() => navigation.navigate('Login')}>
                    {t('Login')}
                </S.Link>
            </S.LinkContainer>
        </S.Container>
    );
};

export default ForgotPassword;
