import { t } from 'i18next';

export const validatePassword = (
    pass: string,
    email: string,
    fullName: string
): string => {
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
    if (email && pass.toLowerCase() === email.toLowerCase()) {
        return t('Password cannot be the same as your email');
    }
    if (fullName && pass.toLowerCase() === fullName.toLowerCase()) {
        return t('Password cannot be the same as your name');
    }
    return '';
};
