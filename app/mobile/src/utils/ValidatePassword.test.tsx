import { validatePassword } from './ValidatePassword';

describe('ValidatePassword', () => {
    const mockT = jest.fn((key: string) => key) as any;

    it('should validate correct password', () => {
        const result = validatePassword(mockT, 'ValidPass123!');
        expect(result).toBe('');
    });

    it('should reject invalid passwords', () => {
        expect(validatePassword(mockT, 'short')).toBe('password_must_be_at_least_8_characters_long');
        expect(validatePassword(mockT, 'validpass123!')).toBe('password_must_contain_at_least_one_uppercase_letter');
        expect(validatePassword(mockT, 'VALIDPASS123!')).toBe('password_must_contain_at_least_one_lowercase_letter');
    });
}); 