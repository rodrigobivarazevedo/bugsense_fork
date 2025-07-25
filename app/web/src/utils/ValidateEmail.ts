import { useTranslation } from "react-i18next";

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
      errorMessage: customRequiredMessage || "Email is required",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage:
        customInvalidMessage || "Please enter a valid email address",
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  };
};

export default validateEmail;
