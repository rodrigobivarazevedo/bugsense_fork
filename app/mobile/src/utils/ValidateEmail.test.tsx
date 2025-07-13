import validateEmail from './ValidateEmail';

jest.mock('i18next', () => ({
    t: jest.fn((key: string) => key)
}));

describe('ValidateEmail', () => {
    it('should validate correct email addresses', () => {
        const result = validateEmail({ email: 'test@example.com' });
        expect(result.isValid).toBe(true);
        expect(result.errorMessage).toBe('');
    });

    it('should reject invalid email addresses', () => {
        const result = validateEmail({ email: 'invalid-email' });
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe('please_enter_a_valid_email_address');
    });

    it('should reject empty email', () => {
        const result = validateEmail({ email: '' });
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe('email_is_required');
    });

    it('should use custom error messages', () => {
        const result = validateEmail({
            email: '',
            customRequiredMessage: 'Custom required message'
        });
        expect(result.errorMessage).toBe('Custom required message');
    });
}); 