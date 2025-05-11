import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import i18n from './translations/18n';
import Home from './views/Home';
import Account from './views/Account';
import HeaderBar from './components/HeaderBar';
import Root from './root/Root';

function App() {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div>
          <HeaderBar />
          <Root>
            <Routes>
              <Route path="*" element={<div>Page not found</div>} />
              <Route path="/" element={<Home />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </Root>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
