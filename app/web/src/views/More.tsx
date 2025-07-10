import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WebIcon from "@mui/icons-material/Public";
import styles from "./More.module.css";
import companyInfo from "../utils/companyInfo.json";
import Api from "../api/client";

const TIME_FORMAT_KEY = "timeFormat";

type OptionItem = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void | Promise<void>;
  extra?: string;
  admin?: boolean;
};

type OptionSection = {
  section: string;
  content: OptionItem[];
};

const More: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userType, setUserType] = useState<string>("patient");
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");

  useEffect(() => {
    // Fetch user type from API
    Api.get("users/me/")
      .then((res) => {
        setUserType(res.data.is_doctor ? "doctor" : "patient");
      })
      .catch(() => setUserType("patient"));
    // Get time format from localStorage
    const tf = localStorage.getItem(TIME_FORMAT_KEY);
    if (tf === "24" || tf === "12") setTimeFormat(tf);
  }, []);

  const patientOptions: OptionSection[] = [
    {
      section: "app_settings",
      content: [
        {
          icon: <LanguageIcon className={styles.icon} />,
          label: "language",
          onPress: () => navigate("/language-selection"),
        },
        {
          icon: <AccessTimeIcon className={styles.icon} />,
          label: "time_format",
          extra:
            timeFormat === "24" ? t("24_hour_format") : t("12_hour_format"),
          onPress: () => navigate("/time-format-selection"),
        },
        {
          icon: <InfoIcon className={styles.icon} />,
          label: "device_permissions",
          onPress: () => {},
        },
      ],
    },
    {
      section: "more_info_and_support",
      content: [
        {
          icon: <EmailIcon className={styles.icon} />,
          label: "email_us",
          onPress: () => {
            window.location.href = `mailto:${companyInfo.email}`;
          },
        },
        {
          icon: <PhoneIcon className={styles.icon} />,
          label: "call_us",
          onPress: () => {
            window.location.href = `tel:${companyInfo.phone}`;
          },
        },
        {
          icon: <WebIcon className={styles.icon} />,
          label: "visit_our_website",
          onPress: () => {
            window.open(companyInfo.website, "_blank");
          },
        },
      ],
    },
  ];

  const doctorOptions: OptionSection[] = [
    {
      section: "app_settings",
      content: [
        {
          icon: <LanguageIcon className={styles.icon} />,
          label: "language",
          onPress: () => navigate("/language-selection"),
        },
        {
          icon: <AccessTimeIcon className={styles.icon} />,
          label: "time_format",
          extra:
            timeFormat === "24" ? t("24_hour_format") : t("12_hour_format"),
          onPress: () => navigate("/time-format-selection"),
        },
        {
          icon: <InfoIcon className={styles.icon} />,
          label: "device_permissions",
          onPress: () => {},
        },
      ],
    },
    {
      section: "more_info_and_support",
      content: [
        {
          icon: (
            <AdminPanelSettingsIcon
              className={styles.icon + " " + styles.adminOption}
            />
          ),
          label: "Contact Admin",
          onPress: () => {
            window.location.href = `mailto:${companyInfo.adminEmail}`;
          },
          admin: true,
        },
      ],
    },
  ];

  const options = userType === "doctor" ? doctorOptions : patientOptions;

  return (
    <div className={styles.container}>
      {options.map((option, idx) => (
        <React.Fragment key={option.section}>
          {idx !== 0 && <div className={styles.sectionDivider} />}
          <div className={styles.sectionHeader}>{t(option.section)}</div>
          {option.content.map((opt) => (
            <button
              key={opt.label}
              className={
                styles.optionButton +
                (opt.admin ? " " + styles.adminOption : "")
              }
              onClick={opt.onPress}
            >
              <div className={styles.optionIconTextWrapper}>
                <span className={styles.icon}>{opt.icon}</span>
                <span className={styles.optionText}>
                  {t(opt.label)}
                  {opt.extra && (
                    <span className={styles.optionExtra}>({opt.extra})</span>
                  )}
                </span>
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
