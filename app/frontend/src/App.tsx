import React from 'react';
import './translations/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './translations/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from './screens/landing/LandingScreen';
import HeaderBar from './components/HeaderBar';
import BottomBar from './components/BottomBar';
import styled from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const AppContainer = styled.View`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <AppContainer>
            <HeaderBar />
            <ContentContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Landing" component={LandingScreen} />
              </Stack.Navigator>
            </ContentContainer>
            <BottomBar />
          </AppContainer>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
