import { FC, useState } from 'react';
import {
    StatusBar,
    Platform,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as S from './LoginRegister.styles';
import { themeColors } from '../theme/GlobalTheme';
import Api from '../api/Client';
import validateEmail from '../utils/ValidateEmail';
import RenderIcon from '../components/RenderIcon';
import { validatePassword } from '../utils/ValidatePassword';
import { securityQuestions, SecurityQuestion } from '../utils/SecurityQuestions';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const Register: FC<RegisterScreenProps> = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [securityQuestionsData, setSecurityQuestionsData] = useState<SecurityQuestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const availableQuestions = securityQuestions(t);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        const { errorMessage } = validateEmail({ email: text });
        setEmailError(errorMessage);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError(validatePassword(t, text, email, fullName));
        if (confirmPassword && text !== confirmPassword) {
            setConfirmPasswordError(t('passwords_do_not_match'));
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== password) {
            setConfirmPasswordError(t('passwords_do_not_match'));
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

    const isStep2Valid = securityQuestionsData.length === 3 &&
        securityQuestionsData.every(q => q.question && q.answer.trim());

    const handleNext = () => {
        if (isStep1Valid) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const addSecurityQuestion = () => {
        if (securityQuestionsData.length < 3) {
            setSecurityQuestionsData([...securityQuestionsData, { question: '', answer: '' }]);
        }
    };

    const removeSecurityQuestion = (index: number) => {
        setSecurityQuestionsData(securityQuestionsData.filter((_, i) => i !== index));
    };

    const updateSecurityQuestion = (index: number, question: string) => {
        const updated = [...securityQuestionsData];
        updated[index] = { ...updated[index], question };
        setSecurityQuestionsData(updated);
    };

    const updateSecurityAnswer = (index: number, answer: string) => {
        const updated = [...securityQuestionsData];
        updated[index] = { ...updated[index], answer };
        setSecurityQuestionsData(updated);
    };

    const handleQuestionSelect = (question: string, index: number) => {
        updateSecurityQuestion(index, question);
        setShowDropdown(false);
        setSelectedQuestionIndex(null);
    };

    const getAvailableQuestionsForIndex = (index: number) => {
        const usedQuestions = securityQuestionsData
            .map((q, i) => i !== index ? q.question : '')
            .filter(q => q);
        return availableQuestions.filter(q => !usedQuestions.includes(q));
    };

    const handleRegister = async () => {
        if (!isStep2Valid) {
            Alert.alert(t('error'), t('please_answer_all_security_questions'));
            return;
        }

        try {
            const payload = {
                email,
                full_name: fullName,
                password,
                security_question_1: securityQuestionsData[0].question,
                security_answer_1: securityQuestionsData[0].answer,
                security_question_2: securityQuestionsData[1].question,
                security_answer_2: securityQuestionsData[1].answer,
                security_question_3: securityQuestionsData[2].question,
                security_answer_3: securityQuestionsData[2].answer,
            };

            const response = await Api.post('register/', payload);

            if (response.data) {
                Alert.alert(
                    t('success'),
                    t('registration_successful_please_login'),
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
            Alert.alert(t('registration_failed'), message);
        }
    };

    const renderStep1 = () => (
        <>
            <S.StepText>{t('Step 1 of 2')}</S.StepText>
            <S.StepTitle>{t('Personal Information')}</S.StepTitle>

            <S.InputContainer>
                <S.InputWrapper>
                    <S.StyledInput
                        placeholder={t('full_name')}
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
                        placeholder={t('email_address')}
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
                        placeholder={t('password')}
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
                        placeholder={t('confirm_password')}
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
            <S.StepTitle>{t('security_questions')}</S.StepTitle>
            <S.NoteText>
                {t('we_need_these_questions_so_we_can_help_you_reset_your_password_if_you_forget_your_password')}
            </S.NoteText>

            {securityQuestionsData.map((question, index) => (
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
                        <S.SelectorRow
                            onPress={() => {
                                setSelectedQuestionIndex(index);
                                setShowDropdown(!showDropdown);
                            }}
                            activeOpacity={0.8}
                        >
                            <S.SelectorText>
                                {question.question || t('select_security_question')}
                            </S.SelectorText>
                            <S.SelectorIcon>▼</S.SelectorIcon>
                        </S.SelectorRow>
                        {showDropdown && selectedQuestionIndex === index && (
                            <S.DropdownContainer>
                                {getAvailableQuestionsForIndex(index).map((q, qIndex) => (
                                    <S.DropdownItem
                                        key={qIndex}
                                        onPress={() => handleQuestionSelect(q, index)}
                                        activeOpacity={0.7}
                                    >
                                        <S.DropdownText>{q}</S.DropdownText>
                                    </S.DropdownItem>
                                ))}
                            </S.DropdownContainer>
                        )}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('your_answer')}
                                placeholderTextColor={themeColors.primary}
                                value={question.answer}
                                onChangeText={(text: string) => updateSecurityAnswer(index, text)}
                                autoCapitalize="words"
                            />
                        </S.InputWrapper>
                    </S.InputContainer>
                </S.SecurityQuestionContainer>
            ))}

            {securityQuestionsData.length < 3 && (
                <S.AddQuestionButton onPress={addSecurityQuestion}>
                    <S.AddQuestionText>{t('add_security_question')}</S.AddQuestionText>
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
                                <S.LinkText>{t('already_have_an_account')}</S.LinkText>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <S.Link>{t('login')}</S.Link>
                                </TouchableOpacity>
                            </S.LinkContainer>

                            <S.LinkContainer>
                                <S.LinkText>{t('are_you_medical_personnel')}</S.LinkText>
                                <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
                                    <S.Link>{t('login_as_doctor')}</S.Link>
                                </TouchableOpacity>
                            </S.LinkContainer>
                        </>
                    )}

                    {currentStep === 1 ? (
                        <S.ActionButton onPress={handleNext} disabled={!isStep1Valid}>
                            <S.ActionButtonText>{t('next')}</S.ActionButtonText>
                        </S.ActionButton>
                    ) : (
                        <S.ButtonRow>
                            <S.SecondaryButton onPress={handleBack}>
                                <S.SecondaryButtonText>{t('back')}</S.SecondaryButtonText>
                            </S.SecondaryButton>
                            <S.ActionButtonRegister
                                onPress={handleRegister}
                                disabled={!isStep2Valid}
                            >
                                <S.ActionButtonText>{t('register')}</S.ActionButtonText>
                            </S.ActionButtonRegister>
                        </S.ButtonRow>
                    )}

                    <LanguageSwitcher />
                </S.ScrollView>
            </KeyboardAvoidingView>
        </S.SafeAreaView>
    );
};

export default Register;
