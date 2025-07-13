import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Api from "../api/client";
import { useNavigate } from "react-router-dom";
import {
  securityQuestions,
  SecurityQuestion,
} from "../utils/SecurityQuestions";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [securityQuestionsData, setSecurityQuestionsData] = useState<
    SecurityQuestion[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableQuestions = securityQuestions(t);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedQuestionIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateEmail = (value: string) => {
    if (!value) return t("Email is required");

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
      return t("Invalid email address");
    return "";
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8)
      return t("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(pass))
      return t("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(pass))
      return t("Password must contain at least one lowercase letter");
    if (!/[!@#$%^&*(),.?":{}|<>0-9]/.test(pass))
      return t(
        "Password must contain at least one special character or number"
      );
    if (
      pass.toLowerCase() === email.toLowerCase() ||
      pass.toLowerCase() === fullName.toLowerCase()
    )
      return t("Password cannot be the same as your email or name");
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
    if (confirmPassword && e.target.value !== confirmPassword) {
      setConfirmPasswordError(t("Passwords do not match"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError(t("Passwords do not match"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const isStep1Valid =
    fullName &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    !passwordError &&
    !confirmPasswordError &&
    !emailError;

  const isStep2Valid =
    securityQuestionsData.length === 3 &&
    securityQuestionsData.every((q) => q.question && q.answer.trim());

  const handleNext = () => {
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const addSecurityQuestion = () => {
    if (securityQuestionsData.length < 3) {
      setSecurityQuestionsData([
        ...securityQuestionsData,
        { question: "", answer: "" },
      ]);
    }
  };

  const removeSecurityQuestion = (index: number) => {
    setSecurityQuestionsData(
      securityQuestionsData.filter((_, i) => i !== index)
    );
  };

  const updateSecurityQuestion = (index: number, question: string) => {
    const updated = [...securityQuestionsData];
    updated[index] = { ...updated[index], question };
    setSecurityQuestionsData(updated);
  };

  const updateSecurityAnswer = (index: number, answer: string) => {
    const updated = [...securityQuestionsData];
    updated[index] = { ...updated[index], answer };
    setSecurityQuestionsData(updated);
  };

  const handleQuestionSelect = (question: string, index: number) => {
    updateSecurityQuestion(index, question);
    setShowDropdown(false);
    setSelectedQuestionIndex(null);
  };

  const getAvailableQuestionsForIndex = (index: number) => {
    const usedQuestions = securityQuestionsData
      .map((q, i) => (i !== index ? q.question : ""))
      .filter((q) => q);
    const available = availableQuestions.filter(
      (q) => !usedQuestions.includes(q)
    );
    return available.length > 0 ? available : availableQuestions;
  };

  const toggleDropdown = (index: number) => {
    if (selectedQuestionIndex === index && showDropdown) {
      setShowDropdown(false);
      setSelectedQuestionIndex(null);
    } else {
      setSelectedQuestionIndex(index);
      setShowDropdown(true);
    }
  };

  const handleRegister = async () => {
    if (!isStep2Valid) {
      setError(t("Please answer all security questions"));
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const payload = {
        email,
        full_name: fullName,
        password,
        security_question_1: securityQuestionsData[0].question,
        security_answer_1: securityQuestionsData[0].answer,
        security_question_2: securityQuestionsData[1].question,
        security_answer_2: securityQuestionsData[1].answer,
        security_question_3: securityQuestionsData[2].question,
        security_answer_3: securityQuestionsData[2].answer,
      };

      const response = await Api.post("register/", payload);

      if (response.data) {
        setSuccess(t("Registration successful! Please login."));
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message;
      setError(message || t("Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => navigate("/login");
  const goToDoctorLogin = () => navigate("/doctor-login");

  const renderStep1 = () => (
    <>
      <div className={styles.stepText}>{t("Step 1 of 2")}</div>
      <div className={styles.stepTitle}>{t("Personal Information")}</div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder={t("Full Name")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoCapitalize="words"
            required
            className={styles.styledInput}
          />
        </div>
      </div>

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
        {emailError && <div className={styles.errorMessage}>{emailError}</div>}
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("Password")}
            value={password}
            onChange={handlePasswordChange}
            required
            className={styles.styledInput}
          />
          <div
            className={styles.iconContainer}
            onClick={() => setShowPassword((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" style={{ color: "#2E2747" }} />
            ) : (
              <Visibility fontSize="small" style={{ color: "#2E2747" }} />
            )}
          </div>
        </div>
        {passwordError && (
          <div className={styles.errorMessage}>{passwordError}</div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("Confirm Password")}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className={styles.styledInput}
          />
          <div
            className={styles.iconContainer}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            {showConfirmPassword ? (
              <VisibilityOff fontSize="small" style={{ color: "#2E2747" }} />
            ) : (
              <Visibility fontSize="small" style={{ color: "#2E2747" }} />
            )}
          </div>
        </div>
        {confirmPasswordError && (
          <div className={styles.errorMessage}>{confirmPasswordError}</div>
        )}
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className={styles.stepText}>{t("Step 2 of 2")}</div>
      <div className={styles.stepTitle}>{t("Security Questions")}</div>
      <div className={styles.noteText}>
        {t(
          "We need these questions so we can help you reset your password if you forget your password"
        )}
      </div>

      {securityQuestionsData.map((question, index) => (
        <div key={index} className={styles.securityQuestionContainer}>
          <div className={styles.securityQuestionHeader}>
            <div className={styles.securityQuestionNumber}>
              {t("Question")} {index + 1}
            </div>
            <button
              type="button"
              onClick={() => removeSecurityQuestion(index)}
              className={styles.removeButton}
            >
              {t("Remove")}
            </button>
          </div>

          <div className={styles.inputContainer}>
            <div
              className={styles.selectorRow}
              onClick={() => toggleDropdown(index)}
            >
              <div className={styles.selectorText}>
                {question.question || t("Select Security Question")}
              </div>
              <div className={styles.selectorIcon}>▼</div>
            </div>
            {showDropdown && selectedQuestionIndex === index && (
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                {getAvailableQuestionsForIndex(index).map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className={styles.dropdownItem}
                    onClick={() => handleQuestionSelect(q, index)}
                  >
                    <div className={styles.dropdownText}>{q}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder={t("Your Answer")}
                value={question.answer}
                onChange={(e) => updateSecurityAnswer(index, e.target.value)}
                autoCapitalize="words"
                className={styles.styledInput}
              />
            </div>
          </div>
        </div>
      ))}

      {securityQuestionsData.length < 3 && (
        <button
          type="button"
          onClick={addSecurityQuestion}
          className={styles.addQuestionButton}
        >
          {t("Add Security Question")}
        </button>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 1) {
            handleNext();
          } else {
            handleRegister();
          }
        }}
        className={styles.form}
      >
        {currentStep === 1 ? renderStep1() : renderStep2()}

        {currentStep === 1 && (
          <>
            <div className={styles.linkContainer}>
              <span className={styles.linkText}>
                {t("Already have an account?")}
              </span>
              <button
                type="button"
                onClick={goToLogin}
                className={styles.linkButton}
              >
                {t("Login")}
              </button>
            </div>
            <div className={styles.linkContainer}>
              <span className={styles.linkText}>
                {t("Are you medical personnel?")}
              </span>
              <button
                type="button"
                onClick={goToDoctorLogin}
                className={styles.linkButton}
              >
                {t("Login as Doctor")}
              </button>
            </div>
          </>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {currentStep === 1 ? (
          <button
            type="submit"
            disabled={!isStep1Valid}
            className={`${styles.loginButton} ${
              !isStep1Valid ? styles.disabled : ""
            }`}
          >
            <span className={styles.loginButtonText}>{t("Next")}</span>
          </button>
        ) : (
          <div className={styles.buttonRow}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.secondaryButton}
            >
              <span className={styles.secondaryButtonText}>{t("Back")}</span>
            </button>
            <button
              type="submit"
              disabled={!isStep2Valid || isLoading}
              className={`${styles.loginButton} ${
                !isStep2Valid || isLoading ? styles.disabled : ""
              }`}
            >
              <span className={styles.loginButtonText}>
                {isLoading ? t("Registering...") : t("Register")}
              </span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
