import { FC, useState } from 'react';
import { Alert, TouchableOpacity, Modal, View, Text, Pressable, Platform, KeyboardAvoidingView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import * as S from '../LoginRegister.styles';
import { themeColors } from '../../theme/GlobalTheme';
import Api from '../../api/Client';
import RenderIcon from '../../components/RenderIcon';

type PasswordRecoveryStep2Props = {
    navigation: NativeStackNavigationProp<any>;
};

type RouteParams = {
    email: string;
    questions: string[];
};

const PasswordRecoveryStep2: FC<PasswordRecoveryStep2Props> = ({ navigation }) => {
    const route = useRoute();
    const { email, questions } = route.params as RouteParams;
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { t } = useTranslation();

    const handleValidateAnswer = async () => {
        if (selectedQuestionIndex === null) {
            Alert.alert(t('error'), t('please_select_a_security_question'));
            return;
        }
        if (!answer.trim()) {
            Alert.alert(t('error'), t('please_enter_your_answer'));
            return;
        }
        setIsLoading(true);
        try {
            const response = await Api.post('password-recovery/validate/', {
                email,
                question_number: selectedQuestionIndex + 1, // API expects 1-based index
                answer: answer.trim(),
            });
            const { token } = response.data;
            navigation.navigate('PasswordRecoveryStep3', {
                email,
                token,
            });
        } catch (err: any) {
            console.error('Validate answer error', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                err.message ||
                t('failed_to_validate_answer');
            Alert.alert(t('error'), message);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = selectedQuestionIndex !== null && answer.trim() && !isLoading;

    return (
        <S.SafeAreaView>
            <StatusBar backgroundColor={themeColors.secondary} barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <S.ScrollView keyboardShouldPersistTaps="handled">
                    <S.LogoContainer>
                        <S.StepTitle>{t('select_a_security_question')}</S.StepTitle>
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
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => setDropdownVisible(true)}
                                disabled={isLoading}
                            >
                                <S.StyledInput
                                    placeholder={t('select_a_security_question')}
                                    placeholderTextColor={themeColors.primary}
                                    value={selectedQuestionIndex !== null ? questions[selectedQuestionIndex] : ''}
                                    editable={false}
                                    style={{ color: themeColors.primary }}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                }}
                                onPress={() => setDropdownVisible(true)}
                                disabled={isLoading}
                            >
                                <RenderIcon
                                    family="materialIcons"
                                    icon="keyboard-arrow-down"
                                    fontSize={24}
                                    color="primary"
                                />
                            </TouchableOpacity>
                        </S.InputWrapper>
                        <Modal
                            visible={dropdownVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setDropdownVisible(false)}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                <View style={{ backgroundColor: 'white', borderRadius: 8, minWidth: 280, padding: 16 }}>
                                    {questions.map((q, idx) => (
                                        <Pressable
                                            key={idx}
                                            onPress={() => {
                                                setSelectedQuestionIndex(idx);
                                                setDropdownVisible(false);
                                            }}
                                            style={{ paddingVertical: 12 }}
                                        >
                                            <Text style={{ color: themeColors.primary, fontSize: 16 }}>{q}</Text>
                                        </Pressable>
                                    ))}
                                    <Pressable onPress={() => setDropdownVisible(false)} style={{ marginTop: 8 }}>
                                        <Text style={{ color: themeColors.themeGray, textAlign: 'center' }}>{t('cancel')}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </S.InputContainer>
                    <S.InputContainer>
                        <S.InputWrapper>
                            <S.StyledInput
                                placeholder={t('enter_your_answer')}
                                placeholderTextColor={themeColors.primary}
                                value={answer}
                                onChangeText={setAnswer}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        </S.InputWrapper>
                    </S.InputContainer>
                    <S.ActionButton onPress={handleValidateAnswer} disabled={!isFormValid}>
                        <S.ActionButtonText>
                            {isLoading ? t('loading') : t('validate_answer')}
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

export default PasswordRecoveryStep2;
