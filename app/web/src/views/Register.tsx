import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Api from "../api/client";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    if (!fullName || !email || !password || !confirmPassword) {
      setError(t("Please fill in all fields"));
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t("Passwords do not match"));
      return;
    }
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }
    const passErr = validatePassword(password);
    if (passErr) {
      setPasswordError(passErr);
      return;
    }
    setIsLoading(true);
    try {
      const response = await Api.post("register/", {
        full_name: fullName,
        email,
        password,
      });
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

  const isFormValid =
    !!fullName &&
    !!email &&
    !!password &&
    !!confirmPassword &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    password === confirmPassword;

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
        className={styles.form}
      >
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
          {emailError && (
            <div className={styles.errorMessage}>{emailError}</div>
          )}
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
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`${styles.loginButton} ${
            !isFormValid || isLoading ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>
            {isLoading ? t("Registering...") : t("Register")}
          </span>
        </button>
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
      </form>
    </div>
  );
};

export default Register;
