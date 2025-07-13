import {
    securityQuestions,
    validateSecurityQuestions,
    validateSecurityQuestionsForUpdate,
    formatSecurityQuestionsForAPI,
    hasSecurityQuestionsChanges
} from './SecurityQuestions';

jest.mock('i18next', () => ({
    t: jest.fn((key: string) => key)
}));

describe('SecurityQuestions', () => {
    it('should return list of security questions', () => {
        const questions = securityQuestions(jest.fn((key: string) => key) as any);
        expect(questions).toHaveLength(10);
        expect(questions[0]).toBe('what_was_your_first_pets_name');
    });

    it('should validate complete security questions', () => {
        const questions = {
            security_question_1: 'What is your pet name?',
            security_answer_1: 'Fluffy',
            security_question_2: 'Where were you born?',
            security_answer_2: 'New York',
            security_question_3: 'What is your favorite color?',
            security_answer_3: 'Blue'
        };
        expect(validateSecurityQuestions(questions)).toBe(true);
    });

    it('should reject incomplete security questions', () => {
        const questions = {
            security_question_1: 'What is your pet name?',
            security_answer_1: 'Fluffy',
            security_question_2: 'Where were you born?',
            security_answer_2: '',
            security_question_3: 'What is your favorite color?',
            security_answer_3: 'Blue'
        };
        expect(validateSecurityQuestions(questions)).toBe(false);
    });

    it('should format questions for API', () => {
        const questions = [
            { question: 'What is your pet name?', answer: 'Fluffy' },
            { question: 'Where were you born?', answer: 'New York' },
            { question: 'What is your favorite color?', answer: 'Blue' }
        ];
        const result = formatSecurityQuestionsForAPI(questions);
        expect(result.security_question_1).toBe('What is your pet name?');
        expect(result.security_answer_1).toBe('Fluffy');
    });

    it('should detect changes in security questions', () => {
        const original = {
            security_question_1: 'What is your pet name?',
            security_answer_1: 'Fluffy',
            security_question_2: 'Where were you born?',
            security_answer_2: 'New York',
            security_question_3: 'What is your favorite color?',
            security_answer_3: 'Blue'
        };
        const current = {
            ...original,
            security_answer_1: 'Buddy'
        };
        expect(hasSecurityQuestionsChanges(current, original)).toBe(true);
    });

    it('should validate security questions for update', () => {
        const original = {
            security_question_1: 'What is your pet name?',
            security_answer_1: 'Fluffy',
            security_question_2: 'Where were you born?',
            security_answer_2: 'New York',
            security_question_3: 'What is your favorite color?',
            security_answer_3: 'Blue'
        };
        const current = {
            ...original,
            security_question_1: 'What is your favorite food?',
            security_answer_1: 'Pizza'
        };
        expect(validateSecurityQuestionsForUpdate(current, original)).toBe(true);
    });
}); 