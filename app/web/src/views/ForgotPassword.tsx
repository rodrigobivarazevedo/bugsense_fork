import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import styles from "./Login.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, errorMessage: t("Email is required") };
    }
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        errorMessage: t("Please enter a valid email address"),
      };
    }
    return { isValid: true, errorMessage: "" };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const { errorMessage } = validateEmail(value);
    setEmailError(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errorMessage } = validateEmail(email);
    if (!isValid) {
      setEmailError(errorMessage);
      return;
    }

    // Navigate to password recovery step 1
    navigate("/password-recovery-step1", { state: { initialEmail: email } });
  };

  const isFormValid = email && !emailError;

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder={t("Email Address")}
              value={email}
              onChange={handleEmailChange}
              autoCapitalize="none"
              required
              className={styles.styledInput}
            />
          </div>
          {emailError && (
            <div className={styles.errorMessage}>{emailError}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`${styles.loginButton} ${
            !isFormValid ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>{t("Continue")}</span>
        </button>

        <div className={styles.linkContainer}>
          <span className={styles.linkText}>
            {t("Remember your password?")}
          </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={styles.linkButton}
          >
            {t("Login")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
