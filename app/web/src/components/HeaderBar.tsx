import { NavLink } from "react-router-dom";
import styles from "./HeaderBar.module.css";
import { useTranslation } from "react-i18next";

const HeaderBar: React.FC<any> = ({ navigation, route }) => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
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
    </nav>
  );
};

export default HeaderBar;
