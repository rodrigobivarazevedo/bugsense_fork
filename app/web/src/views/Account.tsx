import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RenderLottie from "../components/RenderLottie";
import styles from "./Account.module.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface EditableField {
  name: string;
  value: string;
  isEditing: boolean;
}

const Account = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<EditableField[]>([
    { name: t("name"), value: "John Doe", isEditing: false },
    { name: t("gender"), value: "Not Specified", isEditing: false },
    { name: t("dob"), value: "2000-01-01", isEditing: false },
    { name: t("email"), value: "johndoe@example.com", isEditing: false },
    { name: t("phone"), value: "+1234567890", isEditing: false },
    {
      name: t("address"),
      value: "123 Sample Street, Berlin, Germany",
      isEditing: false,
    },
  ]);

  const handleEdit = (index: number) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, isEditing: true } : field
      )
    );
  };

  const handleSave = (index: number) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, isEditing: false } : field
      )
    );
    // TODO: Implement API call to save changes
  };

  const handleCancel = (index: number) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, isEditing: false } : field
      )
    );
  };

  const handleInputChange = (index: number, value: string) => {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const getInputType = (fieldName: string) => {
    switch (fieldName) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "dob":
        return "date";
      default:
        return "text";
    }
  };

  const renderEditableField = (field: EditableField, index: number) => {
    const label = t(field.name.charAt(0).toUpperCase() + field.name.slice(1));

    return (
      <div className={styles.formGroup} key={field.name}>
        <label>
          <strong>{label}:</strong>
        </label>
        <div className={styles.fieldContainer}>
          {field.isEditing ? (
            <>
              <input
                type={getInputType(field.name)}
                value={field.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={styles.input}
              />
              <div className={styles.editActions}>
                <button
                  className={styles.iconButton}
                  onClick={() => handleSave(index)}
                >
                  <SaveIcon />
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => handleCancel(index)}
                >
                  <CancelIcon />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={styles.fieldValue}>{field.value}</span>
              <button
                className={styles.iconButton}
                onClick={() => handleEdit(index)}
              >
                <EditIcon />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.logoOverlay}>
          <RenderLottie
            name="homeHello"
            startFrame={0}
            endFrame={150}
            loop={true}
          />
        </div>
        <div className={styles.profileContent}>
          <div className={styles.avatar}>👤</div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{fields[0].value}</h2>
            <p className={styles.dateJoined}>{t("Joined")} 01.01.2024</p>
            <button className={styles.qrButton}>
              <QrCodeIcon style={{ fontSize: 24, color: "#2E2747" }} />
              <span style={{ marginLeft: 8 }}>{t("View my QR code")}</span>
            </button>
          </div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>{t("Account Details")}</h3>
      <div className={styles.card}>
        {fields
          .slice(0, 3)
          .map((field, index) => renderEditableField(field, index))}
      </div>

      <h3 className={styles.sectionTitle}>{t("Contact")}</h3>
      <div className={styles.card}>
        {fields
          .slice(3)
          .map((field, index) => renderEditableField(field, index + 3))}
      </div>

      <div className={styles.actions}>
        <button className={styles.deleteBtn}>{t("Delete My Account")}</button>
        <button className={styles.actionBtn}>{t("Change Password")}</button>
        <button className={styles.actionBtn}>{t("Sign Out")}</button>
      </div>
    </div>
  );
};

export default Account;

// TODO: Add ability to edit name, gender, DOB, email, phone, address
