import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import RenderIcon from './RenderIcon';

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<string>('home');
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        if (navigationState && navigationState.routes.length > 0) {
            const currentRoute = navigationState.routes[navigationState.index].name.toLowerCase() as string;
            if (currentRoute === 'home' || currentRoute === 'scan' ||
                currentRoute === 'results' || currentRoute === 'more') {
                setActiveTab(currentRoute);
            } else {
                setActiveTab("");
            }
        }
    }, [navigationState]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1) as never);
    };

    return (
        <S.Container insets={insets}>
            <TouchableOpacity onPress={() => handleTabChange('home')}>
                <S.IconWrapper>
                    <RenderIcon
                        family="foundation"
                        icon="home"
                        fontSize={24}
                        color={activeTab === 'home' ? "primary" : "themeGray"}
                    />
                    <S.Label isActive={activeTab === 'home'}>Home</S.Label>
                </S.IconWrapper>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleTabChange('scan')}>
                <S.IconWrapper>
                    <RenderIcon
                        family="entypo"
                        icon="camera"
                        fontSize={24}
                        color={activeTab === 'scan' ? "primary" : "themeGray"}
                    />
                    <S.Label isActive={activeTab === 'scan'}>Scan</S.Label>
                </S.IconWrapper>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleTabChange('results')}>
                <S.IconWrapper>
                    <RenderIcon
                        family="foundation"
                        icon="results"
                        fontSize={24}
                        color={activeTab === 'results' ? "primary" : "themeGray"}
                    />
                    <S.Label isActive={activeTab === 'results'}>Results</S.Label>
                </S.IconWrapper>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleTabChange('more')}>
                <S.IconWrapper>
                    <RenderIcon
                        family="feather"
                        icon="more-horizontal"
                        fontSize={24}
                        color={activeTab === 'more' ? "primary" : "themeGray"}
                    />
                    <S.Label isActive={activeTab === 'more'}>More</S.Label>
                </S.IconWrapper>
            </TouchableOpacity>
        </S.Container>
    );
};

export default BottomBar;
