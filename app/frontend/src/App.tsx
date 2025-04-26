import React, { useState, useRef } from 'react';
import './translations/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/i18n';
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

// TODO: uncomment login screen after login is implemented
const routes = [
  // { name: 'Login', component: Login, wrapped: false },
  { name: 'Home', component: Home, wrapped: true },
  { name: 'Scan', component: Scan, wrapped: true },
  { name: 'Results', component: Results, wrapped: true },
  { name: 'More', component: More, wrapped: true },
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('Home');
  const navRef = useRef<NavigationContainerRef<any>>(null);

  const isWrapped = routes.find(r => r.name === currentRoute)?.wrapped;
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
            {isWrapped && <HeaderBar />}
            <ContentContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {routes.map(({ name, component: Component }) => (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={Component}
                  />
                ))}
              </Stack.Navigator>
            </ContentContainer>
            {isWrapped && <BottomBar />}
          </AppContainer>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
