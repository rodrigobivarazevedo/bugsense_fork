import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./News.module.css";

const News = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.placeholderContainer}>
          <p className={styles.placeholderText}>
            Updates from BugSense coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
