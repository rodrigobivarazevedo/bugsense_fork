import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import Api from '../api/Client';
import validateEmail from '../utils/ValidateEmail';
import RenderIcon from '../components/RenderIcon';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const Register: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const { t } = useTranslation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        const { errorMessage } = validateEmail({ email: text });
        setEmailError(errorMessage);
    };

    const validatePassword = (pass: string): string => {
        if (pass.length < 8) {
            return t('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(pass)) {
            return t('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(pass)) {
            return t('Password must contain at least one lowercase letter');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass) && !/[0-9]/.test(pass)) {
            return t('Password must contain at least one special character or number');
        }
        if (pass.toLowerCase() === email.toLowerCase() || pass.toLowerCase() === fullName.toLowerCase()) {
            return t('Password cannot be the same as your email or name');
        }
        return '';
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError(validatePassword(text));
        if (confirmPassword && text !== confirmPassword) {
            setConfirmPasswordError(t('Passwords do not match'));
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== password) {
            setConfirmPasswordError(t('Passwords do not match'));
        } else {
            setConfirmPasswordError('');
        }
    };

    // TODO: Review this with backend
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert(t('Error'), t('Passwords do not match'));
            return;
        }

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            Alert.alert(t('Invalid Password'), passwordValidationError);
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
        password === confirmPassword &&
        !passwordError &&
        !confirmPasswordError &&
        !emailError
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

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Password')}
                        placeholderTextColor={themeColors.primary}
                        secureTextEntry={!passwordVisible}
                        value={password}
                        onChangeText={handlePasswordChange}
                    />
                    <S.IconContainer onPress={() => setPasswordVisible(v => !v)}>
                        <RenderIcon
                            family="materialIcons"
                            icon={passwordVisible ? 'visibility-off' : 'visibility'}
                            fontSize={28}
                            color={themeColors.primary}
                        />
                    </S.IconContainer>
                </S.InputWrapper>
                {passwordError ? (
                    <S.ErrorText>
                        {passwordError}
                    </S.ErrorText>
                ) : null}
            </S.InputContainer>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('Confirm Password')}
                        placeholderTextColor={themeColors.primary}
                        secureTextEntry={!confirmPasswordVisible}
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                    />
                    <S.IconContainer onPress={() => setConfirmPasswordVisible(v => !v)}>
                        <RenderIcon
                            family="materialIcons"
                            icon={confirmPasswordVisible ? 'visibility-off' : 'visibility'}
                            fontSize={28}
                            color={themeColors.primary}
                        />
                    </S.IconContainer>
                </S.InputWrapper>
                {confirmPasswordError ? (
                    <S.ErrorText>
                        {confirmPasswordError}
                    </S.ErrorText>
                ) : null}
            </S.InputContainer>

            <S.ActionButton onPress={handleRegister} disabled={!isFormValid}>
                <S.ActionButtonText>{t('Register')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('Already have an account?')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <S.Link>
                        {t('Login')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>
        </S.Container>
    );
};

export default Register;
