import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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

const HeaderBar: React.FC<any> = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  const navLinks = (
    <>
      <NavLink to="/home" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <HomeIcon />
        {t("home")}
      </NavLink>
      <NavLink to="/upload" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <UploadIcon />
        {t("upload")}
      </NavLink>
      <NavLink to="/results" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <ResultsIcon />
        {t("results")}
      </NavLink>
      <NavLink to="/more" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <MoreIcon />
        {t("more")}
      </NavLink>
      <NavLink to="/notifications" className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <NotificationsIcon fontSize="large" className={styles.icon} />
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => `${styles.iconLink} ${isActive ? styles.active : ""}`} onClick={closeMenu}>
        <AccountCircleIcon fontSize="large" className={styles.icon} />
      </NavLink>
    </>
  );

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
            <div className={styles.navItem}>{navLinks}</div>
          </>
        )}
      </nav>

      {isTablet && (
        <>
          <div className={`${styles.overlay} ${menuOpen ? styles.show : ""}`} onClick={closeMenu}></div>
          <div className={`${styles.collapseMenu} ${menuOpen ? styles.open : ""}`}>
            {navLinks}
          </div>
        </>
      )}
    </>
  );
};

export default HeaderBar;
