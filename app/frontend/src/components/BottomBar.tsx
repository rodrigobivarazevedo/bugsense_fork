import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationRoute, { RouteName } from './NavigationRoute';
import { useNavigationState } from '@react-navigation/native';

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<RouteName>('home');
    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        if (navigationState && navigationState.routes.length > 0) {
            const currentRoute = navigationState.routes[navigationState.index].name.toLowerCase() as RouteName;
            if (currentRoute === 'home' || currentRoute === 'discover' ||
                currentRoute === 'scan' || currentRoute === 'results' ||
                currentRoute === 'menu') {
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
                        <S.Icon name="home" size={24} isActive={activeTab === 'home'} />
                        {activeTab === 'home' && <S.ActiveIndicator />}
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="discover">
                <TouchableOpacity onPress={() => handleTabChange('discover')}>
                    <S.IconWrapper>
                        <S.Icon name="search" size={24} isActive={activeTab === 'discover'} />
                        {activeTab === 'discover' && <S.ActiveIndicator />}
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="scan">
                <TouchableOpacity onPress={() => handleTabChange('scan')}>
                    <S.IconWrapper>
                        <S.Icon name="camera-alt" size={24} isActive={activeTab === 'scan'} />
                        {activeTab === 'scan' && <S.ActiveIndicator />}
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="results">
                <TouchableOpacity onPress={() => handleTabChange('results')}>
                    <S.IconWrapper>
                        <S.Icon name="assessment" size={24} isActive={activeTab === 'results'} />
                        {activeTab === 'results' && <S.ActiveIndicator />}
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>

            <NavigationRoute route="menu">
                <TouchableOpacity onPress={() => handleTabChange('menu')}>
                    <S.IconWrapper>
                        <S.Icon name="menu" size={24} isActive={activeTab === 'menu'} />
                        {activeTab === 'menu' && <S.ActiveIndicator />}
                    </S.IconWrapper>
                </TouchableOpacity>
            </NavigationRoute>
        </S.Container>
    );
};

export default BottomBar;
