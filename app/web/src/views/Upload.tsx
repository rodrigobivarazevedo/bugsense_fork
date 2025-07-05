import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";

const Scan = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <p>THIS IS SCAN</p>
        </div>
      </div>
    </div>
  );
};

export default Scan;
