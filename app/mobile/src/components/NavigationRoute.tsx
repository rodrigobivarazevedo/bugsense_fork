import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Results: undefined;
    More: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type RouteName = 'home' | 'scan' | 'results' | 'more';

interface NavigationRouteProps {
    route: RouteName;
    children: React.ReactNode;
}

const NavigationRoute: React.FC<NavigationRouteProps> = ({ route, children }) => {
    const navigation = useNavigation<NavigationProp>();

    const handlePress = () => {
        const navigationRoute = route.charAt(0).toUpperCase() + route.slice(1);
        navigation.navigate(navigationRoute as keyof RootStackParamList);
    };

    return (
        <React.Fragment>
            {React.cloneElement(children as React.ReactElement, { onPress: handlePress })}
        </React.Fragment>
    );
};

export default NavigationRoute;
