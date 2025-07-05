import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import i18n from "./translations/18n";
import Home from "./views/Home";
import Account from "./views/Account";
import HeaderBar from "./components/HeaderBar";
import Root from "./root/Root";
import Scan from "./views/Upload";
import Results from "./views/Results";
import More from "./views/More";
import Notifications from "./views/Notifications";
import Login from "./views/Login";
import Discover from "./views/Discover";
import BacteriaRouter from "./views/BacteriaRouter";
import Register from "./views/Register";
import DoctorLogin from "./views/DoctorLogin";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const AppRoutes = () => {
  const location = useLocation();
  const authed = isAuthenticated();

  // Redirect logic for root and login
  if (
    !authed &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/doctor-login"
  ) {
    return <Navigate to="/login" replace />;
  }
  if (
    authed &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/doctor-login")
  ) {
    return <Navigate to="/home" replace />;
  }

  // Authenticated routes
  if (authed) {
    return (
      <>
        <HeaderBar />
        <Root>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/upload" element={<Scan />} />
            <Route path="/results" element={<Results />} />
            <Route path="/more" element={<More />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/bacteria/:id" element={<BacteriaRouter />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Root>
      </>
    );
  }

  // Unauthenticated: allow login, register, doctor-login
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AppRoutes />
      </Router>
    </I18nextProvider>
  );
}

export default App;
