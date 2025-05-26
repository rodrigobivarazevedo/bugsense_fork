import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";

const Notifications = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <p>THIS IS NOTIFICATIONS</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
