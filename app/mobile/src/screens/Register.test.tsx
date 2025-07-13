import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Register from './Register';
import Api from '../api/Client';
import validateEmail from '../utils/ValidateEmail';
import { validatePassword } from '../utils/ValidatePassword';
import { securityQuestions } from '../utils/SecurityQuestions';
import { suppressConsoleError, resumeConsoleError } from '../utils/UnitTestUtils';

if (typeof global.setImmediate === 'undefined') {
    (global as any).setImmediate = (callback: Function) => {
        return setTimeout(callback, 0);
    };
}

if (typeof global.clearImmediate === 'undefined') {
    (global as any).clearImmediate = (id: any) => {
        if (typeof id === 'number') {
            clearTimeout(id);
        }
    };
}

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../api/Client', () => ({
    post: jest.fn(),
}));

jest.mock('../utils/ValidateEmail', () => jest.fn());
jest.mock('../utils/ValidatePassword', () => ({
    validatePassword: jest.fn(),
}));

jest.mock('../utils/SecurityQuestions', () => ({
    securityQuestions: jest.fn(),
}));

jest.mock('../components/RenderIcon', () => {
    return function MockRenderIcon({ family, icon, fontSize, color }: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', {
            testID: `icon-${family}-${icon}`,
            style: { fontSize, color }
        }, `${family}-${icon}`);
    };
});

jest.mock('../components/Logo', () => {
    return function MockLogo() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', { testID: 'logo' }, 'Logo');
    };
});

jest.mock('../components/LanguageSwitcher', () => {
    return function MockLanguageSwitcher() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('Text', { testID: 'language-switcher' }, 'LanguageSwitcher');
    };
});

const mockNavigation = {
    navigate: jest.fn(),
};

const mockT = jest.fn((key: string) => key);

const mockSecurityQuestions = [
    'What was your first pet\'s name?',
    'In which city were you born?',
    'What is your mother\'s maiden name?',
    'What was the name of your first school?',
    'What is your favorite childhood memory?',
    'What is your favorite color?',
    'What is your hometown?',
    'What was your first car?',
    'What is your favorite food?',
    'What is your dream job?'
];

describe('Register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
        (securityQuestions as jest.Mock).mockReturnValue(mockSecurityQuestions);
        (validateEmail as jest.Mock).mockReturnValue({ errorMessage: '' });
        (validatePassword as jest.Mock).mockReturnValue('');
        jest.spyOn(Alert, 'alert').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Initial Render', () => {
        it('should render step 1 by default', () => {
            const { getByText, getByPlaceholderText } = render(
                <Register navigation={mockNavigation as any} />
            );

            expect(getByText('Step 1 of 2')).toBeTruthy();
            expect(getByText('Personal Information')).toBeTruthy();
            expect(getByPlaceholderText('full_name')).toBeTruthy();
            expect(getByPlaceholderText('email_address')).toBeTruthy();
            expect(getByPlaceholderText('password')).toBeTruthy();
            expect(getByPlaceholderText('confirm_password')).toBeTruthy();
        });

        it('should render logo and language switcher', () => {
            const { getByTestId } = render(
                <Register navigation={mockNavigation as any} />
            );

            expect(getByTestId('logo')).toBeTruthy();
            expect(getByTestId('language-switcher')).toBeTruthy();
        });

        it('should show navigation links on step 1', () => {
            const { getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            expect(getByText('already_have_an_account')).toBeTruthy();
            expect(getByText('login')).toBeTruthy();
            expect(getByText('are_you_medical_personnel')).toBeTruthy();
            expect(getByText('login_as_doctor')).toBeTruthy();
        });
    });

    describe('Step 1 - Form Validation', () => {
        it('should validate email format', () => {
            (validateEmail as jest.Mock).mockReturnValue({ errorMessage: 'Invalid email format' });

            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const emailInput = getByPlaceholderText('email_address');
            fireEvent.changeText(emailInput, 'invalid-email');

            expect(getByText('Invalid email format')).toBeTruthy();
            expect(validateEmail).toHaveBeenCalledWith({ email: 'invalid-email' });
        });

        it('should validate password strength', () => {
            (validatePassword as jest.Mock).mockReturnValue('Password is too weak');

            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const passwordInput = getByPlaceholderText('password');
            fireEvent.changeText(passwordInput, 'weak');

            expect(getByText('Password is too weak')).toBeTruthy();
            expect(validatePassword).toHaveBeenCalledWith(mockT, 'weak', '', '');
        });

        it('should validate password confirmation match', () => {
            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const passwordInput = getByPlaceholderText('password');
            const confirmPasswordInput = getByPlaceholderText('confirm_password');

            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'different');

            expect(getByText('passwords_do_not_match')).toBeTruthy();
        });

        it('should clear password confirmation error when passwords match', () => {
            const { getByPlaceholderText, queryByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const passwordInput = getByPlaceholderText('password');
            const confirmPasswordInput = getByPlaceholderText('confirm_password');

            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'different');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            expect(queryByText('passwords_do_not_match')).toBeNull();
        });
    });

    describe('Password Visibility Toggle', () => {
        it('should toggle password visibility', () => {
            const { getByPlaceholderText, getAllByTestId, getByTestId } = render(
                <Register navigation={mockNavigation as any} />
            );

            const passwordInput = getByPlaceholderText('password');
            const visibilityButtons = getAllByTestId('icon-materialIcons-visibility');
            const passwordVisibilityButton = visibilityButtons[0];

            expect(passwordInput.props.secureTextEntry).toBe(true);

            fireEvent.press(passwordVisibilityButton);

            expect(getByTestId('icon-materialIcons-visibility-off')).toBeTruthy();
        });

        it('should toggle confirm password visibility', () => {
            const { getByPlaceholderText, getAllByTestId, getByTestId } = render(
                <Register navigation={mockNavigation as any} />
            );

            const confirmPasswordInput = getByPlaceholderText('confirm_password');
            const visibilityButtons = getAllByTestId('icon-materialIcons-visibility');
            const confirmPasswordVisibilityButton = visibilityButtons[1];

            expect(confirmPasswordInput.props.secureTextEntry).toBe(true);

            fireEvent.press(confirmPasswordVisibilityButton);

            expect(getByTestId('icon-materialIcons-visibility-off')).toBeTruthy();
        });
    });

    describe('Step Navigation', () => {
        it('should navigate to step 2 when next button is pressed', () => {
            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const fullNameInput = getByPlaceholderText('full_name');
            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('password');
            const confirmPasswordInput = getByPlaceholderText('confirm_password');

            fireEvent.changeText(fullNameInput, 'John Doe');
            fireEvent.changeText(emailInput, 'john@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            const nextButton = getByText('next');
            fireEvent.press(nextButton);

            expect(getByText('Step 2 of 2')).toBeTruthy();
            expect(getByText('security_questions')).toBeTruthy();
        });

        it('should not navigate to step 2 when form is invalid', () => {
            const { getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const nextButton = getByText('next');
            fireEvent.press(nextButton);

            expect(getByText('Step 1 of 2')).toBeTruthy();
        });

        it('should navigate back to step 1 from step 2', () => {
            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const fullNameInput = getByPlaceholderText('full_name');
            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('password');
            const confirmPasswordInput = getByPlaceholderText('confirm_password');

            fireEvent.changeText(fullNameInput, 'John Doe');
            fireEvent.changeText(emailInput, 'john@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            const nextButton = getByText('next');
            fireEvent.press(nextButton);

            const backButton = getByText('back');
            fireEvent.press(backButton);

            expect(getByText('Step 1 of 2')).toBeTruthy();
        });
    });

    const setupStep2 = () => {
        const renderResult = render(
            <Register navigation={mockNavigation as any} />
        );

        const fullNameInput = renderResult.getByPlaceholderText('full_name');
        const emailInput = renderResult.getByPlaceholderText('email_address');
        const passwordInput = renderResult.getByPlaceholderText('password');
        const confirmPasswordInput = renderResult.getByPlaceholderText('confirm_password');

        fireEvent.changeText(fullNameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password123');

        const nextButton = renderResult.getByText('next');
        fireEvent.press(nextButton);

        return renderResult;
    };

    describe('Step 2 - Security Questions', () => {

        it('should render security questions step', () => {
            const { getByText } = setupStep2();

            expect(getByText('Step 2 of 2')).toBeTruthy();
            expect(getByText('security_questions')).toBeTruthy();
            expect(getByText('we_need_these_questions_so_we_can_help_you_reset_your_password_if_you_forget_your_password')).toBeTruthy();
        });

        it('should show add security question button', () => {
            const { getByText } = setupStep2();

            expect(getByText('add_security_question')).toBeTruthy();
        });

        it('should add security question when button is pressed', () => {
            const { getByText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            expect(getByText('Question 1')).toBeTruthy();
        });

        it('should remove security question when remove button is pressed', () => {
            const { getByText, queryByText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            expect(getByText('Question 1')).toBeTruthy();

            const removeButton = getByText('Remove');
            fireEvent.press(removeButton);

            expect(queryByText('Question 1')).toBeNull();
        });

        it('should show dropdown when question selector is pressed', () => {
            const { getByText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            const questionSelector = getByText('select_security_question');
            fireEvent.press(questionSelector);

            expect(getByText('What was your first pet\'s name?')).toBeTruthy();
        });

        it('should select security question from dropdown', () => {
            const { getByText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            const questionSelector = getByText('select_security_question');
            fireEvent.press(questionSelector);

            const questionOption = getByText('What was your first pet\'s name?');
            fireEvent.press(questionOption);

            expect(getByText('What was your first pet\'s name?')).toBeTruthy();
        });

        it('should update security question answer', () => {
            const { getByText, getByPlaceholderText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            const answerInput = getByPlaceholderText('your_answer');
            fireEvent.changeText(answerInput, 'Fluffy');

            expect(answerInput.props.value).toBe('Fluffy');
        });

        it('should not show duplicate questions in dropdown', () => {
            const { getByText } = setupStep2();

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            const questionSelector = getByText('select_security_question');
            fireEvent.press(questionSelector);

            const questionOption = getByText('What was your first pet\'s name?');
            fireEvent.press(questionOption);

            fireEvent.press(addButton);

            const secondQuestionSelector = getByText('select_security_question');
            fireEvent.press(secondQuestionSelector);

            expect(getByText('In which city were you born?')).toBeTruthy();
        });
    });

    describe('Registration API Call', () => {
        beforeAll(() => {
            suppressConsoleError();
        });

        afterAll(() => {
            resumeConsoleError();
        });

        const setupCompleteForm = () => {
            const renderResult = render(
                <Register navigation={mockNavigation as any} />
            );

            const fullNameInput = renderResult.getByPlaceholderText('full_name');
            const emailInput = renderResult.getByPlaceholderText('email_address');
            const passwordInput = renderResult.getByPlaceholderText('password');
            const confirmPasswordInput = renderResult.getByPlaceholderText('confirm_password');

            fireEvent.changeText(fullNameInput, 'John Doe');
            fireEvent.changeText(emailInput, 'john@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            const nextButton = renderResult.getByText('next');
            fireEvent.press(nextButton);

            for (let i = 0; i < 3; i++) {
                const addButton = renderResult.getByText('add_security_question');
                fireEvent.press(addButton);

                const questionSelector = renderResult.getByText('select_security_question');
                fireEvent.press(questionSelector);

                const questionOption = renderResult.getByText(mockSecurityQuestions[i]);
                fireEvent.press(questionOption);

                const answerInputs = renderResult.getAllByPlaceholderText('your_answer');
                fireEvent.changeText(answerInputs[i], `Answer ${i + 1}`);
            }

            return renderResult;
        };

        it('should call registration API with correct payload', async () => {
            (Api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

            const { getByText } = setupCompleteForm();

            const registerButton = getByText('register');
            await act(async () => {
                fireEvent.press(registerButton);
            });

            await waitFor(() => {
                expect(Api.post).toHaveBeenCalledWith('register/', {
                    email: 'john@example.com',
                    full_name: 'John Doe',
                    password: 'password123',
                    security_question_1: 'What was your first pet\'s name?',
                    security_answer_1: 'Answer 1',
                    security_question_2: 'In which city were you born?',
                    security_answer_2: 'Answer 2',
                    security_question_3: 'What is your mother\'s maiden name?',
                    security_answer_3: 'Answer 3',
                });
            });
        });

        it('should show success alert and navigate to login on successful registration', async () => {
            (Api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

            const { getByText } = setupCompleteForm();

            const registerButton = getByText('register');
            await act(async () => {
                fireEvent.press(registerButton);
            });

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'success',
                    'registration_successful_please_login',
                    [
                        {
                            text: 'OK',
                            onPress: expect.any(Function),
                        },
                    ]
                );
            });

            const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
            const okButton = alertCall[2][0];
            okButton.onPress();

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });

        it('should show error alert on registration failure', async () => {
            const errorMessage = 'Email already exists';
            (Api.post as jest.Mock).mockRejectedValue({
                response: {
                    data: {
                        detail: errorMessage,
                    },
                },
            });

            const { getByText } = setupCompleteForm();

            const registerButton = getByText('register');
            await act(async () => {
                fireEvent.press(registerButton);
            });

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('registration_failed', errorMessage);
            });
        });

        it('should show error alert for non-field errors', async () => {
            const errorMessage = 'Account creation failed';
            (Api.post as jest.Mock).mockRejectedValue({
                response: {
                    data: {
                        non_field_errors: [errorMessage],
                    },
                },
            });

            const { getByText } = setupCompleteForm();

            const registerButton = getByText('register');
            await act(async () => {
                fireEvent.press(registerButton);
            });

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('registration_failed', errorMessage);
            });
        });

        it('should show generic error message when no specific error is provided', async () => {
            const errorMessage = 'Network error';
            (Api.post as jest.Mock).mockRejectedValue({
                message: errorMessage,
            });

            const { getByText } = setupCompleteForm();

            const registerButton = getByText('register');
            await act(async () => {
                fireEvent.press(registerButton);
            });

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('registration_failed', errorMessage);
            });
        });
    });

    describe('Navigation Links', () => {
        it('should navigate to login when login link is pressed', () => {
            const { getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const loginLink = getByText('login');
            fireEvent.press(loginLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });

        it('should navigate to doctor login when doctor login link is pressed', () => {
            const { getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const doctorLoginLink = getByText('login_as_doctor');
            fireEvent.press(doctorLoginLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DoctorLogin');
        });
    });

    describe('Form State Persistence', () => {
        it('should maintain security questions when navigating back', () => {
            const { getByPlaceholderText, getByText } = render(
                <Register navigation={mockNavigation as any} />
            );

            const fullNameInput = getByPlaceholderText('full_name');
            const emailInput = getByPlaceholderText('email_address');
            const passwordInput = getByPlaceholderText('password');
            const confirmPasswordInput = getByPlaceholderText('confirm_password');

            fireEvent.changeText(fullNameInput, 'John Doe');
            fireEvent.changeText(emailInput, 'john@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            const nextButton = getByText('next');
            fireEvent.press(nextButton);

            const addButton = getByText('add_security_question');
            fireEvent.press(addButton);

            const questionSelector = getByText('select_security_question');
            fireEvent.press(questionSelector);

            const questionOption = getByText('What was your first pet\'s name?');
            fireEvent.press(questionOption);

            const answerInput = getByPlaceholderText('your_answer');
            fireEvent.changeText(answerInput, 'Fluffy');

            const backButton = getByText('back');
            fireEvent.press(backButton);

            const nextButton2 = getByText('next');
            fireEvent.press(nextButton2);

            expect(getByText('What was your first pet\'s name?')).toBeTruthy();
            expect(getByPlaceholderText('your_answer').props.value).toBe('Fluffy');
        });
    });
});
