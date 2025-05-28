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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Simulate successful login
      console.log("Login attempted with:", { username });
      navigate("/home");
    } catch (err) {
      console.error("Login error", err);
      alert("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");
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
              placeholder={t("Username or Email")}
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
        <button
          type="button"
          onClick={handleForgotPassword}
          className={styles.forgotPasswordButton}
        >
          <span className={styles.forgotPasswordText}>
            {t("Password forgotten?")}
          </span>
        </button>
        <button
          type="submit"
          disabled={!username || !password}
          className={`${styles.loginButton} ${
            !username || !password ? styles.disabled : ""
          }`}
        >
          <span className={styles.loginButtonText}>{t("Login")}</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
