import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RenderLottie from "../components/RenderLottie";
import styles from "./Account.module.css";
import QrCodeIcon from "@mui/icons-material/QrCode";

const Account = () => {
  const { t } = useTranslation();
  const [userName] = useState<string>("John Doe"); // Hardcoded for frontend-only demo

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
            <h2 className={styles.userName}>{userName}</h2>
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
        <p>
          <strong>{t("Name")}:</strong> {userName}
        </p>
        <p>
          <strong>{t("Gender")}:</strong> Not Specified
        </p>
        <p>
          <strong>{t("DOB")}:</strong> 2000-01-01
        </p>
      </div>

      <h3 className={styles.sectionTitle}>{t("Contact")}</h3>
      <div className={styles.card}>
        <p>
          <strong>{t("Email")}:</strong> johndoe@example.com
        </p>
        <p>
          <strong>{t("Phone")}:</strong> +1234567890
        </p>
        <p>
          <strong>{t("Address")}:</strong> 123 Sample Street, Berlin, Germany
        </p>
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