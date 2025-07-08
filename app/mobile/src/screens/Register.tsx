import { FC, useState } from 'react';
import {
    StatusBar,
    Platform,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import Api from '../api/Client';
import validateEmail from '../utils/ValidateEmail';
import RenderIcon from '../components/RenderIcon';
import { validatePassword } from '../utils/ValidatePassword';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

interface SecurityQuestion {
    question: string;
    answer: string;
}

const Register: FC<RegisterScreenProps> = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const availableQuestions = [
        t("What was your first pet's name?"),
        t("In which city were you born?"),
        t("What is your mother's maiden name?"),
        t("What was the name of your first school?"),
        t("What is your favorite childhood memory?")
    ];

    const handleEmailChange = (text: string) => {
        setEmail(text);
        const { errorMessage } = validateEmail({ email: text });
        setEmailError(errorMessage);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError(validatePassword(text, email, fullName));
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

    const isStep1Valid = (
        fullName &&
        email &&
        password &&
        confirmPassword &&
        password === confirmPassword &&
        !passwordError &&
        !confirmPasswordError &&
        !emailError
    );

    const isStep2Valid = securityQuestions.length === 3 &&
        securityQuestions.every(q => q.question && q.answer.trim());

    const handleNext = () => {
        if (isStep1Valid) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const addSecurityQuestion = () => {
        if (securityQuestions.length < 3) {
            setSecurityQuestions([...securityQuestions, { question: '', answer: '' }]);
        }
    };

    const removeSecurityQuestion = (index: number) => {
        setSecurityQuestions(securityQuestions.filter((_, i) => i !== index));
    };

    const updateSecurityQuestion = (index: number, question: string) => {
        const updated = [...securityQuestions];
        updated[index] = { ...updated[index], question };
        setSecurityQuestions(updated);
    };

    const updateSecurityAnswer = (index: number, answer: string) => {
        const updated = [...securityQuestions];
        updated[index] = { ...updated[index], answer };
        setSecurityQuestions(updated);
    };

    const handleQuestionSelect = (question: string, index: number) => {
        updateSecurityQuestion(index, question);
        setShowDropdown(false);
        setSelectedQuestionIndex(null);
    };

    const getAvailableQuestionsForIndex = (index: number) => {
        const usedQuestions = securityQuestions
            .map((q, i) => i !== index ? q.question : '')
            .filter(q => q);
        return availableQuestions.filter(q => !usedQuestions.includes(q));
    };

    const handleRegister = async () => {
        if (!isStep2Valid) {
            Alert.alert(t('Error'), t('Please answer all security questions'));
            return;
        }

        try {
            const payload = {
                email,
                full_name: fullName,
                password,
                security_question_1: securityQuestions[0].question,
                security_answer_1: securityQuestions[0].answer,
                security_question_2: securityQuestions[1].question,
                security_answer_2: securityQuestions[1].answer,
                security_question_3: securityQuestions[2].question,
                security_answer_3: securityQuestions[2].answer,
            };

            const response = await Api.post('register/', payload);

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

    const renderStep1 = () => (
        <>
            <S.StepText>{t('Step 1 of 2')}</S.StepText>
            <S.StepTitle>{t('Personal Information')}</S.StepTitle>

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
                {emailError ? <S.ErrorText>{emailError}</S.ErrorText> : null}
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
                    <S.IconContainer>
                        <TouchableOpacity onPress={() => setPasswordVisible(v => !v)}>
                            <RenderIcon
                                family="materialIcons"
                                icon={passwordVisible ? 'visibility-off' : 'visibility'}
                                fontSize={28}
                                color={themeColors.primary}
                            />
                        </TouchableOpacity>
                    </S.IconContainer>
                </S.InputWrapper>
                {passwordError ? <S.ErrorText>{passwordError}</S.ErrorText> : null}
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
                    <S.IconContainer>
                        <TouchableOpacity onPress={() => setConfirmPasswordVisible(v => !v)}>
                            <RenderIcon
                                family="materialIcons"
                                icon={confirmPasswordVisible ? 'visibility-off' : 'visibility'}
                                fontSize={28}
                                color={themeColors.primary}
                            />
                        </TouchableOpacity>
                    </S.IconContainer>
                </S.InputWrapper>
                {confirmPasswordError ? <S.ErrorText>{confirmPasswordError}</S.ErrorText> : null}
            </S.InputContainer>
        </>
    );

    const renderStep2 = () => (
        <>
            <S.StepText>{t('Step 2 of 2')}</S.StepText>
            <S.StepTitle>{t('Security Questions')}</S.StepTitle>

            {securityQuestions.map((question, index) => (
                <S.SecurityQuestionContainer key={index}>
                    <S.SecurityQuestionHeader>
                        <S.SecurityQuestionNumber>
                            {t('Question')} {index + 1}
                        </S.SecurityQuestionNumber>
                        <S.RemoveButton onPress={() => removeSecurityQuestion(index)}>
                            <S.RemoveButtonText>{t('Remove')}</S.RemoveButtonText>
                        </S.RemoveButton>
                    </S.SecurityQuestionHeader>

                    <S.InputContainer>
                        <S.DropdownButton
                            onPress={() => {
                                setSelectedQuestionIndex(index);
                                setShowDropdown(!showDropdown);
                            }}
                        >
                            <S.DropdownButtonText>
                                {question.question || t('Select Security Question')}
                            </S.DropdownButtonText>
                            <S.DropdownArrow>▼</S.DropdownArrow>
                        </S.DropdownButton>
                        {showDropdown && selectedQuestionIndex === index && (
                            <S.DropdownContainer>
                                {getAvailableQuestionsForIndex(index).map((q, qIndex) => (
                                    <TouchableOpacity
                                        key={qIndex}
                                        onPress={() => handleQuestionSelect(q, index)}
                                    >
                                        <S.DropdownItem>
                                            <S.DropdownText>{q}</S.DropdownText>
                                        </S.DropdownItem>
                                    </TouchableOpacity>
                                ))}
                            </S.DropdownContainer>
                        )}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('Your Answer')}
                                placeholderTextColor={themeColors.primary}
                                value={question.answer}
                                onChangeText={(text: string) => updateSecurityAnswer(index, text)}
                                autoCapitalize="words"
                            />
                        </S.InputWrapper>
                    </S.InputContainer>
                </S.SecurityQuestionContainer>
            ))}

            {securityQuestions.length < 3 && (
                <S.AddQuestionButton onPress={addSecurityQuestion}>
                    <S.AddQuestionText>{t('Add Security Question')}</S.AddQuestionText>
                </S.AddQuestionButton>
            )}
        </>
    );

    return (
        <S.SafeAreaView>
            <StatusBar backgroundColor={themeColors.secondary} barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <S.ScrollView keyboardShouldPersistTaps="handled">
                    <S.LogoRegisterPageContainer>
                        <Logo />
                    </S.LogoRegisterPageContainer>

                    {currentStep === 1 ? renderStep1() : renderStep2()}

                    {currentStep === 1 && (
                        <>
                            <S.LinkContainer>
                                <S.LinkText>{t('Already have an account?')}</S.LinkText>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <S.Link>{t('Login')}</S.Link>
                                </TouchableOpacity>
                            </S.LinkContainer>

                            <S.LinkContainer>
                                <S.LinkText>{t('Are you medical personnel?')}</S.LinkText>
                                <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
                                    <S.Link>{t('Login as Doctor')}</S.Link>
                                </TouchableOpacity>
                            </S.LinkContainer>
                        </>
                    )}

                    {currentStep === 1 ? (
                        <S.ActionButton onPress={handleNext} disabled={!isStep1Valid}>
                            <S.ActionButtonText>{t('Next')}</S.ActionButtonText>
                        </S.ActionButton>
                    ) : (
                        <S.ButtonRow>
                            <S.SecondaryButton onPress={handleBack}>
                                <S.SecondaryButtonText>{t('Back')}</S.SecondaryButtonText>
                            </S.SecondaryButton>
                            <S.ActionButtonRegister
                                onPress={handleRegister}
                                disabled={!isStep2Valid}
                            >
                                <S.ActionButtonText>{t('Register')}</S.ActionButtonText>
                            </S.ActionButtonRegister>
                        </S.ButtonRow>
                    )}
                </S.ScrollView>
            </KeyboardAvoidingView>
        </S.SafeAreaView>
    );
};

export default Register;
