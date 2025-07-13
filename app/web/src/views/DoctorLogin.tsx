import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Login.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Api from "../api/client";
import { useNavigate } from "react-router-dom";

interface Institution {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const DoctorLogin = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchInstitutions = React.useCallback(async () => {
    try {
      setInstitutionsLoading(true);
      const response = await Api.get("institutions/");
      setInstitutions(response.data);
    } catch (err: any) {
      setError(t("Failed to load institutions. Please try again."));
    } finally {
      setInstitutionsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchInstitutions();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("." + styles.inputWrapper)) {
        setShowInstitutionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [fetchInstitutions]);

  const handleLogin = async () => {
    if (!selectedInstitution) {
      setError(t("Please select an institution"));
      return;
    }
    if (!doctorId || !password) {
      setError(t("Please fill in all fields"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await Api.post("doctor-login/", {
        institution_id: selectedInstitution.id,
        doctor_id: doctorId,
        password: password,
      });
      const { access, refresh, doctor } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(doctor));
      localStorage.setItem("userType", "doctor");
      navigate("/home");
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message;
      setError(message || t("Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const goToPatientLogin = () => {
    navigate("/login");
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
        {/* Institution Dropdown */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper} style={{ position: "relative" }}>
            <input
              type="text"
              placeholder={t("Select Institution")}
              value={selectedInstitution?.name || ""}
              readOnly
              onClick={() => setShowInstitutionDropdown((v) => !v)}
              className={styles.styledInput}
              style={{ cursor: "pointer", background: "#ece6ff" }}
            />
            <div
              className={styles.iconContainer}
              onClick={() => setShowInstitutionDropdown((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: 22, color: "#2E2747" }}>
                {showInstitutionDropdown ? "▲" : "▼"}
              </span>
            </div>
            {showInstitutionDropdown && !institutionsLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ece6ff",
                  borderRadius: 8,
                  zIndex: 10,
                  maxHeight: 180,
                  overflowY: "auto",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {institutions.map((inst) => (
                  <div
                    key={inst.id}
                    style={{ padding: "0.75rem 1rem", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedInstitution(inst);
                      setShowInstitutionDropdown(false);
                    }}
                  >
                    {inst.name}
                  </div>
                ))}
              </div>
            )}
            {institutionsLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  padding: 8,
                  borderRadius: 8,
                  zIndex: 10,
                  color: "#2E2747",
                }}
              >
                {t("Loading institutions...")}
              </div>
            )}
          </div>
        </div>
        {/* Doctor ID */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={t("Doctor ID")}
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              autoCapitalize="none"
              required
              className={styles.styledInput}
            />
          </div>
        </div>
        {/* Password */}
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
              onClick={() => setShowPassword((v) => !v)}
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
          type="submit"
          disabled={!selectedInstitution || !doctorId || !password || loading}
          className={`${styles.loginButton} ${
            !selectedInstitution || !doctorId || !password || loading
              ? styles.disabled
              : ""
          }`}
        >
          <span className={styles.loginButtonText}>
            {loading ? t("Logging in...") : t("Login as Doctor")}
          </span>
        </button>
        <div className={styles.linkContainer}>
          <span className={styles.linkText}>{t("Are you a patient?")}</span>
          <button
            type="button"
            onClick={goToPatientLogin}
            className={styles.linkButton}
          >
            {t("Login as Patient")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorLogin;
