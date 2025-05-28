import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import i18n from "./translations/18n";
import Home from "./views/Home";
import Account from "./views/Account";
import HeaderBar from "./components/HeaderBar";
import Root from "./root/Root";
import Scan from "./views/Scan";
import Results from "./views/Results";
import More from "./views/More";
import Notifications from "./views/Notifications";
import Login from "./views/Login";

const AppRoutes = () => {
  const location = useLocation();
  const showHeader = location.pathname !== "/login";
  const showRoot = location.pathname !== "/login";

  return (
    <div>
      {showHeader && <HeaderBar />}
      {showRoot ? (
        <Root>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/results" element={<Results />} />
            <Route path="/more" element={<More />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Root>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </div>
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
