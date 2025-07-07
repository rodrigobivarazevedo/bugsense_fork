import React from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import styles from "./LanguageSelection.module.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
];

const LanguageSelection: React.FC = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();

  const handleSelect = (code: string) => {
    if (code !== currentLang) {
      i18n.changeLanguage(code);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/more")}
        aria-label={t("back")}
      >
        <ArrowBackIcon />
      </button>
      <h2 className={styles.header}>{t("select_language")}</h2>
      <div className={styles.list}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className={
              styles.langButton +
              (currentLang === lang.code ? " " + styles.selected : "")
            }
            onClick={() => handleSelect(lang.code)}
          >
            <span className={styles.langLabel}>{lang.label}</span>
            {currentLang === lang.code && (
              <CheckIcon className={styles.checkIcon} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelection;
