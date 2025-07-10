import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import styles from "./Login.module.css";

interface LocationState {
  email?: string;
  questionId?: string;
  answer?: string;
}

const PasswordRecoveryStep2 = () => {
  const [email, setEmail] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.email) setEmail(state.email);
    if (state?.questionId) setQuestionId(state.questionId);
    if (state?.answer) setAnswer(state.answer);
  }, [location]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return t("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      return t("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return t("Password must contain at least one lowercase letter");
    }
    if (!/[^A-Za-z]/.test(password)) {
      return t(
        "Password must contain at least one special character or number"
      );
    }
    return "";
  };

  const handleValidateAnswer = async () => {
    if (!answer) {
      setError(t("Please enter your answer"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This would be an API call to validate the answer
      // For now, we'll simulate success
      setSuccess(true);
    } catch (err: any) {
      setError(t("Failed to validate answer"));
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This would be an API call to set the new password
      // For now, we'll simulate success
      navigate("/login", {
        state: { message: t("Password reset successful") },
      });
    } catch (err: any) {
      setError(t("Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>

      <div className={styles.form}>
        <h2>{t("Validate Answer")}</h2>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={t("Enter your answer")}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={styles.styledInput}
            />
          </div>
        </div>

        <button
          onClick={handleValidateAnswer}
          disabled={!answer || loading}
          className={`${styles.loginButton} ${
            !answer || loading ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>
            {loading ? t("Loading...") : t("Validate Answer")}
          </span>
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {success && (
          <>
            <h3>{t("Set New Password")}</h3>

            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  placeholder={t("Enter new password")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.styledInput}
                />
              </div>
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  placeholder={t("Confirm new password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.styledInput}
                />
              </div>
            </div>

            <button
              onClick={handleSetNewPassword}
              disabled={!newPassword || !confirmPassword || loading}
              className={`${styles.loginButton} ${
                !newPassword || !confirmPassword || loading
                  ? styles.disabled
                  : ""
              }`}
            >
              <span className={styles.loginButtonText}>
                {loading ? t("Loading...") : t("Set New Password")}
              </span>
            </button>
          </>
        )}

        <div className={styles.linkContainer}>
          <span className={styles.linkText}>{t("Back to login?")}</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={styles.linkButton}
          >
            {t("Login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryStep2;
