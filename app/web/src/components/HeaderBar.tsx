import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./HeaderBar.module.css";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/CameraAlt";
import ResultsIcon from "@mui/icons-material/Assessment";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";

const HeaderBar: React.FC<any> = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [userType, setUserType] = useState<string>("patient");
  const location = useLocation();

  useEffect(() => {
    setUserType(localStorage.getItem("userType") || "patient");
  }, [location.pathname]);

  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const doctorNavLinks = (
    <>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("home") ?? "home")}
      >
        <HomeIcon />
        {t("home")}
      </NavLink>
      <NavLink
        to="/patients"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("patients") ?? "patients")}
      >
        <PeopleIcon />
        {t("patients")}
      </NavLink>
      <NavLink
        to="/more"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("more") ?? "more")}
      >
        <MoreIcon />
        {t("more")}
      </NavLink>
    </>
  );

  const patientNavLinks = (
    <>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("home") ?? "home")}
      >
        <HomeIcon />
        {t("home")}
      </NavLink>
      <NavLink
        to="/upload"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("upload") ?? "upload")}
      >
        <UploadIcon />
        {t("upload")}
      </NavLink>
      <NavLink
        to="/tests"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("tests") ?? "tests")}
      >
        <ResultsIcon />
        {t("tests")}
      </NavLink>
      <NavLink
        to="/more"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("more") ?? "more")}
      >
        <MoreIcon />
        {t("more")}
      </NavLink>
    </>
  );

  const iconLinks = (
    <>
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `${styles.iconLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("notifications") ?? "notifications")}
      >
        <NotificationsIcon fontSize="large" className={styles.icon} />
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `${styles.iconLink} ${isActive ? styles.active : ""}`
        }
        onClick={closeMenu}
        aria-label={String(t("account") ?? "account")}
      >
        <AccountCircleIcon fontSize="large" className={styles.icon} />
      </NavLink>
    </>
  );

  const centerNavLinks =
    userType === "doctor" ? doctorNavLinks : patientNavLinks;

  return (
    <>
      <nav className={styles.nav}>
        {isTablet && (
          <button className={styles.hamburger} onClick={toggleMenu}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        )}
        <NavLink to="/home" className={styles.logoLink}>
          <Logo width={120} height={20} />
        </NavLink>
        {!isTablet && (
          <>
            <div className={styles.centerNav}>{centerNavLinks}</div>
            <div className={styles.iconContainer}>{iconLinks}</div>
          </>
        )}
      </nav>

      {isTablet && (
        <>
          <div
            className={`${styles.overlay} ${menuOpen ? styles.show : ""}`}
            onClick={closeMenu}
          ></div>
          <div
            className={`${styles.collapseMenu} ${menuOpen ? styles.open : ""}`}
          >
            {centerNavLinks}
          </div>
        </>
      )}

      {isTablet && <div className={styles.floatingIcons}>{iconLinks}</div>}
    </>
  );
};

export default HeaderBar;
