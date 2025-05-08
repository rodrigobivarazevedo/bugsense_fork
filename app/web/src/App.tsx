import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/18n';
import logo from './logo.svg';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        <p>
          {t('hello')}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          </a>
        </header>
      </div>
    </I18nextProvider>
  );
}

export default App;
