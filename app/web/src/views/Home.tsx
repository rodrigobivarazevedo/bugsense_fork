import React, { useState, useEffect, FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Api from "../api/client";
import { getTimeBasedGreeting } from "../utils/DateTimeFormatter";

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
  { key: "overviews", label: "Overviews", route: "/overview" },
  { key: "discover", label: "Discover", route: "/discover" },
  { key: "news", label: "News", route: "/news" },
  { key: "contactUs", label: "Contact Us" },
];

const Home: FC = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<string>("patient");
  const navigate = useNavigate();

  useEffect(() => {
    Api.get("users/me/")
      .then((res) => setUserName(res.data.full_name))
      .catch((err) => setUserName(""));
    setUserType(localStorage.getItem("userType") || "patient");
  }, []);

  const handleBoxClick = (key: string, route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  const filteredGridItems = GRID_ITEMS.filter((item) => {
    if (userType === "doctor") {
      return item.key !== "contactUs" && item.key !== "news";
    }
    return true;
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <p className={styles.greeting}>{t(getTimeBasedGreeting())}</p>
            <h1 className={styles.userName}>{userName}</h1>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredGridItems.map((item) => (
          <div
            className={styles.box}
            key={item.key}
            onClick={() => handleBoxClick(item.key, item.route)}
            style={item.route ? { cursor: "pointer" } : {}}
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
