import { TFunction } from 'i18next';

export const validatePassword = (
    t: TFunction,
    pass: string,
    email?: string,
    fullName?: string
): string => {
    if (pass.length < 8) {
        return t('password_must_be_at_least_8_characters_long');
    }
    if (!/[A-Z]/.test(pass)) {
        return t('password_must_contain_at_least_one_uppercase_letter');
    }
    if (!/[a-z]/.test(pass)) {
        return t('password_must_contain_at_least_one_lowercase_letter');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass) && !/[0-9]/.test(pass)) {
        return t('password_must_contain_at_least_one_special_character_or_number');
    }
    if (email && pass.toLowerCase() === email.toLowerCase()) {
        return t('password_cannot_be_the_same_as_your_email');
    }
    if (fullName && pass.toLowerCase() === fullName.toLowerCase()) {
        return t('password_cannot_be_the_same_as_your_name');
    }
    return '';
};
