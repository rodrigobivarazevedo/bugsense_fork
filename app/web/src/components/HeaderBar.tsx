import { NavLink } from "react-router-dom";
import styles from "./HeaderBar.module.css";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HeaderBar: React.FC<any> = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logoLink}>
        <Logo width={120} height={20} />
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        {t("home")}
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        {t("account")}
      </NavLink>
      <NavLink
        to="/scan"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        {t("scan")}
      </NavLink>
      <NavLink
        to="/results"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        {t("results")}
      </NavLink>
      <NavLink
        to="/more"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        {t("more")}
      </NavLink>
      <div className={styles.iconContainer}>
        <NotificationsIcon fontSize="large" className={styles.icon} />
        <AccountCircleIcon fontSize="large" className={styles.icon} />
      </div>
    </nav>
  );
};

export default HeaderBar;
