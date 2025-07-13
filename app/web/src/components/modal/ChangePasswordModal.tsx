import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import Api from "../../api/client";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!visible) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setPasswordError("");
      setConfirmError("");
      setLoading(false);
      setSuccessMsg("");
      setErrorMsg("");
    }
  }, [visible]);

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError(validatePassword(text));
    if (confirmPassword && text !== confirmPassword) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text !== newPassword) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const canSave =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    !passwordError &&
    !confirmError;

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await Api.post("change-password/", {
        old_password: currentPassword,
        new_password: newPassword,
      });
      setLoading(false);
      setSuccessMsg("Password changed successfully");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      let message = err.message;
      if (
        err.response?.data?.old_password &&
        Array.isArray(err.response.data.old_password)
      ) {
        message = err.response.data.old_password[0];
      } else if (
        err.response?.data?.non_field_errors &&
        Array.isArray(err.response.data.non_field_errors)
      ) {
        message = err.response.data.non_field_errors[0];
      } else if (err.response?.data) {
        const errorFields = Object.keys(err.response.data);
        if (errorFields.length > 0) {
          const firstField = errorFields[0];
          if (Array.isArray(err.response.data[firstField])) {
            message = err.response.data[firstField][0];
          } else {
            message = err.response.data[firstField];
          }
        }
      }
      setErrorMsg(message);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Change Password</h3>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <div style={{ marginBottom: 16 }}>
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.editableInput}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className={styles.showHideButton}
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            className={styles.editableInput}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className={styles.showHideButton}
          >
            {showNew ? "Hide" : "Show"}
          </button>
          {passwordError && (
            <div className={styles.errorText}>{passwordError}</div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className={styles.editableInput}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className={styles.showHideButton}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
          {confirmError && (
            <div className={styles.errorText}>{confirmError}</div>
          )}
        </div>
        {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}
        {successMsg && <div className={styles.successText}>{successMsg}</div>}
        <button
          className={styles.accountSaveButton}
          onClick={handleSave}
          disabled={!canSave || loading}
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
