interface EmailValidationResult {
  isValid: boolean;
  errorMessage: string;
}

const validateEmail = ({ email }: { email: string }): EmailValidationResult => {
  if (!email) {
    return {
      isValid: false,
      errorMessage: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid email address",
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  };
};

export default validateEmail;
