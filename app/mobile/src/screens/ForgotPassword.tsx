import { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import validateEmail from '../utils/ValidateEmail';

type ForgotPasswordScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const ForgotPassword: FC<ForgotPasswordScreenProps> = ({ navigation }) => {
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

        navigation.navigate('PasswordRecoveryStep1');
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
                        placeholder={t('email_address')}
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
                <S.ActionButtonText>{t('continue')}</S.ActionButtonText>
            </S.ActionButton>

            <S.LinkContainer>
                <S.LinkText>{t('remember_your_password')}</S.LinkText>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <S.Link>
                        {t('login')}
                    </S.Link>
                </TouchableOpacity>
            </S.LinkContainer>
        </S.Container>
    );
};

export default ForgotPassword;
