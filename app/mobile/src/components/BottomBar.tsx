import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './BottomBar.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import RenderIcon from './RenderIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_TABS = [
    { key: 'home', label: 'Home', family: 'foundation', icon: 'home' },
    { key: 'scan', label: 'Scan', family: 'entypo', icon: 'camera' },
    { key: 'results', label: 'Results', family: 'foundation', icon: 'results' },
    { key: 'more', label: 'More', family: 'feather', icon: 'more-horizontal' },
];

const DOCTOR_TABS = [
    { key: 'home', label: 'Home', family: 'foundation', icon: 'home' },
    { key: 'patients', label: 'Patients', family: 'ionIcons', icon: 'people' },
    { key: 'more', label: 'More', family: 'feather', icon: 'more-horizontal' },
];

const BottomBar: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<string>('home');
    const [userType, setUserType] = useState<string>('patient');
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        AsyncStorage.getItem('userType').then(type => {
            if (type) setUserType(type);
        });
    }, []);

    useEffect(() => {
        if (!navigationState?.routes?.length) return;
        const current = navigationState.routes[navigationState.index].name.toLowerCase();
        const tabs = userType === 'doctor' ? DOCTOR_TABS : USER_TABS;
        setActiveTab(tabs.some(t => t.key === current) ? current : '');
    }, [navigationState, userType]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const routeName = key.charAt(0).toUpperCase() + key.slice(1);
        navigation.navigate(routeName as never);
    };

    const tabs = userType === 'doctor' ? DOCTOR_TABS : USER_TABS;

    return (
        <S.Container insets={insets}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    onPress={() => handleTabChange(tab.key)}
                >
                    <S.IconWrapper>
                        <RenderIcon
                            family={tab.family as any}
                            icon={tab.icon}
                            fontSize={24}
                            color={activeTab === tab.key ? 'primary' : 'themeGray'}
                        />
                        <S.Label isActive={activeTab === tab.key}>
                            {tab.label}
                        </S.Label>
                    </S.IconWrapper>
                </TouchableOpacity>
            ))}
        </S.Container>
    );
};

export default BottomBar;
