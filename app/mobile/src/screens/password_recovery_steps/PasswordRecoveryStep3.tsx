import { FC, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import * as S from '../LoginRegister.styles';
import { themeColors } from '../../theme/GlobalTheme';
import Api from '../../api/Client';
import RenderIcon from '../../components/RenderIcon';
import { validatePassword } from '../../utils/ValidatePassword';

type PasswordRecoveryStep3Props = {
    navigation: NativeStackNavigationProp<any>;
};

type RouteParams = {
    email: string;
    token: string;
};

const PasswordRecoveryStep3: FC<PasswordRecoveryStep3Props> = ({ navigation }) => {
    const route = useRoute();
    const { email, token } = route.params as RouteParams;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleNewPasswordChange = (text: string) => {
        setNewPassword(text);
        setPasswordError(validatePassword(t, text, email, ''));
        if (confirmPassword && text !== confirmPassword) {
            setConfirmPasswordError(t('passwords_do_not_match'));
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== newPassword) {
            setConfirmPasswordError(t('passwords_do_not_match'));
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSetNewPassword = async () => {
        if (!newPassword.trim()) {
            Alert.alert(t('Error'), t('please_enter_a_new_password'));
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert(t('Error'), t('please_confirm_your_new_password'));
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert(t('Error'), t('passwords_do_not_match'));
            return;
        }

        if (passwordError) {
            Alert.alert(t('Error'), passwordError);
            return;
        }

        setIsLoading(true);
        try {
            await Api.post('password-recovery/reset/', {
                email,
                token,
                new_password: newPassword,
            });

            Alert.alert(
                t('Success'),
                t('Password reset successful'),
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (err: any) {
            console.error('Password reset error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message ||
                t('failed_to_reset_password');
            Alert.alert(t('Error'), message);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        newPassword.trim() &&
        confirmPassword.trim() &&
        newPassword === confirmPassword &&
        !passwordError &&
        !confirmPasswordError &&
        !isLoading;

    return (
        <S.SafeAreaView>
            <StatusBar backgroundColor={themeColors.secondary} barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <S.ScrollView keyboardShouldPersistTaps="handled">
                    <S.LogoContainer>
                        <S.StepTitle>{t('set_new_password')}</S.StepTitle>
                    </S.LogoContainer>

                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('email_address')}
                                placeholderTextColor={themeColors.primary}
                                value={email}
                                editable={false}
                                style={{ color: themeColors.themeGray }}
                            />
                        </S.InputWrapper>
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('new_password')}
                                placeholderTextColor={themeColors.primary}
                                value={newPassword}
                                onChangeText={handleNewPasswordChange}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                }}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <RenderIcon
                                    family="materialIcons"
                                    icon={showPassword ? 'visibility-off' : 'visibility'}
                                    fontSize={24}
                                    color="primary"
                                />
                            </TouchableOpacity>
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
                                placeholder={t('confirm_new_password')}
                                placeholderTextColor={themeColors.primary}
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                }}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <RenderIcon
                                    family="materialIcons"
                                    icon={showConfirmPassword ? 'visibility-off' : 'visibility'}
                                    fontSize={24}
                                    color="primary"
                                />
                            </TouchableOpacity>
                        </S.InputWrapper>
                        {confirmPasswordError ? (
                            <S.ErrorText>
                                {confirmPasswordError}
                            </S.ErrorText>
                        ) : null}
                    </S.InputContainer>

                    <S.ActionButton onPress={handleSetNewPassword} disabled={!isFormValid}>
                        <S.ActionButtonText>
                            {isLoading ? t('loading') : t('set_new_password')}
                        </S.ActionButtonText>
                    </S.ActionButton>

                    <S.LinkContainer>
                        <S.LinkText>{t('back_to_login')}</S.LinkText>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <S.Link>
                                {t('login')}
                            </S.Link>
                        </TouchableOpacity>
                    </S.LinkContainer>
                </S.ScrollView>
            </KeyboardAvoidingView>
        </S.SafeAreaView>
    );
};

export default PasswordRecoveryStep3;
