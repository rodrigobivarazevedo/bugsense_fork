import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";

const Results = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <p>THIS IS RESULTS</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
