let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;

/**
 * Suppresses console.error messages
 * Call this before actions that will trigger expected console errors
 */
export const suppressConsoleError = (): void => {
    if (!originalConsoleError) {
        originalConsoleError = console.error;
    }
    console.error = jest.fn();
};

/**
 * Suppresses console.warn messages
 * Call this before actions that will trigger expected console warnings
 */
export const suppressConsoleWarn = (): void => {
    if (!originalConsoleWarn) {
        originalConsoleWarn = console.warn;
    }
    console.warn = jest.fn();
};

/**
 * Suppresses both console.error and console.warn messages
 * Call this before actions that will trigger expected console errors or warnings
 */
export const suppressConsoleLogs = (): void => {
    suppressConsoleError();
    suppressConsoleWarn();
};

/**
 * Resumes console.error messages
 * Call this after actions that triggered console errors to restore normal logging
 */
export const resumeConsoleError = (): void => {
    if (originalConsoleError) {
        console.error = originalConsoleError;
    }
};

/**
 * Resumes console.warn messages
 * Call this after actions that triggered console warnings to restore normal logging
 */
export const resumeConsoleWarn = (): void => {
    if (originalConsoleWarn) {
        console.warn = originalConsoleWarn;
    }
};

/**
 * Resumes both console.error and console.warn messages
 * Call this after actions that triggered console errors or warnings to restore normal logging
 */
export const resumeConsoleLogs = (): void => {
    resumeConsoleError();
    resumeConsoleWarn();
};

/**
 * Executes a function with suppressed console logs and then resumes them
 * @param fn - Function to execute with suppressed logs
 * @returns Promise that resolves with the result of the function
 */
export const withSuppressedLogs = async (fn: () => any | Promise<any>): Promise<any> => {
    suppressConsoleLogs();
    try {
        const result = await fn();
        return result;
    } finally {
        resumeConsoleLogs();
    }
};

/**
 * Executes a function with suppressed console errors and then resumes them
 * @param fn - Function to execute with suppressed errors
 * @returns Promise that resolves with the result of the function
 */
export const withSuppressedErrors = async (fn: () => any | Promise<any>): Promise<any> => {
    suppressConsoleError();
    try {
        const result = await fn();
        return result;
    } finally {
        resumeConsoleError();
    }
};

/**
 * Executes a function with suppressed console warnings and then resumes them
 * @param fn - Function to execute with suppressed warnings
 * @returns Promise that resolves with the result of the function
 */
export const withSuppressedWarnings = async (fn: () => any | Promise<any>): Promise<any> => {
    suppressConsoleWarn();
    try {
        const result = await fn();
        return result;
    } finally {
        resumeConsoleWarn();
    }
};
