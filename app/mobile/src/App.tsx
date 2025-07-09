import { useState, useRef } from 'react';
import './translations/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/i18n';
import { useTranslation } from 'react-i18next';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppContainer = styled.View`
  flex: 1;
`;
const ContentContainer = styled.View`
  flex: 1;
`;

// Main app tabs
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
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer ref={navRef}>
          <AppContainer>
            <ContentContainer>
              <Stack.Navigator
                screenOptions={{
                  header: (props: NativeStackHeaderProps) => {
                    // Only show header for wrapped screens
                    const wrappedScreens = [
                      'Home', 'Scan', 'Tests', 'More', 'Account', 'Patients',
                      'LanguageSelection', 'TimeFormatSelection', 'Discover', 'BacteriaRouter', 'ViewTest'
                    ];
                    if (wrappedScreens.includes(props.route.name)) {
                      return <HeaderBar {...props} />;
                    }
                    return null;
                  },
                }}
              >
                {/* Auth and non-tab screens */}
                <Stack.Screen name="Login" component={UserLogin} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="PasswordRecoveryStep1" component={PasswordRecoveryStep1} />
                <Stack.Screen name="PasswordRecoveryStep2" component={PasswordRecoveryStep2} />
                <Stack.Screen name="PasswordRecoveryStep3" component={PasswordRecoveryStep3} />
                <Stack.Screen name="DoctorLogin" component={DoctorLogin} />
                {/* Main app tabs as a single screen */}
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                {/* Other wrapped screens not in tabs */}
                <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
                <Stack.Screen name="TimeFormatSelection" component={TimeFormatSelection} />
                <Stack.Screen name="Discover" component={Discover} />
                <Stack.Screen name="BacteriaRouter" component={BacteriaRouter} />
                <Stack.Screen name="ViewTest" component={ViewTest} />
              </Stack.Navigator>
            </ContentContainer>
          </AppContainer>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
