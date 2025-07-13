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
import Tests from "./views/Tests";
import More from "./views/More";
import Notifications from "./views/Notifications";
import Login from "./views/Login";
import Discover from "./views/Discover";
import BacteriaRouter from "./views/BacteriaRouter";
import Register from "./views/Register";
import DoctorLogin from "./views/DoctorLogin";
import LanguageSelection from "./views/LanguageSelection";
import ForgotPassword from "./views/ForgotPassword";
import PasswordRecoveryStep1 from "./views/PasswordRecoveryStep1";
import PasswordRecoveryStep2 from "./views/PasswordRecoveryStep2";
import TimeFormatSelection from "./views/TimeFormatSelection";
import News from "./views/News";
import Patients from "./views/Patients";
import ViewTest from "./views/ViewTest";
import ViewPatient from "./views/ViewPatient";
import PatientTests from "./views/PatientTests";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const AppRoutes = () => {
  const location = useLocation();
  const authed = isAuthenticated();


  if (
    !authed &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/doctor-login" &&
    location.pathname !== "/forgot-password" &&
    location.pathname !== "/password-recovery-step1" &&
    location.pathname !== "/password-recovery-step2"
  ) {
    return <Navigate to="/login" replace />;
  }
  if (
    authed &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/doctor-login" ||
      location.pathname === "/forgot-password" ||
      location.pathname === "/password-recovery-step1" ||
      location.pathname === "/password-recovery-step2")
  ) {
    return <Navigate to="/home" replace />;
  }


  if (authed) {
    return (
      <>
        <HeaderBar />
        <Root>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/upload" element={<Scan />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/more" element={<More />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/bacteria/:id" element={<BacteriaRouter />} />
            <Route
              path="/time-format-selection"
              element={<TimeFormatSelection />}
            />
            <Route path="/news" element={<News />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/view-test" element={<ViewTest />} />
            <Route path="/view-patient" element={<ViewPatient />} />
            <Route path="/patient-tests" element={<PatientTests />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Root>
      </>
    );
  }


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/password-recovery-step1"
        element={<PasswordRecoveryStep1 />}
      />
      <Route
        path="/password-recovery-step2"
        element={<PasswordRecoveryStep2 />}
      />
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
