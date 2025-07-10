export const validatePassword = (
  t: (key: string) => string,
  password: string,
  email: string = "",
  fullName: string = ""
): string => {
  if (!password) {
    return t("Password is required");
  }

  if (password.length < 8) {
    return t("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    return t("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    return t("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    return t("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return t("Password must contain at least one special character");
  }

  // Check if password contains email
  if (
    email &&
    password.toLowerCase().includes(email.toLowerCase().split("@")[0])
  ) {
    return t("Password cannot contain your email address");
  }

  // Check if password contains full name
  if (fullName) {
    const nameParts = fullName.toLowerCase().split(" ");
    for (const part of nameParts) {
      if (part.length > 2 && password.toLowerCase().includes(part)) {
        return t("Password cannot contain your name");
      }
    }
  }

  return "";
};
