import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import Api from "../api/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDateTimeGerman } from "../utils/DateTimeFormatter";

interface NotificationItem {
  id: number;
  qr_data: string;
  created_at: string;
  result_status: string;
  patient?: {
    full_name: string;
    id: string;
    dob: string;
  };
}

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("patient");

  useEffect(() => {
    setUserType(localStorage.getItem("userType") || "patient");
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Api.get("qr-codes/list/");
        const readyTests = response.data.filter(
          (test: NotificationItem) => test.result_status === "ready"
        );
        setNotifications(readyTests);
      } catch (err: any) {
        setError(t("Failed to load notifications."));
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [t]);

  const handleNotificationClick = (notification: NotificationItem) => {
    navigate("/view-test", { state: { test: notification } });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <span
            className="material-icons"
            style={{ fontSize: 40, color: "#888", marginBottom: 8 }}
          >
            notifications
          </span>
          <span>{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>{error}</span>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noNotificationsContainer}>
          <span className={styles.noNotificationsText}>
            {t("You do not have any new notifications")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        {notifications.map((item) => (
          <div
            key={item.id}
            className={styles.notificationItem}
            tabIndex={0}
            role="button"
            onClick={() => handleNotificationClick(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                handleNotificationClick(item);
            }}
            aria-label={t("View test result notification")}
          >
            <div className={styles.notificationHeader}>
              <span className={styles.notificationTitle}>
                {t("Test Result Ready")}
              </span>
              <span className={styles.notificationTime}>
                {formatDateTimeGerman(item.created_at)}
              </span>
            </div>
            <div className={styles.notificationMessage}>
              {t(
                "Your test result is now ready. Tap to view the detailed results."
              )}
            </div>
            {userType === "doctor" && item.patient && (
              <div className={styles.notificationPatient}>
                <span className={styles.notificationPatientText}>
                  {t("Patient")}: {item.patient.full_name || "N/A"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
