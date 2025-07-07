import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Api from "../api/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError(t("Please enter both email and password"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await Api.post("login/", {
        email: username,
        password: password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", "patient");

      console.log("Login successful:", { username, user });
      navigate("/home");
    } catch (err: any) {
      console.error("Login error", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message;

      if (err.response?.status >= 500) {
        setError(t("Server error. Please try again later."));
      } else {
        setError(message || t("Login failed. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToDoctorLogin = () => {
    navigate("/doctor-login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Logo width={180} height={42} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className={styles.form}
      >
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={t("Email Address")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              required
              className={styles.styledInput}
            />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("Enter your password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button
          type="button"
          onClick={handleForgotPassword}
          className={styles.forgotPasswordButton}
        >
          <span className={styles.forgotPasswordText}>
            {t("Forgot password?")}
          </span>
        </button>

        <button
          type="submit"
          disabled={!username || !password || isLoading}
          className={`${styles.loginButton} ${
            !username || !password || isLoading ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>
            {isLoading ? t("Logging in...") : t("Login")}
          </span>
        </button>

        <div className={styles.linkContainer}>
          <span className={styles.linkText}>{t("Don't have an account?")}</span>
          <button type="button" onClick={goToRegister} className={styles.linkButton}>
            {t("Register")}
          </button>
        </div>

        <div className={styles.linkContainer}>
          <span className={styles.linkText}>{t("Are you medical personnel?")}</span>
          <button type="button" onClick={goToDoctorLogin} className={styles.linkButton}>
            {t("Login as Doctor")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
