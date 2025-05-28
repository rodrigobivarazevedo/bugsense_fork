import { NavLink } from "react-router-dom";
import styles from "./HeaderBar.module.css";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import ScanIcon from "@mui/icons-material/CameraAlt";
import ResultsIcon from "@mui/icons-material/Assessment";
import MoreIcon from "@mui/icons-material/MoreHoriz";

const HeaderBar: React.FC<any> = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <NavLink to="/home" className={styles.logoLink}>
        <Logo width={120} height={20} />
      </NavLink>
      <div className={styles.navItem}>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <HomeIcon />
          {t("home")}
        </NavLink>
      </div>
      <div className={styles.navItem}>
        <NavLink
          to="/scan"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <ScanIcon />
          {t("scan")}
        </NavLink>
      </div>
      <div className={styles.navItem}>
        <NavLink
          to="/results"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <ResultsIcon />
          {t("results")}
        </NavLink>
      </div>
      <div className={styles.navItem}>
        <NavLink
          to="/more"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <MoreIcon />
          {t("more")}
        </NavLink>
      </div>
      <div className={styles.iconContainer}>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${styles.iconLink} ${isActive ? styles.active : ""}`
          }
        >
          <NotificationsIcon fontSize="large" className={styles.icon} />
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `${styles.iconLink} ${isActive ? styles.active : ""}`
          }
        >
          <AccountCircleIcon fontSize="large" className={styles.icon} />
        </NavLink>
      </div>
    </nav>
  );
};

export default HeaderBar;
