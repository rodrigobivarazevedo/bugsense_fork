import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationRoute, { RouteName } from './NavigationRoute';
import { useNavigationState } from '@react-navigation/native';
import IconRenderer from './IconRenderer';
import { themeColors } from '../theme/global';

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<RouteName>('home');
    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        if (navigationState && navigationState.routes.length > 0) {
            const currentRoute = navigationState.routes[navigationState.index].name.toLowerCase() as RouteName;
            if (currentRoute === 'home' || currentRoute === 'scan' ||
                currentRoute === 'results' || currentRoute === 'more') {
                setActiveTab(currentRoute);
            }
        }
    }, [navigationState]);

    const handleTabChange = (tab: RouteName) => {
        setActiveTab(tab);
    };

    return (
        <S.Container insets={insets}>
            <NavigationRoute route="home">
                <TouchableOpacity onPress={() => handleTabChange('home')}>
                    <S.IconWrapper>
                        <IconRenderer
                            family="foundation"
                            icon="home"
                            fontSize={24}
                            color={activeTab === 'home' ? "primary" : "themeGray"}
                        />
                        <S.Label isActive={activeTab === 'home'}>Home</S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="scan">
                <TouchableOpacity onPress={() => handleTabChange('scan')}>
                    <S.IconWrapper>
                        <IconRenderer
                            family="entypo"
                            icon="camera"
                            fontSize={24}
                            color={activeTab === 'scan' ? "primary" : "themeGray"}
                        />
                        <S.Label isActive={activeTab === 'scan'}>Scan</S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="results">
                <TouchableOpacity onPress={() => handleTabChange('results')}>
                    <S.IconWrapper>
                        <IconRenderer
                            family="foundation"
                            icon="results"
                            fontSize={24}
                            color={activeTab === 'results' ? "primary" : "themeGray"}
                        />
                        <S.Label isActive={activeTab === 'results'}>Results</S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="more">
                <TouchableOpacity onPress={() => handleTabChange('more')}>
                    <S.IconWrapper>
                        <IconRenderer
                            family="feather"
                            icon="more-horizontal"
                            fontSize={24}
                            color={activeTab === 'more' ? "primary" : "themeGray"}
                        />
                        <S.Label isActive={activeTab === 'more'}>More</S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>
        </S.Container>
    );
};

export default BottomBar;
