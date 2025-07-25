import { useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/i18n';
import { NavigationContainer, type NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { handleThirdPartyLibraryWarnings } from './utils/HandleThirdPartyLibraryWarnings';
handleThirdPartyLibraryWarnings();

import HeaderBar from './components/HeaderBar';
import BottomBar from './components/BottomBar';
import UserLogin from './screens/UserLogin';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import PasswordRecoveryStep1 from './screens/password_recovery_steps/PasswordRecoveryStep1';
import PasswordRecoveryStep2 from './screens/password_recovery_steps/PasswordRecoveryStep2';
import PasswordRecoveryStep3 from './screens/password_recovery_steps/PasswordRecoveryStep3';
import DoctorLogin from './screens/DoctorLogin';
import Home from './screens/Home';
import Scan from './screens/Scan';
import Tests from './screens/Tests';
import More from './screens/More';
import Account from './screens/Account';
import LanguageSelection from './screens/LanguageSelection';
import Discover from './screens/Discover';
import BacteriaRouter from './screens/BacteriaRouter';
import Patients from './screens/Patients';
import TimeFormatSelection from './screens/TimeFormatSelection';
import ViewTest from './screens/ViewTest';
import ViewPatient from './screens/ViewPatient';
import PatientTests from './screens/PatientTests';
import News from './screens/News';
import Notifications from './screens/Notifications';
import Overview from './screens/Overview';
import { NotificationProvider } from './context/NotificationContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppContainer = styled.View`
  flex: 1;
`;
const ContentContainer = styled.View`
  flex: 1;
`;

const WRAPPED_SCREENS_AND_TITLES_TRANSLATION_KEYS: Record<string, string> = {
  Home: 'home',
  Scan: 'scan',
  Tests: 'tests',
  More: 'more',
  Account: 'account',
  Patients: 'patients',
  LanguageSelection: 'language',
  TimeFormatSelection: 'time_format_selection',
  Discover: 'discover_bacteria',
  BacteriaRouter: 'discover_bacteria',
  ViewTest: 'test_details_and_result',
  ViewPatient: 'patient_details',
  PatientTests: 'patient_tests',
  News: 'news',
  Notifications: 'notifications',
  Overview: 'overview',
};

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => <BottomBar {...props} />}
      screenOptions={({ navigation, route }) => ({
        header: (headerProps) => (
          <HeaderBar
            {...headerProps}
            navigation={navigation}
            route={route}
            headerTitle={WRAPPED_SCREENS_AND_TITLES_TRANSLATION_KEYS[route.name] || route.name}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="Tests" component={Tests} />
      <Tab.Screen name="More" component={More} />
      <Tab.Screen name="Account" component={Account} />
      <Tab.Screen name="Patients" component={Patients} />
    </Tab.Navigator>
  );
}

export default function App() {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NotificationProvider>
          <NavigationContainer ref={navRef}>
            <AppContainer>
              <ContentContainer>
                <Stack.Navigator
                  screenOptions={{
                    header: (props: NativeStackHeaderProps) => {
                      if (Object.keys(WRAPPED_SCREENS_AND_TITLES_TRANSLATION_KEYS).includes(props.route.name)) {
                        return (
                          <HeaderBar
                            {...props}
                            headerTitle={WRAPPED_SCREENS_AND_TITLES_TRANSLATION_KEYS[props.route.name] || props.route.name}
                          />
                        );
                      }
                      return null;
                    },
                  }}
                >
                  <Stack.Screen name="Login" component={UserLogin} />
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                  <Stack.Screen name="PasswordRecoveryStep1" component={PasswordRecoveryStep1} />
                  <Stack.Screen name="PasswordRecoveryStep2" component={PasswordRecoveryStep2} />
                  <Stack.Screen name="PasswordRecoveryStep3" component={PasswordRecoveryStep3} />
                  <Stack.Screen name="DoctorLogin" component={DoctorLogin} />
                  <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                  <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
                  <Stack.Screen name="TimeFormatSelection" component={TimeFormatSelection} />
                  <Stack.Screen name="Discover" component={Discover} />
                  <Stack.Screen name="BacteriaRouter" component={BacteriaRouter} />
                  <Stack.Screen name="ViewTest" component={ViewTest} />
                  <Stack.Screen name="ViewPatient" component={ViewPatient} />
                  <Stack.Screen name="PatientTests" component={PatientTests} />
                  <Stack.Screen name="News" component={News} />
                  <Stack.Screen name="Notifications" component={Notifications} />
                  <Stack.Screen name="Overview" component={Overview} />
                </Stack.Navigator>
              </ContentContainer>
            </AppContainer>
          </NavigationContainer>
        </NotificationProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
