import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "./More.module.css";

const options = [
  {
    section: "app_settings",
    content: [
      {
        icon: <LanguageIcon />,
        label: "language",
        onPress: (navigate: any) => navigate("/language-selection"),
      },
      {
        icon: <InfoIcon />,
        label: "device_permissions",
        onPress: () => {
          /* TODO: navigate or open settings */
        },
      },
    ],
  },
  {
    section: "more_info_and_support",
    content: [
      {
        icon: <EmailIcon />,
        label: "email_us",
        onPress: () => (window.location.href = "mailto:support@example.com"),
      },
      {
        icon: <PhoneIcon />,
        label: "call_us",
        onPress: () => (window.location.href = "tel:+1234567890"),
      },
      {
        icon: <LanguageIcon />,
        label: "visit_our_website",
        onPress: () => window.open("https://example.com", "_blank"),
      },
    ],
  },
];

const More: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {options.map((option, idx) => (
        <React.Fragment key={option.section}>
          {idx !== 0 && <div className={styles.sectionDivider} />}
          <h3 className={styles.sectionHeader}>{t(option.section)}</h3>
          {option.content.map((opt) => (
            <button
              key={opt.label}
              className={styles.optionButton}
              onClick={() => opt.onPress(navigate)}
            >
              <div className={styles.optionIconTextWrapper}>
                <span className={styles.icon}>{opt.icon}</span>
                <span className={styles.optionText}>{t(opt.label)}</span>
              </div>
              <div className={styles.optionArrow}>
                {option.section === "more_info_and_support" ? (
                  <OpenInNewIcon className={styles.icon} />
                ) : (
                  <ChevronRightIcon className={styles.icon} />
                )}
              </div>
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default More;
