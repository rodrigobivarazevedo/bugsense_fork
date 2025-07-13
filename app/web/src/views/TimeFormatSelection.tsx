import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./TimeFormatSelection.module.css";

const TimeFormatSelection = () => {
  const [currentFormat, setCurrentFormat] = useState<"12" | "24">("12");
  const { t } = useTranslation();

  const timeFormats = [
    { code: "12", name: `${t("12_hour_format")} (AM/PM)` },
    { code: "24", name: t("24_hour_format") },
  ];

  useEffect(() => {
    const storedFormat = localStorage.getItem("timeFormat");
    if (storedFormat === "24" || storedFormat === "12") {
      setCurrentFormat(storedFormat);
    }
  }, []);

  const changeFormat = (format: string) => {
    if (format === "12" || format === "24") {
      localStorage.setItem("timeFormat", format);
      setCurrentFormat(format);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("select_time_format")}</h2>

        <div className={styles.optionsContainer}>
          {timeFormats.map((format) => (
            <button
              key={format.code}
              onClick={() => changeFormat(format.code)}
              className={`${styles.option} ${
                currentFormat === format.code ? styles.selected : ""
              }`}
            >
              <span className={styles.optionText}>{format.name}</span>
              {currentFormat === format.code && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeFormatSelection;
