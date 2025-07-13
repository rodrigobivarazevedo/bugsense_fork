import { FC, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import Logo from '../../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import * as S from '../LoginRegister.styles';
import { themeColors } from '../../theme/GlobalTheme';
import Api from '../../api/Client';
import validateEmail from '../../utils/ValidateEmail';

type PasswordRecoveryStep1Props = {
    navigation: NativeStackNavigationProp<any>;
};

type RouteParams = {
    initialEmail?: string;
};

const PasswordRecoveryStep1: FC<PasswordRecoveryStep1Props> = ({ navigation }) => {
    const route = useRoute();
    const { initialEmail } = (route.params || {}) as RouteParams;
    const [email, setEmail] = useState(initialEmail || '');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    useEffect(() => {
        if (email && !emailError && initialEmail) {
            handleGetSecurityQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, initialEmail]);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        const { errorMessage } = validateEmail({ email: text });
        setEmailError(errorMessage);
    };

    const handleGetSecurityQuestions = async () => {
        const { isValid, errorMessage } = validateEmail({ email });
        if (!isValid) {
            setEmailError(errorMessage);
            return;
        }

        setIsLoading(true);
        try {
            const response = await Api.post('password-recovery/questions/', {
                email: email.toLowerCase(),
            });

            const { questions } = response.data;
            const hasQuestions = questions.some((question: string) => question && question.trim() !== '');
            if (!hasQuestions) {
                Alert.alert(
                    t('error'),
                    t('no_security_questions_set_contact_admin'),
                    [
                        {
                            text: t('ok'),
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
                return;
            }
            navigation.navigate('PasswordRecoveryStep2', {
                email: email.toLowerCase(),
                questions,
            });
        } catch (err: any) {
            console.error('Get security questions error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message ||
                t('failed_to_get_security_questions');
            Alert.alert(t('error'), message);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && !emailError && !isLoading;

    return (
        <S.SafeAreaView>
            <StatusBar backgroundColor={themeColors.secondary} barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <S.ScrollView keyboardShouldPersistTaps="handled">
                    <S.LogoContainer>
                        <Logo />
                    </S.LogoContainer>
                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('email_address')}
                                placeholderTextColor={themeColors.primary}
                                value={email}
                                onChangeText={handleEmailChange}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!initialEmail && !isLoading}
                            />
                        </S.InputWrapper>
                        {emailError ? (
                            <S.ErrorText>
                                {emailError}
                            </S.ErrorText>
                        ) : null}
                    </S.InputContainer>
                    <S.ActionButton onPress={handleGetSecurityQuestions} disabled={!isFormValid || !!initialEmail}>
                        <S.ActionButtonText>
                            {isLoading ? t('loading') : t('get_security_questions')}
                        </S.ActionButtonText>
                    </S.ActionButton>
                    <S.LinkContainer>
                        <S.LinkText>{t('remember_your_password')}</S.LinkText>
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

export default PasswordRecoveryStep1;
