import React, { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

// MUI Icons
import ChecklistIcon from "@mui/icons-material/Checklist";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import EmailIcon from "@mui/icons-material/Email";

const ICON_MAP: Record<string, React.ReactElement> = {
  overviews: <ChecklistIcon fontSize="large" color="inherit" />,
  discover: <LightbulbIcon fontSize="large" color="inherit" />,
  news: <NewspaperIcon fontSize="large" color="inherit" />,
  contactUs: <EmailIcon fontSize="large" color="inherit" />,
};

const GRID_ITEMS = [
  { key: "overviews", label: "Overviews" },
  { key: "discover", label: "Discover" },
  { key: "news", label: "News" },
  { key: "contactUs", label: "Contact Us" },
];

const Home: FC = () => {
  const { t } = useTranslation();
  const [userName] = useState<string>("John Doe"); // Static for demo
  const navigate = useNavigate();

  const handleBoxClick = (key: string) => {
    if (key === "discover") navigate("/discover");
    // Add more navigation logic for other boxes if needed
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <p className={styles.greeting}>{t("hello")}</p>
            <h1 className={styles.userName}>{userName}</h1>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {GRID_ITEMS.map((item) => (
          <div
            className={styles.box}
            key={item.key}
            onClick={() => handleBoxClick(item.key)}
            style={item.key === "discover" ? { cursor: "pointer" } : {}}
          >
            <div className={styles.boxIcon}>{ICON_MAP[item.key]}</div>
            <p className={styles.boxLabel}>{t(item.label)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
