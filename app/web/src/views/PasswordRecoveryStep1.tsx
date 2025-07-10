import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import styles from "./Login.module.css";

interface LocationState {
  initialEmail?: string;
}

const PasswordRecoveryStep1 = () => {
  const [email, setEmail] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.initialEmail) {
      setEmail(state.initialEmail);
    }
  }, [location]);

  const handleGetSecurityQuestions = async () => {
    if (!email) {
      setError(t("Email is required"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This would be an API call to get security questions
      // For now, we'll simulate it
      const mockQuestions = [
        { id: 1, question: t("What was your first pet's name?") },
        { id: 2, question: t("In which city were you born?") },
        { id: 3, question: t("What is your mother's maiden name?") },
        { id: 4, question: t("What was the name of your first school?") },
        { id: 5, question: t("What is your favorite childhood memory?") },
      ];
      setSecurityQuestions(mockQuestions);
    } catch (err: any) {
      setError(t("Failed to get security questions"));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedQuestion || !answer) {
      setError(t("Please select a security question and provide an answer"));
      return;
    }

    navigate("/password-recovery-step2", {
      state: { email, questionId: selectedQuestion, answer },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>

      <div className={styles.form}>
        <h2>{t("Get Security Questions")}</h2>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder={t("Email Address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.styledInput}
            />
          </div>
        </div>

        <button
          onClick={handleGetSecurityQuestions}
          disabled={!email || loading}
          className={`${styles.loginButton} ${
            !email || loading ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>
            {loading ? t("Loading...") : t("Get Security Questions")}
          </span>
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {securityQuestions.length > 0 && (
          <>
            <div className={styles.inputContainer}>
              <label className={styles.label}>
                {t("Select a security question")}
              </label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className={styles.styledInput}
              >
                <option value="">{t("Select Security Question")}</option>
                {securityQuestions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.question}
                  </option>
                ))}
              </select>
            </div>

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
              onClick={handleContinue}
              disabled={!selectedQuestion || !answer}
              className={`${styles.loginButton} ${
                !selectedQuestion || !answer ? styles.disabled : ""
              }`}
            >
              <span className={styles.loginButtonText}>{t("Continue")}</span>
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

export default PasswordRecoveryStep1;
