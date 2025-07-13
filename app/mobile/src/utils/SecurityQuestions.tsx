import { TFunction } from "i18next";

export const securityQuestions = (t: TFunction) => {
    return [
        t("what_was_your_first_pets_name"),
        t("in_which_city_were_you_born"),
        t("what_is_your_mothers_maiden_name"),
        t("what_was_the_name_of_your_first_school"),
        t("what_is_your_favorite_childhood_memory"),
        t("what_is_your_favorite_color"),
        t("what_is_your_hometown"),
        t("what_was_your_first_car"),
        t("what_is_your_favorite_food"),
        t("what_is_your_dream_job")
    ];
};

export interface SecurityQuestion {
    question: string;
    answer: string;
}

export interface SecurityQuestionsData {
    security_question_1: string;
    security_answer_1: string;
    security_question_2: string;
    security_answer_2: string;
    security_question_3: string;
    security_answer_3: string;
}

export const validateSecurityQuestions = (questions: SecurityQuestionsData): boolean => {
    return !!(
        questions.security_question_1 &&
        questions.security_answer_1 &&
        questions.security_question_2 &&
        questions.security_answer_2 &&
        questions.security_question_3 &&
        questions.security_answer_3
    );
};

export const validateSecurityQuestionsForUpdate = (
    questions: SecurityQuestionsData,
    originalQuestions: SecurityQuestionsData
): boolean => {
    const hasExistingQuestions = !!(
        originalQuestions.security_question_1 ||
        originalQuestions.security_question_2 ||
        originalQuestions.security_question_3
    );

    if (!hasExistingQuestions) {
        return validateSecurityQuestions(questions);
    }

    const changedQuestions = [];

    if (questions.security_question_1 !== originalQuestions.security_question_1) {
        changedQuestions.push({ question: questions.security_question_1, answer: questions.security_answer_1 });
    }
    if (questions.security_question_2 !== originalQuestions.security_question_2) {
        changedQuestions.push({ question: questions.security_question_2, answer: questions.security_answer_2 });
    }
    if (questions.security_question_3 !== originalQuestions.security_question_3) {
        changedQuestions.push({ question: questions.security_question_3, answer: questions.security_answer_3 });
    }

    if (changedQuestions.length === 0) {
        return true;
    }

    return changedQuestions.every(q => q.question && q.answer);
};

export const getAvailableQuestionsForIndex = (
    questions: SecurityQuestionsData,
    questionIndex: number,
    allQuestions: string[]
): string[] => {
    const usedQuestions = [
        questions.security_question_1,
        questions.security_question_2,
        questions.security_question_3
    ].filter((q, index) => index !== questionIndex - 1 && q);

    return allQuestions.filter(q => !usedQuestions.includes(q));
};

export const hasSecurityQuestionsChanges = (
    current: SecurityQuestionsData,
    original: SecurityQuestionsData
): boolean => {
    return (
        current.security_question_1 !== original.security_question_1 ||
        current.security_answer_1 !== original.security_answer_1 ||
        current.security_question_2 !== original.security_question_2 ||
        current.security_answer_2 !== original.security_answer_2 ||
        current.security_question_3 !== original.security_question_3 ||
        current.security_answer_3 !== original.security_answer_3
    );
};

export const formatSecurityQuestionsForAPI = (questions: SecurityQuestion[]): SecurityQuestionsData => {
    return {
        security_question_1: questions[0]?.question || '',
        security_answer_1: questions[0]?.answer || '',
        security_question_2: questions[1]?.question || '',
        security_answer_2: questions[1]?.answer || '',
        security_question_3: questions[2]?.question || '',
        security_answer_3: questions[2]?.answer || ''
    };
};
