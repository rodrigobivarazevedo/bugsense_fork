import React, { useState, useRef } from 'react';
import './translations/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/i18n';
import { useTranslation } from 'react-i18next';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import HeaderBar from './components/HeaderBar';
import BottomBar from './components/BottomBar';

import Login from './screens/Login';
import Home from './screens/Home';
import Scan from './screens/Scan';
import Results from './screens/Results';
import More from './screens/More';
import Account from './screens/Account';
import LanguageSelection from './screens/LanguageSelection';
import Discover from './screens/Discover';
import BacteriaRouter from './screens/BacteriaRouter';

const routes = [
  { name: 'Login', component: Login, wrapped: false },
  { name: 'Home', component: Home, wrapped: true, showBottomBar: true },
  { name: 'Scan', component: Scan, wrapped: true, showBottomBar: true },
  { name: 'Results', component: Results, wrapped: true, showBottomBar: true },
  { name: 'More', component: More, wrapped: true, showBottomBar: true },
  { name: 'Account', component: Account, wrapped: true, showBottomBar: true },
  { name: 'LanguageSelection', alias: 'language', component: LanguageSelection, wrapped: true, showBottomBar: false },
  { name: 'Discover', component: Discover, wrapped: true, showBottomBar: false },
  { name: 'BacteriaRouter', alias: 'discover_bacteria', component: BacteriaRouter, wrapped: true, showBottomBar: false },
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('Home');
  const navRef = useRef<NavigationContainerRef<any>>(null);
  const { t } = useTranslation();
  const showBottomBar = routes.find(r => r.name === currentRoute)?.showBottomBar;
  const Stack = createNativeStackNavigator();

  const AppContainer = styled.View`
    flex: 1;
  `;
  const ContentContainer = styled.View`
    flex: 1;
  `;

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer
          ref={navRef}
          onReady={() => {
            const name = navRef.current?.getCurrentRoute()?.name;
            if (name) setCurrentRoute(name);
          }}
          onStateChange={() => {
            const name = navRef.current?.getCurrentRoute()?.name;
            if (name) setCurrentRoute(name);
          }}
        >
          <AppContainer>
            <ContentContainer>
              <Stack.Navigator
                screenOptions={{
                  header: (props) => {
                    const routeConfig = routes.find(r => r.name === props.route.name);
                    if (routeConfig?.wrapped) {
                      return <HeaderBar {...props} />;
                    }
                    return null;
                  },
                }}
              >
                {routes.map(({ name, alias, component: Component }) => (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={Component}
                    options={{
                      headerTitle: alias ? t(alias) : t(name)
                    }}
                  />
                ))}
              </Stack.Navigator>
            </ContentContainer>
            {showBottomBar && <BottomBar />}
          </AppContainer>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
