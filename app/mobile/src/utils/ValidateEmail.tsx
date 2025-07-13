import { t } from 'i18next';

interface ValidateEmailProps {
    email: string;
    customInvalidMessage?: string;
    customRequiredMessage?: string;
}

interface ValidateEmailResult {
    isValid: boolean;
    errorMessage: string;
}

export const validateEmail = ({
    email,
    customInvalidMessage,
    customRequiredMessage,
}: ValidateEmailProps): ValidateEmailResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return {
            isValid: false,
            errorMessage: customRequiredMessage || t('email_is_required'),
        };
    }

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            errorMessage: customInvalidMessage || t('please_enter_a_valid_email_address'),
        };
    }

    return {
        isValid: true,
        errorMessage: '',
    };
};

export default validateEmail;
